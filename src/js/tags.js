(function() {
  'use strict';
  var mmTags = angular.module('mmTags', ['mmProject', 'mmHttp', 'mmAlert', 'mmAnswer']);

  mmTags.factory('mmTags', ['$rootScope', '$q', 'mmProject', 'mmHttp', 'mmAlert', 'mmAnswer', function($rootScope, $q, PROJECT, http, alert, answer) {
    var mmTags = {
      data: {},

      getDataFor: function(query) {
        var deferred = $q.defer();
        var toReturn = [];
        angular.forEach(mmTags.data, function(tag) {
          if (tag.name.indexOf(query) > -1) {
            toReturn.push(tag);
          }
        });
        deferred.resolve(toReturn);
        return deferred.promise;
      },

      get: function(id, callback) {
        http.getId('tags', id, callback, answer.project.failure);
      },

      getFirstProperty: function(obj) {
        return obj[Object.keys(obj)[0]];
      },

      getAll: function() {
        mmTags.data = {};
        http.all('tags', function(tags) {
          angular.forEach(tags, function(tag) {
            mmTags.data[tag.name] = tag;
          });
        });
      },

      clean: function() {
        mmTags.data = {};
      },

      add: function(name) {
        var deferred = $q.defer();
        if (angular.isDefined(mmTags.data[name])) {
          alert.info('Tag `' + name + '` already exists');
          deferred.resolve(false);
        } else {
          http.add('tags', {name: name}, function(tag) {
            mmTags.data[tag.name] = tag;
            alert.success('Added tag `' + name + '`');
            deferred.resolve(tag);
          }, function(data, status) {
            answer.project.failure(data, status);
            deferred.resolve('error');
          });
        }
        return deferred.promise;
      },

      edit: function(tag) {
        http.edit('tags', tag, function(tag) {
          delete mmTags.data[tag.old.name];
          mmTags.data[tag['new'].name] = tag['new'];
          alert.success('Tag `' + tag['new'].name + '` saved successfully');
        }, answer.project.failure);
      },

      remove: function($event, tag) {
        $event.preventDefault();
        $event.stopPropagation();
        http.remove('tags', tag, function(data, status) {
          if (status === answer.status.success) {
            delete mmTags.data[tag.name];
            var materials = data.data;
            for (var i in materials) {
              var material = $rootScope.MATERIALS.data[materials[i].id];
              delete material.tags[tag.id];
              for (var j in material.pluginTags) {
                if (material.pluginTags[j].name === tag.name) {
                  material.pluginTags.splice(j, 1);
                }
              }
            }

            alert.success('Tag `' + tag.name + '` removed successfully');
          }
        }, answer.project.failure);
      }

    };
    PROJECT.onSet(mmTags.getAll);
    PROJECT.onUnset(mmTags.clean);
    return mmTags;
  }]);

})();
