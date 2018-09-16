const Promise = require('bluebird');

const isPositiveInteger = test => test >>> 0 === parseFloat(test);

const addAbilityToInjectCrudMethods = sequelize => {
  sequelize.addCrudMethods = model => {

    model.fetchById = (id, options = {}, config = {}) => {
      const strict = config.strict || false;
      const scopes = config.scopes || [];

      return model.scope(scopes).findById(id, options)
      .catch(err => new Error(`Error fetching ${model.name} by id.\n${err}`))
      .tap(result => {
        if ((result === undefined) && strict) return Promise.reject(`Error fetching ${model.name} by id. Requested record not found.`);
      });
    };


    model.fetchOne = (where = {}, options = {}, config = {}) => {
      const strict = config.strict || false;
      const scopes = config.scopes || [];
      options.where = where;

      return model.scope(scopes).findOne(options)
      .catch(err => new Error(`Error fetching ${model.name}.\n${err}`))
      .tap(result => {
        if ((result === undefined) && strict) return Promise.reject(`Error fetching ${model.name}. Requested record not found.`);
      });
    };


    model.fetch = (where = {}, options = {}, config = {}) => {
      options.where = Object.assign({}, options.where || {}, where);
      const strict = config.strict || false;
      const scopes = config.scopes || [];

      return model.scope(scopes).findAll(options)
      .then(results => {
        if ((!results || !results.length) && strict) return Promise.reject(`Error fetching ${model.name}. None matching provided criteria were found.`);
        return results;
      })
      .catch(err => Promise.reject(`Error fetching ${model.name}: ${err}`));
    };


    model.list = (publicQuery = {}, options = {}, config = {}) => {
      // Use array syntax because it is escaped and safer than literal.
      if (publicQuery.order && Array.isArray(publicQuery.order)) {
        Array.isArray(publicQuery.order[0]) || (publicQuery.order = [publicQuery.order]);
      }
      // options.distinct = options.distinct !== false;
      options.where = { ...publicQuery.query, ...options.where };
      options.limit = Number(publicQuery.limit || options.limit || 50);
      options.order = publicQuery.order || options.order || [['createdAt', 'DESC']];
      options.offset = Number(publicQuery.offset || options.offset || 0);
      options.attributes = publicQuery.attributes || options.attributes || {};
      const page = publicQuery.page && Number(publicQuery.page); // Could be undefined.

      if (isPositiveInteger(page)) {
        options.offset = (page - 1) * options.limit;
      }

      const scopes = config.scopes || [];
      console.log('fuck');
      return model.scope(scopes).findAndCountAll(options)
      .then(result => {
        return {
          data: result.rows,
          totalCount: result.count
        };
      })
      .catch(err => Promise.reject(`Error listing ${model.name}: ${err}`));
    };


    model.createOne = function (content = {}, options = {}) {
      if (!content) return Promise.reject(`Error creating ${model.name}, no data provided.`);

      options.returning = options.returning !== false;

      return sequelize.continueTransaction(options, transaction => {
        return model.create(content, { ...options, transaction })
        .then(result => result || Promise.reject(`Error creating ${model.name}, no record successfully inserted.`))
        .catch(err => Promise.reject(`Error creating one ${model.name}: ${err}`));
      });
    };


    model.updateOne = (where = {}, content = {}, options = {}) => {
      if (!where || Object.keys(where).length === 0) return Promise.reject(`${model.name} updateOne must be provided "where" specification.`);
      options.where = where;

      options.returning = options.returning !== false;

      // Fires individual hook events, because update will only fire bulkUpdate event by default.
      options.individualHooks = options.individualHooks !== false;

      // IDs are not updateable.
      if (content.id) {
        delete content.id;
      }

      return sequelize.continueTransaction(options, transaction => {
        return model.update(content, { ...options, transaction })
        .spread((updatedCount, values) => {
          if (!updatedCount) return Promise.reject(`Failed to update one ${model.name}, none updated.`);
          if (updatedCount > 1) return Promise.reject(`Failed to update one ${model.name}, more than one record attempted update.`);
          return values[0];
        })
        .catch(err => Promise.reject(`Failed to update one ${model.name}: ${err}`));
      })
    };


    model.upsertOne = (where = {}, content = {}, options = {}) => {
      options = Object.assign({}, options || {});

      return sequelize.continueTransaction(options, transaction => {
        return model.fetchOne(where, { ...options, transaction }, { strict: false })
        .then(record => {
          console.log(record);
          if (record) return model.updateOne(where, content, options);
          return model.createOne(content, options);
        })
        .catch(err => Promise.reject(`Failed to upsert one ${model.name}: ${err}`));
      });
    };
  };
};


module.exports = {
  addAbilityToInjectCrudMethods
};