(function(){
  'use strict';
  var mmMap = angular.module('mmMap', [
    'leaflet-directive',
    'mmMaterials',
    'mmMaterial'
  ]);
  
  mmMap.factory('mmMap', [function() {
    var mmMap = {
      lat: 51.133253392421864,
      lng: 17.02815246582033,
      zoom: 12,
      pan: 'y'
    };
    return mmMap;
  }]);
  
  mmMap.controller('mmMapCtrl', [
    '$rootScope',
    '$scope',
    '$modal',
    'leafletEvents',
    'mmMap',
    'mmMaterials',
    'mmMaterial',
    'mmProject',
    function($rootScope, $scope, $modal, leafletEvents, MAP, MATERIALS, MATERIAL, PROJECT) {
      $rootScope.ALL = true;
      $scope.editMaterial = false;

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
      });

      $scope.map = MAP;

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
