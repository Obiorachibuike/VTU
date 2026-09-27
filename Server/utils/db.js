/**
 * Database bootstrap.
 *
 * 1. Tries MongoDB (MONGO_URI) first — the production path.
 * 2. If unreachable (e.g. no internet / IP not whitelisted / local dev without
 *    a database), automatically falls back to an embedded file store so the
 *    whole application still works out of the box.
 *
 * Force a backend with DB_MODE=mongo|file.
 */
const path = require('path');
const mongoose = require('mongoose');
const { FileDatabase } = require('./fileStore');
const { initModels, getDbMode } = require('../models');

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', '.data', 'vtu-store.json');

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  const wantMongo = uri && process.env.DB_MODE !== 'file';

  if (wantMongo) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT || 8000),
      });
      initModels({ mode: 'mongoose' });
      console.log('[db] Connected to MongoDB');
      return 'mongoose';
    } catch (err) {
      console.warn(`[db] MongoDB unreachable (${err.message})`);
    }
  }

  const fileDb = new FileDatabase(DATA_FILE);
  initModels({ mode: 'file', fileDb });
  console.log(`[db] Using embedded file store: ${DATA_FILE}`);
  return 'file';
};

module.exports = { connectDb, getDbMode };
