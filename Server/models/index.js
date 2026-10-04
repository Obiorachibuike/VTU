/**
 * Model factory.
 *
 * Works identically on Mongoose (production / MongoDB available) and on the
 * embedded file store (automatic fallback when MongoDB is unreachable).
 *
 * Usage:  const User = getModel('User');   // call inside handlers
 */
const mongoose = require('mongoose');
const { userSpec, transactionSpec, bankAccountSpec, carSpec } = require('./specs');

const ALL_SPECS = [userSpec, transactionSpec, bankAccountSpec, carSpec];

let models = {};
let dbMode = 'mongoose';

const buildMongooseModel = (spec) => {
  const definition = {};
  for (const [key, cfg] of Object.entries(spec.fields)) {
    if (cfg && cfg.type === 'Object') {
      definition[key] = { type: mongoose.Schema.Types.Mixed, default: cfg.default };
    } else if (cfg && cfg.type === 'Array') {
      definition[key] = { type: Array, default: cfg.default };
    } else {
      definition[key] = cfg;
    }
  }
  const schema = new mongoose.Schema(definition, { minimize: false, versionKey: false });
  for (const [fnName, fn] of Object.entries(spec.methods || {})) schema.method(fnName, fn);
  for (const [fnName, fn] of Object.entries(spec.statics || {})) schema.static(fnName, fn);
  if (spec.preSave) {
    schema.pre('save', function (next) {
      Promise.resolve(spec.preSave.call(this)).then(() => next()).catch(next);
    });
  }
  return mongoose.models[spec.name] || mongoose.model(spec.name, schema);
};

function initModels({ mode, fileDb }) {
  dbMode = mode;
  models = {};
  for (const spec of ALL_SPECS) {
    models[spec.name] = mode === 'file' ? fileDb.model(spec.name, spec) : buildMongooseModel(spec);
  }
  return models;
}

function getModel(name) {
  if (!models[name]) throw new Error(`Model "${name}" not initialised. Did the DB connect?`);
  return models[name];
}

const getDbMode = () => dbMode;

module.exports = { initModels, getModel, getDbMode };
