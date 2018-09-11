const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { upperFirst: _upperFirst } = require('lodash');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database/config.json')[env];

const { addTransactionsBehaviour } = require('../utils/sequelize/transactions');
const { addAbilityToInjectCrudMethods } = require('../utils/sequelize/model-crud-methods');

const sequelize = new Sequelize(config.database, config.username, config.password, config);
addTransactionsBehaviour(sequelize);
addAbilityToInjectCrudMethods(sequelize);

const db = {};

fs.readdirSync(__dirname)
  .filter(directoryItem => (directoryItem.length > 0 && directoryItem.indexOf('.') !== 0 && directoryItem !== basename))
  .forEach(directoryItem => {
    const model = sequelize['import'](path.join(__dirname, `${directoryItem}/index.js`));
    db[model.name] = model;
  });

// Establish relations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Pull from execution to allow all models to be added to db object.
setTimeout(() => {
  fs.readdirSync(__dirname)
    .filter(directoryItem => (directoryItem.length > 0 && directoryItem.indexOf('.') !== 0 && directoryItem !== basename))
    .forEach(directoryItem => {
      const modelName = directoryItem
        .split('-')
        .filter(modelNamePart => modelNamePart !== '-')
        .map(modelNamePart => _upperFirst(modelNamePart))
        .join('');

      // Add methods to models
      const methods = fs.existsSync(path.join(__dirname, `${directoryItem}/methods/index.js`))
        ? require(path.join(__dirname, `${directoryItem}/methods/index.js`))
        : null;

      if (methods && db[modelName]) {
        Object.assign(db[modelName], methods);
      }

      if (db[modelName]) {
        sequelize.addCrudMethods(db[modelName]);
      }

      // Add hooks to models.
      const hooks = fs.existsSync(path.join(__dirname, `${directoryItem}/hooks/index.js`))
        ? require(path.join(__dirname, `${directoryItem}/hooks/index.js`))
        : null;
      if (hooks && db[modelName]) {
        Object.keys(hooks).forEach(hookType => db[modelName].addHook(hookType, hooks[hookType]))
      }
    });
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
