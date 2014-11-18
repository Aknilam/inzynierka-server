var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var TAG = sequelize.define('Tags', {
  //creator: Sequelize.INTEGER,
  name: Sequelize.STRING
}, {});

module.exports = TAG;
