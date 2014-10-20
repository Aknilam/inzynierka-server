var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var PROJECT_USERS = sequelize.define('ProjectUsers', {
  role: Sequelize.STRING
}, {});

module.exports = PROJECT_USERS;
