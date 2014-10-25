(function(){
  'use strict';
  var mmMap = angular.module('mmMap', [
    'leaflet-directive',
    'mmMaterials',
    'mmMaterial',
    'mmImg'
  ]);
  
  mmMap.factory('mmMap', ['$rootScope', function($rootScope) {
    var mmMap = {
      lat: 51.133253392421864,
      lng: 17.02815246582033,
      zoom: 12,
      pan: 'y',
      memory: undefined,
      setPosition: function(lat, lng) {
        mmMap.memory = {
          lat: lat,
          lng: lng,
          zoom: 18
        };
      },
      setMapImmediade: function(lat, lng) {
        mmMap.lat = lat;
        mmMap.lng = lng;
        mmMap.zoom = 18;
        return mmMap;
      },
      getMap: function() {
        if (angular.isDefined(mmMap.memory)) {
          mmMap.lat = mmMap.memory.lat;
          mmMap.lng = mmMap.memory.lng;
          mmMap.zoom = mmMap.memory.zoom;
          delete mmMap.memory;
        }
        return mmMap;
      }
    };
    $rootScope.setPosition = mmMap.setPosition;
    $rootScope.setMapImmediade = mmMap.setMapImmediade;
    return mmMap;
  }]);
  
  mmMap.controller('mmMapCtrl', [
    '$rootScope',
    '$scope',
    '$modal',
    '$timeout',
    'leafletEvents',
    'mmMap',
    'mmMaterials',
    'mmMaterial',
    'mmProject',
    'mmImg',
    function($rootScope, $scope, $modal, $timeout, leafletEvents, MAP, MATERIALS, MATERIAL, PROJECT, img) {
      $rootScope.ALL = true;
      $scope.editMaterial = false;

      $scope.map = MAP;

      PROJECT.onSet(function(project) {
        if (project.lat === null ||
          angular.isUndefined(project.lat) ||
          project.lng === null ||
          angular.isUndefined(project.lng) ||
          project.zoom === null ||
          angular.isUndefined(project.zoom)) {
            PROJECT.setPosition({
              lat: 51.133253392421864,
              lng: 17.02815246582033,
              zoom: 12
            });
        } else {
          MAP.lat = project.lat;
          MAP.lng = project.lng;
          MAP.zoom = project.zoom;
        }

        $scope.map = MAP.getMap();
      });

      $rootScope.setMapImmediade = function(lat, lng) {
        $scope.map = MAP.setMapImmediade(lat, lng);
      };

      $scope.layers = {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              // subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true
            }
          },
          cycle: {
            name: 'OpenCycleMap',
            type: 'xyz',
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true
            }
          }
        },
        overlays: {
          project: {
            name: 'project',
            type: 'markercluster',
            visible: true
          },
        }
      };

      $scope.events = {
        map: {
            enable: ['click'],
            logic: "emit"
        }
      };

      $scope.$on("leafletDirectiveMap.click", function(event, args) {
        var leafEvent = args.leafletEvent;

        MATERIALS.setSelected(leafEvent.latlng.lat, leafEvent.latlng.lng);
      });

      $scope.$on('leafletDirectiveMarker.popupopen', function(event, args) {
        console.log(args.markerName);
        MATERIAL.set(MATERIALS.data[args.markerName]);
        if (args.markerName === 'selected') {
          var modalInstance = $modal.open({
            templateUrl: 'templates\\addMaterialModal.html',
            controller: function ($scope, $modalInstance) {
              $scope.ok = function() {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          });

          modalInstance.result.then(function() {
            MATERIALS.add();
          });
        } else if ($scope.editMaterial) {
          // args.markerName
        }
      });

      $scope.edit = function(material) {
        var file;
        var modalInstance = $modal.open({
          templateUrl: 'templates\\editMaterialModal.html',
          controller: function ($scope, $modalInstance) {
            $scope.material = material;

            $scope.onFileSelect = function($files, where) {
              var fileInside = $files[0];
              if (angular.isDefined(fileInside)) {
                file = fileInside;
                var reader = new FileReader();
                reader.onload = function (e) {
                  $(where).attr('src', e.target.result);
                };
                reader.readAsDataURL(file);

                img.getFileExif(file).then(function(exif) {
                  console.log(exif);
                });
              }
            };

            $scope.loadMaterialImage = function(where, material) {
              if (angular.isDefined(material.fileName) && material.fileName !== null && material.fileName !== '') {

                img.getLinkExif('materials/' + PROJECT.actual.folderName + '/' + material.fileName).then(function(exif) {
                  console.log(exif);
                });

                $timeout(function() {
                  $(where).attr('src', 'materials/' + PROJECT.actual.folderName + '/' + material.fileName);
                }, 0);
              }
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
          MATERIALS.edit(material, file);
        });
      };
  }]);

  mmMap.directive('focus', ['$timeout', function($timeout) {
    return {
      scope: {
        trigger : '@focus'
      },
      link: function(scope, element) {
        var remove = scope.$watch('trigger', function(value) {
          if (value === 'true') {
            $timeout(function() {
              element[0].focus();
              remove();
            });
          }
        });
      }
    };
  }]);

})();
