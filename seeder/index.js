const fs = require('fs');
const models = require('../models');

return models.sequelize.sync({ force: true })
.then(() => {
  const sql = fs.readFileSync(`${__dirname}/sql-scripts/create_lookups.sql`);
  return models.sequelize.query(sql.toString());
});
