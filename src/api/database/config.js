var Sequelize = require('sequelize');

var sequelize = new Sequelize('silva', '', '', {
  dialect: 'sqlite',
  logging: false,
  storage: 'silva.db'
});

module.exports.sequelize = sequelize;