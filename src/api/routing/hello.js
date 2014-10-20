module.exports.hello = function(req, res) {
  res.send('Server hello\'s you');
};

module.exports.ping = function(req, res) {
  res.send('pong');
};
