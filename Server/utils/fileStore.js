/**
 * Lightweight file-backed document store.
 *
 * Used as an automatic fallback when MongoDB (MONGO_URI) is unreachable, so the
 * whole application still runs with zero external dependencies. It implements
 * the small subset of the Mongoose API this app uses:
 *
 *   Model.findById / findOne / find().sort().skip().limit().lean()
 *   Model.countDocuments / create / updateOne / deleteOne / deleteMany
 *   doc.save() (with pre-save hooks), doc.deleteOne(), doc methods, isNew
 *
 * Data is persisted (debounced) to DATA_FILE so it survives restarts.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const newId = () => crypto.randomBytes(12).toString('hex'); // 24 hex chars, ObjectId-like

// Dates are persisted as ISO strings; normalize both sides before comparing.
const norm = (v) => (v instanceof Date ? v.toISOString() : v);

const matchesFilter = (doc, filter = {}) => {
  const keys = Object.keys(filter);
  for (const key of keys) {
    const cond = norm(filter[key]);
    if (cond === null || cond === undefined) {
      if (doc[key] !== cond) return false;
      continue;
    }
    // Mongo-style operators
    if (typeof cond === 'object' && !Array.isArray(cond) && (cond.$gte !== undefined || cond.$lte !== undefined || cond.$gt !== undefined || cond.$lt !== undefined || cond.$ne !== undefined || cond.$in !== undefined || cond.$regex !== undefined)) {
      const value = norm(key.split('.').reduce((o, k) => (o == null ? o : o[k]), doc));
      if (cond.$in !== undefined && !cond.$in.includes(value)) return false;
      if (cond.$ne !== undefined && value === cond.$ne) return false;
      if (cond.$gte !== undefined && !(value >= cond.$gte)) return false;
      if (cond.$lte !== undefined && !(value <= cond.$lte)) return false;
      if (cond.$gt !== undefined && !(value > cond.$gt)) return false;
      if (cond.$lt !== undefined && !(value < cond.$lt)) return false;
      if (cond.$regex !== undefined && !new RegExp(cond.$regex, cond.$options || 'i').test(String(value ?? ''))) return false;
      continue;
    }
    // plain equality (supports dotted paths e.g. 'wallet.balance')
    const value = norm(key.split('.').reduce((o, k) => (o == null ? o : o[k]), doc));
    if (value !== cond) return false;
  }
  return true;
};

const applyUpdate = (doc, update) => {
  for (const op of Object.keys(update)) {
    if (op === '$set') {
      for (const [k, v] of Object.entries(update.$set)) {
        const parts = k.split('.');
        let target = doc;
        while (parts.length > 1) { target[parts[0]] = target[parts[0]] || {}; target = target[parts[0]]; parts.shift(); }
        target[parts[0]] = v;
      }
    } else if (op === '$inc') {
      for (const [k, v] of Object.entries(update.$inc)) {
        const parts = k.split('.');
        let target = doc;
        while (parts.length > 1) { target[parts[0]] = target[parts[0]] || {}; target = target[parts[0]]; parts.shift(); }
        target[parts[0]] = (Number(target[parts[0]]) || 0) + Number(v);
      }
    } else if (op === '$push') {
      for (const [k, v] of Object.entries(update.$push)) {
        const parts = k.split('.');
        let target = doc;
        while (parts.length > 1) { target[parts[0]] = target[parts[0]] || {}; target = target[parts[0]]; parts.shift(); }
        if (!Array.isArray(target[parts[0]])) target[parts[0]] = [];
        target[parts[0]].push(v);
      }
    } else if (op === '$pull') {
      for (const [k, v] of Object.entries(update.$pull)) {
        const parts = k.split('.');
        let target = doc;
        while (parts.length > 1) { target[parts[0]] = target[parts[0]] || {}; target = target[parts[0]]; parts.shift(); }
        if (Array.isArray(target[parts[0]])) {
          target[parts[0]] = target[parts[0]].filter((item) => {
            if (typeof v === 'object' && v !== null) return !matchesFilter(item, v);
            return item !== v;
          });
        }
      }
    } else if (op === '$unset') {
      for (const [k] of Object.entries(update.$unset)) delete doc[k];
    } else if (!op.startsWith('$')) {
      // plain object update -> shallow merge
      Object.assign(doc, update);
    }
  }
};

class Query {
  constructor(docs, Model) {
    this._docs = docs;
    this._Model = Model;
    this._sort = null;
    this._skip = 0;
    this._limit = 0;
  }
  sort(spec) {
    this._sort = spec; // { field: 1 | -1 } or 'field' / '-field'
    return this;
  }
  skip(n) { this._skip = n; return this; }
  limit(n) { this._limit = n; return this; }
  _apply() {
    let docs = [...this._docs];
    if (this._sort) {
      let field, dir;
      if (typeof this._sort === 'string') { field = this._sort.replace(/^-/, ''); dir = this._sort.startsWith('-') ? -1 : 1; }
      else { const [f, d] = Object.entries(this._sort)[0]; field = f; dir = d >= 0 ? 1 : -1; }
      docs.sort((a, b) => {
        const av = field.split('.').reduce((o, k) => (o == null ? o : o[k]), a);
        const bv = field.split('.').reduce((o, k) => (o == null ? o : o[k]), b);
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * dir;
      });
    }
    if (this._skip) docs = docs.slice(this._skip);
    if (this._limit) docs = docs.slice(0, this._limit);
    return docs;
  }
  async then(resolve, reject) {
    try {
      const docs = this._apply().map((d) => this._Model._hydrate(d));
      resolve(docs);
    } catch (e) { reject(e); }
  }
  async lean() { return this._apply().map((d) => JSON.parse(JSON.stringify(d))); }
}

function defineModel({ db, name, fields = {}, methods = {}, statics = {}, preSave, preValidate }) {
  const collection = () => db.collection(name);
  const applyDefaults = (props) => {
    const doc = {};
    for (const [key, def] of Object.entries(fields)) {
      if (def && def.default !== undefined) {
        doc[key] = typeof def.default === 'function' ? def.default() : def.default;
      }
    }
    return { ...doc, ...props };
  };

  class Doc {
    constructor(props = {}) {
      const merged = applyDefaults(props);
      for (const [k, v] of Object.entries(merged)) this[k] = v;
      if (!this._id) this._id = newId();
      this.isNew = props._persisted !== true;
      delete this._persisted;
      Object.assign(this, methods);
    }
    async save() {
      if (preValidate) await preValidate.call(this);
      if (preSave) await preSave.call(this);
      this.isNew = false;
      const docs = collection();
      const idx = docs.findIndex((d) => String(d._id) === String(this._id));
      const plain = JSON.parse(JSON.stringify(this));
      if (idx >= 0) docs[idx] = plain; else docs.push(plain);
      db.persist();
      return this;
    }
    async deleteOne() {
      const docs = collection();
      const idx = docs.findIndex((d) => String(d._id) === String(this._id));
      if (idx >= 0) docs.splice(idx, 1);
      db.persist();
      return this;
    }
    toObject() { return JSON.parse(JSON.stringify(this)); }
    get _doc() { return this; }
  }
  // expose _id as string helper
  Object.defineProperty(Doc.prototype, 'id', { get() { return String(this._id); } });

  class Model extends Doc {
    static _hydrate(raw) {
      const doc = new Model({ ...JSON.parse(JSON.stringify(raw)) });
      doc.isNew = false;
      return doc;
    }
    static async findById(id) {
      if (id === undefined || id === null) return null;
      const raw = collection().find((d) => String(d._id) === String(id));
      return raw ? Model._hydrate(raw) : null;
    }
    static async findOne(filter = {}) {
      const raw = collection().find((d) => matchesFilter(d, filter));
      return raw ? Model._hydrate(raw) : null;
    }
    static find(filter = {}) {
      return new Query(collection().filter((d) => matchesFilter(d, filter)), Model);
    }
    static async countDocuments(filter = {}) {
      return collection().filter((d) => matchesFilter(d, filter)).length;
    }
    static async exists(filter) { return (await Model.findOne(filter)) ? true : false; }
    static async create(props) {
      const doc = new Model(props);
      await doc.save();
      return doc;
    }
    static async insertMany(arr) {
      const out = [];
      for (const props of arr) out.push(await Model.create(props));
      return out;
    }
    static async updateOne(filter, update) {
      const raw = collection().find((d) => matchesFilter(d, filter));
      if (!raw) return { modifiedCount: 0, matchedCount: 0 };
      applyUpdate(raw, update);
      db.persist();
      return { modifiedCount: 1, matchedCount: 1 };
    }
    static async updateMany(filter, update) {
      let n = 0;
      for (const raw of collection().filter((d) => matchesFilter(d, filter))) { applyUpdate(raw, update); n++; }
      if (n) db.persist();
      return { modifiedCount: n };
    }
    static async deleteOne(filter) {
      const docs = collection();
      const idx = docs.findIndex((d) => matchesFilter(d, filter));
      if (idx >= 0) { docs.splice(idx, 1); db.persist(); return { deletedCount: 1 }; }
      return { deletedCount: 0 };
    }
    static async deleteMany(filter = {}) {
      const docs = collection();
      const keep = docs.filter((d) => !matchesFilter(d, filter));
      const n = docs.length - keep.length;
      db.data[name] = keep;
      db.persist();
      return { deletedCount: n };
    }
  }
  Object.assign(Model, statics);
  return Model;
}

class FileDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
    this._timer = null;
    try {
      if (fs.existsSync(filePath)) this.data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error('[fileStore] could not read data file, starting fresh:', e.message);
      this.data = {};
    }
  }
  collection(name) {
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }
  persist() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => this.flush(), 150);
  }
  flush() {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 1));
    } catch (e) {
      console.error('[fileStore] persist failed:', e.message);
    }
  }
  model(name, definition) {
    return defineModel({ db: this, ...definition });
  }
}

module.exports = { FileDatabase, newId };
