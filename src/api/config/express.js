var express = require('express.io');

express.response.unauthorized = function() {
  this.status(401).json("Unauthorized");
};

express.response.alreadyClosed = function() {
  this.status(419).json("closed");
};

express.response.forbidden = function() {
  this.status(403).json("Forbidden");
};

express.response.notexists = function() {
  this.status(404).json("Not exists");
};

express.response.success = function(data) {
  this.status(200).end(JSON.stringify(data));
};

express.response.error = function(message, data) {
  this.status(400).end(JSON.stringify({message:message, data:data}));
};

module.exports = express;
