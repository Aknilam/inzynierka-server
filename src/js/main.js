(function(){
	'use strict';
	var mmApp = angular.module('mmApp', [
		'ui.router',
		'ui.bootstrap',
		'onsen.directives',
    'ngTagsInput',
		'angularFileUpload',
    'pageslide-directive',
    'mmAlert',
		'mmLogin',
		'mmProjects',
		'mmProject',
		'mmMaterials',
		'mmTags',
    'mmMap',
    'mmCompass'
	]);

	mmApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state("home", {
      url: "/",
      template: '<p class="lead">Welcome to the UI-Router Demo</p>' +
        '<p>Use the menu above to navigate. ' +
        'Pay attention to the <code>$state</code> and <code>$stateParams</code> values below.</p>' +
        '<p>Click these links—<a href="#/c?id=1">Alice</a> or ' +
        '<a href="#/user/42">Bob</a>—to see a url redirect in action.</p>'

    }).state('contacts', {
			template: '<h1>My Contacts</h1>'
		});

	}]);
	
	mmApp.controller('mmCtrl', [
		'$rootScope',
		'$scope',
		'mmLogin',
		'mmProjects',
		'mmProject',
		'mmMaterials',
		'mmTags',
		function($rootScope, $scope, LOGIN, PROJECTS, PROJECT, MATERIALS, TAGS) {

			$rootScope.LOGIN = LOGIN;

			$rootScope.PROJECT = PROJECT;

			$rootScope.PROJECTS = PROJECTS;

			$rootScope.TAGS = TAGS;

			$rootScope.MATERIALS = MATERIALS;
	}]);

  mmApp.directive('fullHeight', ['$window', function($window) {
    return {
      restrict: 'EA',
      link: function(scope, element) {
        var setHeight = function() {
          element.height(window.innerHeight - element[0].getBoundingClientRect().top + 'px');
        };
    
        angular.element($window).on('resize', function () {
          setHeight();
        });

        setHeight();
      }
    };
  }]);

  mmApp.filter('orderObjectBy', function() {
    return function(items, field, reverse, notRun) {

      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });

      if (!notRun) {
        filtered.sort(function(a, b) {
          return (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1);
        });
      }

      if (reverse) filtered.reverse();
      return filtered;
    };
  });

})();
