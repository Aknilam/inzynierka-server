(function() {
  'use strict';
  var mmMaterials = angular.module('mmMaterials', ['mmProject', 'mmMaterial', 'mmTags', 'mmHttp', 'mmAlert', 'mmAnswer', 'mmImg']);

  mmMaterials.factory('mmMaterials', ['$rootScope', '$modal', 'mmProject', 'mmMaterial', 'mmTags', 'mmHttp', 'mmAlert', 'mmAnswer',
    function($rootScope, $modal, PROJECT, MATERIAL, TAGS, http, alert, answer) {
      var icon = {
        iconUrl: 'images/arrow.png',
        iconSize:     [60, 60], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [60 / 2, 60 / 2], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      };
      var mmMaterials = {
        data: {},

        mapData: {},

        showAll: true,

        nonTagged: false,

        updateMapData: function(tag) {
          if (tag === 'nontagged') {
            mmMaterials.nonTagged = !mmMaterials.nonTagged;
          }

          var tags = TAGS.data;

          if (mmMaterials.showAll) {
            mmMaterials.mapData = mmMaterials.data;
          } else {
            var toReturn = {};
            angular.forEach(mmMaterials.data, function(material, name) {
              var materialTags = material.tags;
              var isOk = false;
              if (name === 'selected') {
                toReturn.selected = material;
              } else {
                if (Object.keys(materialTags).length > 0) {
                  for (var i in tags) {
                    for (var j in materialTags) {
                      if ( ( (tags[i].checked || tags[i].checked === 'true') && tags[i].checked !== 'false') &&
                          tags[i].id === materialTags[j].id
                        ) {
                          isOk = true;
                      }
                    }
                  }
                  if (isOk) {
                    toReturn[material.id] = material;
                  }
                } else {
                  if (mmMaterials.nonTagged) {
                    toReturn[material.id] = material;
                  }
                }
              }
            });
            mmMaterials.mapData = toReturn;
          }
        },

        setSelected: function(lat, lng) {
          if (angular.isUndefined(mmMaterials.data.selected)) {
            mmMaterials.data.selected = {
              lat: lat,
              lng: lng,
              name: "New marker",
              description: "",
              iconAngle: 0,
              icon: icon
            };
            mmMaterials.data.selected.message = mmMaterials.data.selected.name;
          } else {
            mmMaterials.data.selected.lat = lat;
            mmMaterials.data.selected.lng = lng;
            mmMaterials.data.selected.name = 'New marker';
            mmMaterials.data.selected.message = mmMaterials.data.selected.name;
            mmMaterials.data.selected.description = '';
            mmMaterials.data.selected.iconAngle = 0;
            mmMaterials.data.selected.icon = icon;
          }

          mmMaterials.updateMapData();
        },

        get: function(id, callback) {
          http.getId('materials', id, callback, answer.project.failure);
        },

        getAll: function() {
          mmMaterials.data = {};
          http.all('materials', function(materials) {
            angular.forEach(materials, function(material) {
              mmMaterials.data[material.id] = mmMaterials._create({
                id: material.id,
                createdAt: material.createdAt,
                updatedAt: material.updatedAt
              }, material.name, material.description, material.lat, material.lng, material.angle, material.fileName, material.tags);
            });

            mmMaterials.updateMapData();
          }, answer.project.failure);
        },

        clean: function() {
          mmMaterials.data = {};
        },

        selectedFile: undefined,

        setSelectedFile: function($files, where) {
          var file = $files[0];
          if (angular.isDefined(file)) {
            mmMaterials.selectedFile = file;
            var reader = new FileReader();
            reader.onload = function (e) {
              $(where).attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
          }
        },

        loadImage: function(where) {
          if (angular.isDefined(mmMaterials.selectedFile)) {
            var reader = new FileReader();
            reader.onload = function (e) {
              $(where).attr('src', e.target.result);
            };
            reader.readAsDataURL(mmMaterials.selectedFile);
          }
        },

        add: function(material, file) {
          var ifSave = false,
            name,
            description,
            lat,
            lng,
            angle;
console.log(material);
          if (angular.isDefined(material)) {
            name = material.name;
            description = material.description;
            lat = material.lat;
            lng = material.lng;
            angle = material.iconAngle;

            ifSave = true;
          } else if (angular.isDefined(mmMaterials.data.selected)) {
            name = mmMaterials.data.selected.name;
            description = mmMaterials.data.selected.description;
            lat = mmMaterials.data.selected.lat;
            lng = mmMaterials.data.selected.lng;
            angle = mmMaterials.data.selected.iconAngle;
            file = mmMaterials.selectedFile;

            ifSave = true;
          }

          if (ifSave) {
            http.sendFile('materials/add', file, mmMaterials._create({}, name, description, lat, lng, angle), function(material) {
              mmMaterials.data[material.id] = mmMaterials._create({
                id: material.id,
                createdAt: material.createdAt,
                updatedAt: material.updatedAt
              }, material.name, material.description, material.lat, material.lng, material.angle, material.fileName);

              delete mmMaterials.data.selected;
              delete mmMaterials.selectedFile;

              MATERIAL.set(mmMaterials.data[material.id]);

              mmMaterials.updateMapData();
              alert.success('Added material `' + material.name + '`');
            }, answer.project.failure);
          }
        },

        addPossibleTag: function(material, tag) {
          if (angular.isDefined(TAGS.data[tag.name])) {
            mmMaterials.addTag(material, TAGS.data[tag.name], true);
          } else {
            var modalInstance = $modal.open({
              templateUrl: 'templates\\confirm.html',
              controller: function ($scope, $modalInstance) {
                $scope.text = 'New tag';
                $scope.content = 'Do you want to add new tag `' + tag.name + '`?';
                $scope.answer = {
                  accept: 'Yes',
                  reject: 'No'
                };
                $scope.ok = function() {
                  $modalInstance.close();
                };

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };
              }
            });

            modalInstance.result.then(function() {
              TAGS.add(tag.name).then(function(data) {
                if (angular.isObject(data)) {
                  mmMaterials.addTag(material, data, true);
                } else {
                  if (data === false) {
                    alert.error('An error occured: `addPossibleTag`');
                  }
                  material.pluginTags.splice(material.pluginTags.indexOf(tag), 1);
                }
              });
            }, function () {
              material.pluginTags.splice(material.pluginTags.indexOf(tag), 1);
            });
          }
        },

        addTag: function(material, tag, fromPossible) {
          if (angular.isUndefined(material.tags[tag.name])) {
            http.post('materials/add/tag', {material: material, tag: tag}, function(answer) {
              material.tags[tag.name] = tag;

              if (!fromPossible) {
                material.pluginTags.push(tag);
              }

              mmMaterials.updateMapData();
              alert.success('Tag `' + tag.name + '` added to material `' + material.name + '`');
            }, function(data, status) {
              material.pluginTags.splice(tag, 1);
              answer.project.failure(data, status);
            });
          } else {
            alert.info('Tag `' + tag.name + '` already added to material `' + material.name + '`');
          }
        },

        removeTag: function(material, tag) {
          if (angular.isDefined(material.tags[tag.name])) {
            http.delete('materials/remove/tag/' + material.id + '/' + tag.id, function(answer, status) {
              delete material.tags[tag.name];

              mmMaterials.updateMapData();
              alert.success('Tag `' + tag.name + '` removed from material `' + material.name + '`');
            }, answer.project.failure);
          } else {
            alert.info('Tag `' + tag.name + '` already removed from material `' + material.name + '`');
          }
        },

        edit: function(material, file) {
          if (angular.isUndefined(material.id)) {
            mmMaterials.add(material, file);
          } else {
            material.angle = material.iconAngle;
            http.sendFile('materials/edit/' + material.id, file, material, function(resMaterial) {
              mmMaterials.data[material.id] = mmMaterials._create({
                id: resMaterial.id,
                createdAt: resMaterial.createdAt,
                updatedAt: resMaterial.updatedAt
              }, resMaterial.name, resMaterial.description, resMaterial.lat, resMaterial.lng, resMaterial.angle, resMaterial.fileName);

              MATERIAL.set(mmMaterials.data[material.id]);

              mmMaterials.updateMapData();
              alert.success('Material `' + resMaterial.name + '` saved successfully');
            }, answer.project.failure, 'PUT');
          }
        },

        remove: function($event, material) {
          $event.preventDefault();
          $event.stopPropagation();
          var modalInstance = $modal.open({
            templateUrl: 'templates\\confirm.html',
            controller: function ($scope, $modalInstance) {
              $scope.text = 'Remove material';
              $scope.content = 'Do you want to remove material `' + material.name + '`?';
              $scope.answer = {
                accept: 'Yes',
                reject: 'No'
              };
              $scope.ok = function() {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });

          modalInstance.result.then(function() {
            http.remove('materials', material, function(data) {
              if (data) {
                delete mmMaterials.data[material.id];

                mmMaterials.updateMapData();
                alert.success('Material `' + material.name + '` removed successfully');
                if (material === MATERIAL.focused) {
                  MATERIAL.unset();
                }
              }
            }, answer.project.failure);
          });
        },

        _create: function(base, name, description, lat, lng, angle, fileName, tags) {
          if (name) {
            base.name = name;
            base.message = name;
          }
          if (description) {
            base.description = description;
          }
          if (lat && lng) {
            if (!angular.isNumber(lat)) lat = parseFloat(lat);
            base.lat = lat;
            if (!angular.isNumber(lng)) lng = parseFloat(lng);
            base.lng = lng;
          }
          if (angle) {
            base.iconAngle = angle;
            base.angle = angle;
          } else {
            base.angle = 0;
          }
          if (fileName) {
            base.fileName = fileName;
          } else {
            base.fileName = '';
          }
          if (tags) {
            base.tags = tags;
            base.pluginTags = [];
            angular.forEach(tags, function(tag) {
              base.pluginTags.push(tag);
            });
          } else if (!base.tags) {
            base.tags = {};
            base.pluginTags = [];
          }
          base.icon = icon;
          base.layer = 'project';
          return base;
        }

      };
      PROJECT.onSet(mmMaterials.getAll);
      PROJECT.onUnset(mmMaterials.clean);

      mmMaterials.updateMapData();
      return mmMaterials;
    }
  ]);

  mmMaterials.controller('mmMaterialsCtrl', ['$rootScope', '$scope', 'mmMaterials', 'mmMaterial', 'mmProject', 'mmImg', function($rootScope, $scope, MATERIALS, MATERIAL, PROJECT, img) {
    var actualFile;
    $scope.actualMaterial = undefined;
    $scope.imageName = 'toShowImage'; 

    $scope.onFileSelect = function($files, where) {
      var fileInside = $files[0];
      if (angular.isDefined(fileInside)) {
        actualFile = fileInside;
        var reader = new FileReader();
        reader.onload = function (e) {
          $(where).attr('src', e.target.result);
        };
        reader.readAsDataURL(actualFile);

        img.getFileExif(actualFile).then(function(exif) {
          console.log(exif);
        });
      }
    };

    $scope.setMaterial = function(material) {
      $scope.actualMaterial = material;
      actualFile = undefined;
      if (angular.isDefined(material.fileName) && material.fileName !== null && material.fileName !== '') {
        $('#' + $scope.imageName).attr('src', 'materials/' + PROJECT.actual.folderName + '/' + material.fileName);
      } else {
        $('#' + $scope.imageName).attr('src', '');
      }
    };

    $scope.save = function() {
      MATERIALS.edit($scope.actualMaterial, actualFile);
    };

    $scope.gotoMap = function(material) {
      $rootScope.setPosition(material.lat, material.lng);
      MATERIAL.set(material);
      $scope.ons.slidingMenu.setAbovePage('navigatorMap.html');
    };
  }]);

  mmMaterials.directive('mmAngle', [function() {
    return {
      restrict: "EA",
      scope: {
        mmAngle: '='
      },
      link: function(scope, element, attrs) {
        var slider = $(element).slider({
          range: 'max',
          min: 0,
          max: 360,
          slide: function(event, ui) {
            event.preventDefault();
            event.stopPropagation();
            scope.$apply(function() {
              scope.mmAngle = ui.value;
            });
          }
        });

        var removeWatcher = scope.$watch('mmAngle', function(angle) {
          slider.slider('value', angle);
        });

        scope.$on('$destroy', function() {
          removeWatcher();
        });
      }
   };
  }]);
})();
