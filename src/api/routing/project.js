var fs = require('fs');
var Sequelize = require('sequelize');

var PROJECT = require('../database/models.js').PROJECT;
var USER = require('../database/models.js').USER;
var shareProject = require('../protection/share.js').createProject;
var shareUser = require('../protection/share.js').createUser;

module.exports.isOwner = function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userId;

  PROJECT.find({where: {id: id}}).success(function(project) {
    if (project.owner === userId) {
      next();
    } else {
      return res.forbidden();
    }
  });
};

module.exports.isMember = function(req, res, next) {
  var projectId = req.session.projectId;
  var userId = req.session.userId;
  if (projectId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (project) {
        project.getUsers().success(function(users) {
          for (var i in users) {
            if (users[i].dataValues.id === userId) {
              next();
            }
          }
        });
      } else {
        return res.forbidden();
      }
    });
  } else {
    return res.notexists();
  }
};

module.exports.isAdmin = function(req, res, next) {
  var projectId = req.session.projectId;
  var userId = req.session.userId;
  if (projectId && userId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (project) {
        project.getUsers().success(function(users) {
          for (var i in users) {
            if (users[i].dataValues.id === userId && (users[i].ProjectUsers.role === 'admin' || users[i].ProjectUsers.role === 'owner' || project.owner === userId)) {
              next();
            }
          }
        });
      } else {
        return res.forbidden();
      }
    });
  } else {
    return res.notexists();
  }
};

module.exports.isEditable = function(req, res, next) {
  var projectId = req.session.projectId;
  var userId = req.session.userId;
  if (projectId && userId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (project && ((project.editable === true && project.accessible === true) || project.owner === userId)) {
        return next();
      } else {
        return res.alreadyClosed();
      }
    });
  } else {
    return res.notexists();
  }
};

module.exports.get = function(req, res, next) {
  var id = req.params.id;

  PROJECT.find({where: {id: id}}).success(function(project) {
    res.send(shareProject(project));
  });
};

module.exports.enter = function(req, res, next) {
  var projectId = req.params.id;
  var userId = req.session.userId;
  if (projectId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      project.getUsers().success(function(users) {
        for (var i in users) {
          if (users[i].id === userId) {
            req.session.projectId = projectId;
            req.session.save();

            USER.find({where: {id: project.owner}}).success(function(user) {
              var toReturn = [];
              var amIAdmin = false;
              for (var i in users) {
                toReturn.push(shareUser(users[i]));
                if (userId === users[i].dataValues.id && users[i].ProjectUsers.role === 'admin') {
                  amIAdmin = true;
                }
              }
              res.send({owner: user.username, members: toReturn, amIAdmin: amIAdmin});
            });
          }
        }
      });
    });
  }
};

module.exports.getAll = function(req, res, next) {
  var userId = req.session.userId;

  USER.find({where:{id: userId}}).success(function(user) {
    user.getProjects().success(function(projects) {
      var toReturn = [];
      for (var i in projects) {
        if (projects[i].owner === userId) {
          toReturn.push(projects[i]);
        } else {
          toReturn.push(shareProject(projects[i]));
        }
      }
      res.send(projects);
    });
  });
};

var folderBase = 'src/materials/';

var createFolder = function(folderName) {
  if (!fs.existsSync(folderBase + folderName)) {
    fs.mkdirSync(folderBase + folderName);
    return folderName; 
  } else {
    var i = 0;
    while (true) {
      i++;
      var newFolder = folderName + "_" + i;

      if (!fs.existsSync(folderBase + newFolder)) {
        fs.mkdirSync(folderBase + newFolder);
        return newFolder;
      }
    }
  }
}

module.exports.add = function(req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  var userId = req.session.userId;
  var folderName = createFolder(Math.random().toString(36).slice(2));
  var accessCode = Math.random().toString(36).slice(2);

  if (name && folderName) {
    PROJECT.create({
      name: name,
      description: description,
      folderName: folderName,
      owner: userId,
      accessCode: accessCode,
      accessible: true,
      editable: true,
      lat: 0,
      lng: 0,
      zoom: 1
    }).success(function(project) {
      if (project) {
        USER.find({where: {id: userId}}).success(function(user) {
          project.addUser(user, {role: 'owner'});
          res.send(shareProject(project));
        });
      }
    });
  }
};

module.exports.join = function(req, res, next) {
  var accessCode = req.body.accessCode;
  var userId = req.session.userId;

  if (accessCode && userId) {
    PROJECT.find({where: {accessCode: accessCode}}).success(function(project) {

      if (project.accessible) {
        USER.find({where:{id: userId}}).success(function(user) {
          project.addUser(user, {role: 'user'}).success(function() {
            res.send(shareProject(project));
          });
        });
      } else {
        return res.alreadyClosed();
      }
    });
  }
};

module.exports.giveAdmin = function(req, res, next) {
  var projectId = req.session.projectId;
  var userId = req.params.id;

  if (projectId && userId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (project) {
        project.getUsers().success(function(users) {
          for (var i in users) {
            if (users[i].dataValues.id === parseInt(userId)) {
              users[i].ProjectUsers.role = 'admin';
              users[i].ProjectUsers.save();
              return res.send(shareUser(users[i]));
            }
          }
        });
      } else {
        return res.notexists();
      }
    });
  }
};

module.exports.takeAdmin = function(req, res, next) {
  var projectId = req.session.projectId;
  var userId = req.params.id;

  if (projectId && userId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (project) {
        project.getUsers().success(function(users) {
          for (var i in users) {
            if (users[i].id === parseInt(userId)) {
              users[i].ProjectUsers.role = 'user';
              users[i].ProjectUsers.save();
              return res.send(shareUser(users[i]));
            }
          }
          return res.notexists();
        });
      } else {
        return res.notexists();
      }
    });
  }
};

module.exports.edit = function(req, res) {
  var id = req.params.id;
  var reqProject = req.body;
  var userId = req.session.userId;

  PROJECT.find({where: {id: id}}).success(function(project) {
    if (project) {
      project.updateAttributes({
        name: reqProject.name,
        description: reqProject.description,
        accessible: reqProject.accessible,
        editable: reqProject.editable,
        lat: reqProject.lat,
        lng: reqProject.lng,
        zoom: reqProject.zoom
      }).success(function(newProject) {
        res.send(shareProject(newProject));
      });
    }
  });
};

module.exports.open = function(req, res) {
  var id = req.params.id;
  var userId = req.session.userId;
  PROJECT.find({where: {id: id, owner: userId}}).success(function(project) {
    project.updateAttributes({
      accessible: true
    }).success(function(newProject) {
      res.send(shareProject(newProject));
    });
  });
};

module.exports.close = function(req, res) {
  var id = req.params.id;
  var userId = req.session.userId;
  PROJECT.find({where: {id: id, owner: userId}}).success(function(project) {
    project.updateAttributes({
      accessible: false
    }).success(function(project) {
      res.send(shareProject(project));
    });
  });
};

module.exports.allowEdit = function(req, res) {
  var id = req.params.id;
  PROJECT.find({where: {id: id}}).success(function(project) {
    project.updateAttributes({
      editable: true
    }).success(function(newProject) {
      res.send(shareProject(newProject));
    });
  });
};

module.exports.denyEdit = function(req, res) {
  var id = req.params.id;
  PROJECT.find({where: {id: id}}).success(function(project) {
    project.updateAttributes({
      editable: false
    }).success(function(project) {
      res.send(shareProject(project));
    });
  });
};

module.exports.remove = function(req, res) {
  var id = req.params.id;
  PROJECT.find({where: {id: id}}).success(function(project) {
    if (project) {
      project.getMaterials().success(function(materials) {
        if (materials) {
          for (var i in materials) {
            materials[i].destroy();
          }
        }
        project.getTags().success(function(tags) {
          if (tags) {
            for (var i in tags) {
              tags[i].destroy();
            }
          }

          project.destroy().success(function() {
            res.send(true);
          });
        });
      });
    }
  });
};
