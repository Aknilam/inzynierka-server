var fs = require('fs');

var MATERIAL = require('../database/models.js').MATERIAL;
var TAG = require('../database/models.js').TAG;
var PROJECT = require('../database/models.js').PROJECT;

module.exports.get = function(req, res, next) {
  var id = req.params.id;

  MATERIAL.find({where: {id: id}}).success(function(material) {
    res.send(material);
  });
};

module.exports.getA = function(req, res, next) {
  var id = req.params.id;

  MATERIAL.findAll().success(function(materials) {
    res.send(materials);
  });
};

module.exports.getAll = function(req, res, next) {
  var projectId = req.session.projectId;

  console.log(projectId);
  if (projectId) {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      project.getMaterials().success(function(materials) {
        var materialsWithTags = [];

        var getTagsRecurrency = function(i, materials) {
          if (i < materials.length) {
            materials[i].getTags().success(function(tags) {
              var materialWithTags = {
                id: materials[i].id,
                name: materials[i].name,
                description: materials[i].description,
                createdAt: materials[i].createdAt,
                updatedAt: materials[i].updatedAt,
                lat: materials[i].lat,
                lng: materials[i].lng,
                angle: materials[i].angle,
                fileName: materials[i].fileName,
                tags: {}
              };

              for (var k = 0; k <= tags.length; k++) {
                if (k < tags.length) {
                  materialWithTags.tags[tags[k].name] = {
                    id: tags[k].id,
                    name: tags[k].name
                  };
                } else {
                  materialsWithTags.push(materialWithTags);

                  getTagsRecurrency(i + 1, materials);
                }
              }
            });
          } else {
            res.send(materialsWithTags);
          }
        };
        getTagsRecurrency(0, materials);
      });
    });
  }
};

var folderBase = 'src\\materials\\';

var saveFile = function(folderName, file, callback, name) {
  console.log('save file');
  fs.readFile(file.path, function (err, data) {
    var extention = file.name.split('.').pop();
    if (extention) {
      extention = '.' + extention;
    }
    var newFileName;
    if (name && name !== null) {
      newFileName = name + extention;
    } else {
      newFileName = Math.random().toString(36).slice(2) + extention;
    }
    var newPath = folderBase + folderName + '\\' + newFileName;
    fs.writeFile(newPath, data, function (err) {
      callback(newFileName);
    });
  });
};

module.exports.add = function(req, res, next) {

  console.log(req.body);
  var projectId = req.session.projectId;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var name = req.body.name;
  var description = req.body.description;
  var angle = req.body.angle;
  var tags = JSON.parse(req.body.tags);

  var onSaveFile = function(project, lat, lng, name, description, angle, tags) {
    console.log('onSaveFile');
    return function(fileName) {
      MATERIAL.create({
        name: name,
        description: description,
        lat: lat,
        lng: lng,
        angle: angle,
        fileName: fileName
      }).success(function(material) {
        project.addMaterial(material).success(function() {
          var sum = 0;
          if (!tags) {
            tags = {};
          }
          for (var i in tags) {
            TAG.find({where: {id: tags[i].id}}).success(function(tag) {
              material.addTag(tag).success(function() {
                sum++;
              });
            });
          }
          if (sum === Object.keys(tags).length) {
            res.send(material);
          }
        });
      });
    }
  };

  if (projectId && lat && lng && name && typeof(parseFloat(angle)) === 'number') {
    PROJECT.find({where: {id: projectId}}).success(function(project) {
      if (req.files && req.files.file) {
        saveFile(project.folderName, req.files.file, onSaveFile(project, lat, lng, name, description, angle, tags));
      } else {
        onSaveFile(project, lat, lng, name, description, angle, tags)('');
      }
    });
  } else {
    res.send(false);
  }
};

module.exports.edit = function(req, res) {
  var id = req.params.id;
  var projectId = req.session.projectId;
  var rMaterial = req.body;

  var onSaveFile = function(id, reqMaterial) {
    console.log('onSaveFile');
    return function(fileName) {
      MATERIAL.find({where: {id: id}}).success(function(material) {
        material.updateAttributes({
          name: reqMaterial.name,
          description: reqMaterial.description,
          lat: reqMaterial.lat,
          lng: reqMaterial.lng,
          angle: reqMaterial.angle,
          fileName: fileName
        }).success(function(savedMaterial) {
          res.send(savedMaterial);
        });
      });
    }
  };

  if (id && rMaterial) {
    if (req.files && req.files.file) {
      console.log('file received');
      PROJECT.find({where: {id: projectId}}).success(function(project) {
        saveFile(project.folderName, req.files.file, onSaveFile(id, rMaterial), rMaterial.fileName);
      });
    } else {
      onSaveFile(id, rMaterial)(rMaterial.fileName);
    }
  }
};

module.exports.addTag = function(req, res, next) {
  var material = req.body.material;
  var reqTag = req.body.tag;

  if (material && reqTag) {
    MATERIAL.find({where: {id: material.id}}).success(function(material) {

      TAG.find({where:{id: reqTag.id}}).success(function(tag) {
        if (tag) {
          material.addTag(tag).success(function() {
            res.send(true);
          });
        } else {
          res.send(false);
        }
      });

    });
  }
};

module.exports.removeTag = function(req, res, next) {
  var materialId = req.params.material;
  var tagId = req.params.tag;

  if (materialId && tagId) {
    MATERIAL.find({where: {id: materialId}}).success(function(material) {

      TAG.find({where:{id: tagId}}).success(function(tag) {
        if (tag) {
          material.removeTag(tag).success(function() {
            res.send(true);
          });
        } else {
          res.send(false);
        }
      });

    });
  }
};

module.exports.remove = function(req, res) {
  var id = req.params.id;
  MATERIAL.find({where: {id: id}}).success(function(material) {
    if (material) {
      material.destroy().success(function() {
        res.send(true);
      });
    }
  });
};
