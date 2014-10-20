var Sequelize = require('sequelize');

var USER = require('../database/models.js').USER;
var shareUser = require('../protection/share.js').createUser;

module.exports.login = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    USER.find({where: Sequelize.and({username: username}, {password: password})}).success(function(user) {
      if (user) {
        req.session.userId = user.id;
        req.session.save();
        res.send(shareUser(user));
        console.log("\n sesja podczas logowania: "+ req.session.id + "\n")
      } else {
        res.forbidden();
      }
    });
  }
};

module.exports.isLoggedIn = function(req, res, next) {
  if(!req.session.userId) {
    return res.unauthorized();
  }
  next();
};

module.exports.logout = function(req, res, next) {
  try {
    delete req.session.userId;
    req.session.save();
    res.send(true);
  } catch(e) {
    res.error('error while logging out', e);
  }
};

module.exports.changePassword = function(req, res, next) {
  var userId = req.session.userId;

  USER.find({where: {id: userId}}).success(function(user) {
    if (user) {
      user.updateAttributes({
        password: req.body.password
      }).success(function(tag) {
        if (tag) {
          res.send(true);
        }
      });
    } else {
      res.forbidden();
    }
  });
};

module.exports.register = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    USER.find({where: {username: username}}).success(function(user) {
      if (user) {
        res.error('user already exists');
      } else {
        USER.create({
          username: username,
          password: password
        }).success(function(user) {
          if (user) {
            res.send(shareUser(user));
          } else {
            res.error('failed to create user');
          }
        });
      }
    });    
  }
}
