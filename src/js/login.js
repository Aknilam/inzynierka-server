(function() {
  'use strict';
  var mmLogin = angular.module('mmLogin', [
    'ngCookies',
    'mmProjects',
    'mmHttp',
    'mmAnswer',
    'mmAlert'
  ]);

  mmLogin.factory('mmLogin', ['$rootScope', '$cookies', 'mmProjects', 'mmHttp', 'mmAnswer', 'mmAlert',
    function($rootScope, $cookies, PROJECTS, http, answer, alert) {
      var states = {
        authorized: 'authorized',
        unauthorized: 'unauthorized',
        authenticating: 'authenticating'
      };

      var mmLogin = {
        state: states.unauthorized,

        states: states,

        me: {},

        login: function(username, password, callback, encrypted) {
          if (!angular.isFunction(callback)) {
            callback = function() {};
          }

          if (mmLogin.state !== states.authenticating) {
            mmLogin.state = states.authenticating;
            if (!encrypted) {
              password = CryptoJS.MD5(password).toString();
            }
            http.post('login', {username: username, password: password}, function(serverAnswer, status) {
              if (status === answer.status.success) {
                mmLogin.state = states.authorized;

                mmLogin.me = serverAnswer;

                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = 'expires=' + d.toUTCString();
                document.cookie = 'mmLoginL' + '=' + username + "; " + expires;
                document.cookie = 'mmLoginP' + '=' + password + "; " + expires;

                PROJECTS.getAll();
                alert.success('Successfully logged in');
                callback();
              } else {
                mmLogin.state = states.unauthorized;
              }
            }, function(data, status) {
              if (status === answer.status.forbidden) {
                mmLogin.state = states.unauthorized;
                PROJECTS.clean();
                alert.warning('Wrong username or password');
              }
            });
          }
        },

        logout: function() {
          if (mmLogin.state === states.authorized) {
            http.get('logout', function(serverAnswer, status) {
              if (status === answer.status.success) {
                mmLogin.state = states.unauthorized;

                delete $cookies.mmLoginL;
                delete $cookies.mmLoginP;

                PROJECTS.clean();
                alert.success('Successfully logged out');
              }
            }, function() {
              alert.warning('Failed to log out');
            });
          }
        },

        changePassword: function(password, password2) {
          if (password !== password2) {
            alert.warning('Passwords don\'t equal');
            return;
          }

          if (mmLogin.state === states.authorized) {
            password = CryptoJS.MD5(password).toString();
            http.post('changePassword', {password: password}, function(serverAnswer, status) {
              if (status === answer.status.success) {
                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = 'expires=' + d.toUTCString();
                document.cookie = 'mmLoginP' + '=' + password + "; " + expires;

                alert.success('Successfully changed password');
              }
            }, function() {
              alert.warning('Failed to change password');
            });
          }
        },

        register: function(username, password, password2, success) {
          if (!angular.isFunction(success)) {
            success = function() {};
          }

          if (password !== password2) {
            alert.warning('Passwords don\'t equal');
            return;
          }

          if (mmLogin.state === states.unauthorized) {
            http.post('register', {username: username, password: CryptoJS.MD5(password).toString()}, function(serverAnswer, status) {
              if (status === answer.status.success) {
                alert.success('Successfully registered');
                success(serverAnswer);
              }
            }, function(data, status) {
              if (status === answer.status.error) {
                alert.warning('Login already exists');
              }
            });
          }
        },

        _checkCookies: function() {
          if (angular.isDefined($cookies.mmLoginL) && angular.isDefined($cookies.mmLoginP)) {
            mmLogin.login($cookies.mmLoginL, $cookies.mmLoginP, function() {
              $rootScope.ons.slidingMenu.setAbovePage('navigatorProjects.html');
            }, true);
          }
        }

      };
      mmLogin._checkCookies();
      return mmLogin;
    }
  ]);

  mmLogin.controller('mmLoginCtrl', ['$scope', 'mmLogin', function($scope, LOGIN) {
    $scope.LOGIN = LOGIN;
    $scope.login = function(username, password) {
      LOGIN.login(username, password, function() {
        $scope.ons.slidingMenu.setAbovePage('navigatorProjects.html');
      });
    };
    $scope.register = function(username, password, password2) {
      LOGIN.register(username, password, password2, function() {
        $scope.ons.slidingMenu.setAbovePage('navigatorLogin.html');
      });
    };
  }]);

})();
