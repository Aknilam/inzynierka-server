var Sequelize = require('sequelize');

var PROJECT = require('./project.js');
var PROJECT_USERS = require('./projectUsers.js');
var USER = require('./user.js');

var MATERIAL = require('./material.js');
var MATERIAL_TAGS = require('./materialTags.js');
var TAG = require('./tag.js');

// There are many users in many projects
PROJECT.hasMany(USER, { through: PROJECT_USERS });
USER.hasMany(PROJECT, { through: PROJECT_USERS });

// User can create many projects
USER.hasMany(PROJECT, { as: 'Creator' });

// Project has many materials
PROJECT.hasMany(MATERIAL);

// There are many tags for many materials
MATERIAL.hasMany(TAG, { through: MATERIAL_TAGS });
TAG.hasMany(MATERIAL, { through: MATERIAL_TAGS });

// There are many tags in single project
PROJECT.hasMany(TAG);

module.exports.PROJECT = PROJECT;
module.exports.PROJECT_USERS = PROJECT_USERS;
module.exports.USER = USER;
module.exports.MATERIAL = MATERIAL;
module.exports.MATERIAL_TAGS = MATERIAL_TAGS;
module.exports.TAG = TAG;
