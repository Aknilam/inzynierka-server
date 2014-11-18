var TAG = require('../database/models.js').TAG;
var PROJECT = require('../database/models.js').PROJECT;
var shareTag = require('../protection/share.js').createTag;
var shareMaterial = require('../protection/share.js').createMaterial;

module.exports.get = function(req, res, next) {
  var id = req.params.id;

  TAG.find({where: {id: id}}).then(function(tag) {
    res.send(tag);
  });
};

module.exports.getAll = function(req, res, next) {
  var projectId = req.session.projectId;

  if (projectId) {
    PROJECT.find({where: {id: projectId}}).then(function(project) {
      project.getTags().then(function(tags) {
        res.send(tags);
      });
    });
  }
};

module.exports.add = function(req, res, next) {
  var projectId = req.session.projectId;
  var name = req.body.name;

  if (projectId && name) {
    PROJECT.find({where: {id: projectId}}).then(function(project) {
      TAG.find({where: {name: name, ProjectId: projectId}}).then(function(data) {
        console.log(data);
      });
      if (project) {
        TAG.create({
          name: name
        }).success(function(tag) {
          if (tag) {
            project.addTag(tag).then(function() {
              res.send(tag);
            });
          }
        });
      }
    });
  }
};

module.exports.edit = function(req, res) {
  var id = req.params.id;
  var reqTag = req.body;

  TAG.find({where: {id: id}}).success(function(tag) {
    var oldTag = shareTag(tag);
    tag.updateAttributes({
      name: reqTag.name
    }).success(function(tag) {
      if (tag) {
        res.send({'new': tag, 'old': oldTag});
      }
    });
  });
};

module.exports.remove = function(req, res) {
  var id = req.params.id;
  TAG.find({where: {id: id}}).success(function(tag) {
    if (tag) {
      tag.getMaterials().success(function(materials) {
        tag.destroy().success(function() {
          res.send(materials);
        });
      });
    }
  });
};
