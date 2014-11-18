// Application configuration
var namespace = '/api/';
var src = './src' + namespace;
var config = require(src + 'config/config.js');

// Routes source
var initRoute = require(src + 'routing/init.js');
var basicRoute = require(src + 'routing/hello.js');
var loginRoute = require(src + 'routing/login.js');
var materialRoute = require(src + 'routing/material.js');
var projectRoute = require(src + 'routing/project.js');
var tagRoute = require(src + 'routing/tag.js');


// Database
var sequelize = require(src + 'database/config.js').sequelize;
sequelize.sync();


// Application configuration
var express = require(src + 'config/express.js');
var app = express().http().io();

var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

app.configure( function() {
  app.use(express.static(__dirname + '/src'));
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({store: sessionStore, secret: 'ProjektInzynierski', key: 'express.sid'}));
});

// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     next();
// });

// Routes
app.get(namespace, basicRoute.hello);

app.get(namespace + 'ping', basicRoute.ping);

// Authentication
app.post(namespace + 'login', loginRoute.login);

app.post(namespace + 'changePassword', loginRoute.changePassword);

app.get(namespace + 'logout', loginRoute.isLoggedIn, loginRoute.logout);

app.post(namespace + 'register', loginRoute.register);

// Tags
app.get(namespace + 'tags/get/:id', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, tagRoute.get);

app.get(namespace + 'tags/all', loginRoute.isLoggedIn, projectRoute.isMember, tagRoute.getAll);

app.post(namespace + 'tags/add', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, tagRoute.add);

app.put(namespace + 'tags/edit/:id', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, tagRoute.edit);

app.delete(namespace + 'tags/remove/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.isEditable, tagRoute.remove);

// Materials
app.get(namespace + 'materials/get/:id', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, materialRoute.get);

app.get(namespace + 'materials/all', loginRoute.isLoggedIn, projectRoute.isMember, materialRoute.getAll);

app.post(namespace + 'materials/add', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, materialRoute.add);

app.post(namespace + 'materials/add/tag', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, materialRoute.addTag);

app.put(namespace + 'materials/edit/:id', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, materialRoute.edit);

app.delete(namespace + 'materials/remove/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.isEditable, materialRoute.remove);

app.delete(namespace + 'materials/remove/tag/:material/:tag', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.isEditable, materialRoute.removeTag);

// Projects
app.get(namespace + 'projects/get/:id', loginRoute.isLoggedIn, projectRoute.isMember, projectRoute.get);

app.get(namespace + 'projects/enter/:id', loginRoute.isLoggedIn, projectRoute.enter);

app.get(namespace + 'projects/all', loginRoute.isLoggedIn, projectRoute.getAll);

app.post(namespace + 'projects/add', loginRoute.isLoggedIn, projectRoute.add);

app.post(namespace + 'projects/join', loginRoute.isLoggedIn, projectRoute.join);

app.put(namespace + 'projects/edit/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.edit);

app.put(namespace + 'projects/open/:id', loginRoute.isLoggedIn, projectRoute.isOwner, projectRoute.open);

app.put(namespace + 'projects/close/:id', loginRoute.isLoggedIn, projectRoute.isOwner, projectRoute.close);

app.put(namespace + 'projects/allow/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.allowEdit);

app.put(namespace + 'projects/deny/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.denyEdit);

app.put(namespace + 'projects/giveadmin/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.giveAdmin);

app.put(namespace + 'projects/takeadmin/:id', loginRoute.isLoggedIn, projectRoute.isAdmin, projectRoute.takeAdmin);

app.delete(namespace + 'projects/remove/:id', loginRoute.isLoggedIn, projectRoute.isOwner, projectRoute.remove);

// Database
app.get(namespace + 'generateDatabase', initRoute.generateDev);

app.listen(config.port, function() {
});

module.exports = app;
