var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var MATERIAL = sequelize.define('Materials', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT,
  fileName: Sequelize.STRING,
  angle: Sequelize.FLOAT
}, {});

module.exports = MATERIAL;
