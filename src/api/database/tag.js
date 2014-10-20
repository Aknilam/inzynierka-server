var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var TAG = sequelize.define('Tags', {
  name: Sequelize.STRING
}, {});

module.exports = TAG;
