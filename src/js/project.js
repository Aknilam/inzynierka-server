(function() {
  'use strict';
  var mmProject = angular.module('mmProject', ['mmHttp', 'mmAlert']);

  mmProject.factory('mmProject', ['mmHttp', 'mmAlert', function(http, alert) {
    var mmProject = {
      actual: undefined,

      isSet: false,

      onSetFunctions: [],

      onUnsetFunctions: [],

      set: function(project) {
        http.get('projects/enter/' + project.id, function(data) {
          project.ownerData = data.owner;
          project.members = data.members;
          project.amIAdmin = data.amIAdmin;
          mmProject.actual = project;
          mmProject.isSet = true;

          // run functions
          angular.forEach(mmProject.onSetFunctions, function(ftn) {
            ftn(project);
          });
        });
      },

      unset: function() {
        mmProject.actual = undefined;
        mmProject.isSet = false;

        // run functions
        angular.forEach(mmProject.onUnsetFunctions, function(ftn) {
          ftn();
        });
      },

      onSet: function(callback) {
        if (angular.isFunction(callback)) {
          if (mmProject.isSet) {
            callback(mmProject.actual);
          } else {
            mmProject.onSetFunctions.push(callback);
          }
        }
      },

      onUnset: function(callback) {
        if (angular.isFunction(callback)) {
          mmProject.onUnsetFunctions.push(callback);
        }
      },

      get: function() {
        return mmProject.actual;
      },

      edit: function() {
        http.edit('projects', mmProject.actual, function(project) {
          mmProject.actual.name = project.name;
          mmProject.actual.description = project.description;
          mmProject.actual.accessible = project.accessible;
          mmProject.actual.editable = project.editable;
          alert.success('Project `' + project.name + '` saved successfully');
        });
      },

      setPosition: function(map, callback) {
        if (angular.isObject(map)) {
          mmProject.actual.lat = map.lat;
          mmProject.actual.lng = map.lng;
          mmProject.actual.zoom = map.zoom;
          http.edit('projects', mmProject.actual, function(project) {
            alert.success('Project `' + mmProject.actual.name +
              '` default position saved successfully');
            if (angular.isFunction(callback)) {
              callback(map);
            }
          });
        }
      },

      open: function() {
        http.put('projects/open/' + mmProject.actual.id, {}, function(project) {
          mmProject.actual.accessible = project.accessible;
          alert.success('Project `' + project.name + '` opened');
        });
      },

      close: function() {
        http.put('projects/close/' + mmProject.actual.id, {}, function(project) {
          mmProject.actual.accessible = project.accessible;
          alert.success('Project `' + project.name + '` closed');
        });
      },

      allow: function() {
        http.put('projects/allow/' + mmProject.actual.id, {}, function(project) {
          mmProject.actual.editable = project.editable;
          alert.success('Project `' + project.name + '` editing allowed');
        });
      },

      deny: function() {
        http.put('projects/deny/' + mmProject.actual.id, {}, function(project) {
          mmProject.actual.editable = project.editable;
          alert.success('Project `' + project.name + '` editing disabled');
        });
      },

      giveAdmin: function(user) {
        http.put('projects/giveadmin/' + user.id, {}, function(answer) {
          user.role = answer.role;
          alert.success('User `' + user.username + '` becomes admin');
        });
      },

      takeAdmin: function(user) {
        http.put('projects/takeadmin/' + user.id, {}, function(answer) {
          user.role = answer.role;
          alert.success('User `' + user.username + '` is not an admin anymore');
        });
      }
    };
    return mmProject;
  }]);

})();
