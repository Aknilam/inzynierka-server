(function() {
  'use strict';
  var mmHttp = angular.module('mmHttp', ['mmAnswer']);

  mmHttp.factory('mmHttp', ['$http', '$upload', 'mmAnswer', function($http, $upload, answer) {
    var http = {
      namespace: '/api/',

      getId: function(type, id, success, failure) {
        http._get(type + '/get/' + id, success, failure);
      },

      all: function(type, success, failure) {
        http._get(type + '/all', success, failure);
      },

      add: function(type, data, success, failure) {
        http._post(type + '/add', data, success, failure);
      },

      sendFile: function(link, file, data, success, failure) {
        $upload.upload({
          url: http.namespace + link,
          method: 'POST',
          data: data,
          file: file,
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
        }).error(function(data, status) {
          console.debug(link + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed);
            }
          }
        }).then(function(answer, status, headers, config) {
          if (angular.isFunction(success)) {
            if (angular.isDefined(answer) && answer.data !== false && answer.data !== 'false') {
              console.debug(link + '; status: ' + status);
              console.debug(answer.data);
              success(answer.data, status);
            }
          }
        });
      },

      edit: function(type, data, success, failure) {
        http._put(type + '/edit/' + data.id, data, success, failure);
      },

      remove: function(type, data, success, failure) {
        http._delete(type + '/remove/' + data.id, success, failure);
      },

      get: function(link, success, failure) {
        http._get(link, success, failure);
      },

      post: function(link, data, success, failure) {
        http._post(link, data, success, failure);
      },

      put: function(what, data, success, failure) {
        http._put(what, data, success, failure);
      },

      delete: function(what, success, failure) {
        http._delete(what, success, failure);
      },

      _get: function(what, success, failure) {
        $http.get(http.namespace + what).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _post: function(what, data, success, failure) {
        $http.post(http.namespace + what, data).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
         }
        }).error(function(data, status) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _put: function(what, data, success, failure) {
        $http.put(http.namespace + what, data).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _delete: function(what, success, failure) {
        $http.delete(http.namespace + what).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      }
    };

    return http;
  }]);

})();
