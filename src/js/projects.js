(function() {
  'use strict';
  var mmProjects = angular.module('mmProjects', ['mmProject', 'mmHttp', 'mmAlert', 'mmAnswer']);

  mmProjects.factory('mmProjects', ['$modal', 'mmProject', 'mmHttp', 'mmAlert', 'mmAnswer', function($modal, PROJECT, http, alert, answer) {
    var mmProjects = {
      data: {},

      get: function(id, callback) {
        if (angular.isDefined(data[id])) {
          callback(data[id]);
        } else {
          http.getId('projects', id, callback);
        }
      },

      getAll: function() {
        http.all('projects', function(projects) {
          angular.forEach(projects, function(project) {
            mmProjects.data[project.id] = mmProjects._create(project);
          });
        });
      },

      clean: function() {
        PROJECT.unset();
        mmProjects.data = {};
      },

      add: function(name, description, callback) {
        http.add('projects', {name: name, description: description}, function(project) {
          mmProjects.data[project.id] = mmProjects._create(project);
          alert.success('Added project `' + name + '`');
          if (angular.isFunction(callback)) {
            callback(project);
          }
        });
      },

      edit: function(project) {
        http.edit('projects', project, function(projectRes) {
          project.name = projectRes.name;
          project.actual.description = projectRes.description;
          project.accessible = projectRes.accessible;
          project.editable = projectRes.editable;
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

      join: function(accessCode) {
        http.post('projects/join', {accessCode: accessCode}, function(project) {
          mmProjects.data[project.id] = mmProjects._create(project);
          alert.success('Successfully joined to project `' + project.name + '`');
          PROJECT.set(mmProjects.data[project.id]);
        }, function() {
          alert.warning('Project already closed or doesn\'t exist');
        });
      },

      remove: function($event, project) {
        $event.preventDefault();
        $event.stopPropagation();

        var modalInstance = $modal.open({
          templateUrl: 'templates\\confirm.html',
          controller: function ($scope, $modalInstance) {
            $scope.text = 'Are you sure?';
            $scope.content = 'Do you want to remove project `' + project.name + '`?';
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
          http.remove('projects', project, function(response, status) {
            if (status === answer.status.success) {
              delete mmProjects.data[project.id];
              if (PROJECT.actual === project) {
                PROJECT.unset();
              }
              alert.success('Successfully removed project `' + project.name + '`');
            } else {
              alert.danger('Internal server error while removing `' + project.name + '`');
            }
          }, answer.project.failureData);
        });
      },

      _create: function(project) {
        return {
          id: project.id,
          name: project.name,
          description: project.description,
          owner: project.owner,
          accessible: project.accessible,
          editable: project.editable,
          folderName: project.folderName,
          accessCode: project.accessCode,
          lat: project.lat,
          lng: project.lng,
          zoom: project.zoom
        };
      }
    };

    return mmProjects;
  }]);

})();
