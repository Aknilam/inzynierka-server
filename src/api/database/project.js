var Sequelize = require('sequelize');
var sequelize = require('./config.js').sequelize;

var PROJECT = sequelize.define('Projects', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  folderName: Sequelize.STRING,
  owner: Sequelize.INTEGER,
  accessCode: Sequelize.STRING,
  accessible: Sequelize.BOOLEAN,
  editable: Sequelize.BOOLEAN,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT,
  zoom: Sequelize.INTEGER
}, {});

module.exports = PROJECT;
