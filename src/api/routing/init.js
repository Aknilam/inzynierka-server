var MATERIAL = require('../database/models.js').MATERIAL;
var TAG = require('../database/models.js').TAG;

var sequelize = require('../database/config.js').sequelize;

module.exports.generateDev = function(req, res, next) {
  sequelize.sync({
    force: true
  }).complete(function(err) {
    res.send('DEV database created');
    console.log('DEV database created');
  });
};

module.exports.generate = function(req, res, next) {
  sequelize.sync({
    force: true
  }).complete(function(err) {
    res.send('Database created');
    console.log('Database created');
  });
};
