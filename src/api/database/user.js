var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var USER = sequelize.define('Users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {});

module.exports = USER;
