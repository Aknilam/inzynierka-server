var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var MATERIAL_TAGS = sequelize.define('MaterialTags', {}, {
  updatedAt: false,
  createdAt: false
});

module.exports = MATERIAL_TAGS;
