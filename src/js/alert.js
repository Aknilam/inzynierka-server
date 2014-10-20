(function() {
  'use strict';
  var mmAlert = angular.module('mmAlert', []);

  mmAlert.factory('mmAlert', ['$timeout', function($timeout) {
    var types = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'danger'
    };
    var alert = {
      nextId: function() {
        return String((new Date()).getTime()) + String(Math.random().toString(36).slice(2));
      },
      types: types,
      list: {},
      add: function(text, type) {
        if (angular.isUndefined(type) || angular.isUndefined(types[type])) {
          type = types.info;
        }
        var newAlert = {
          id: alert.nextId(),
          text: text,
          type: type,
          counter: (alert.timeouts[type] || 0) / 1000
        };
        alert.list[newAlert.id] = newAlert;

        if (newAlert.counter > 0) {
          var countdown = function() {
            $timeout(function() {
              newAlert.counter--;
              if (newAlert.counter > 0) {
                countdown();
              } else {
                alert.close(newAlert);
              }
            }, 1000);
          };

          countdown();
        }
      },
      close: function(toRemove) {
        if (angular.isObject(toRemove)) {
          delete alert.list[toRemove.id];
        }
      },

      timeouts: {
        info: 5000,
        success: 2000,
        warning: 3000
      }
    };
    angular.forEach(alert.types, function(type) {
      alert[type] = function(text) {
        alert.add(text, type);
      };
    });
    return alert;
  }]);

  mmAlert.directive('mmAlert', ['mmAlert', function(mmAlert) {
    return {
      restrict:'EA',
      controller: function($scope) {
        $scope.alerts = mmAlert;
      },
      templateUrl: 'templates/alerts.html',
      replace: true
    };
  }]);

})();
