(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives', 'google-maps']);
	
	app.controller('app', ['$rootScope', '$scope', function($rootScope, $scope) {
		$rootScope.message = function(mess) {
			alert(mess);
		};

		$rootScope.tags = [{
			value: 'one',
			name: 'ONE',
			checked: false
		}, {
			value: 'two',
			name: 'TWO',
			checked: false
		}];
		
		$scope.map = {
			center: {
				latitude: 51.133253392421864,
				longitude: 17.02815246582033
			},
			zoom: 12,
			pan: 'y'
		};
		
		$scope.materials = [];

		$scope.materials = [{
			location: {
				latitude: 51.133253392421864,
				longitude: 17.02015246582033
			},
			tags: ['one'],
			comment: 'Here we were on saturday',
			photo: 'http://ecx.images-amazon.com/images/I/311KHS%2BIefL._SX270_.jpg'
		}, {
			location: {
				latitude: 51.113253392421864,
				longitude: 17.02015246582033
			},
			tags: ['one', 'two'],
			comment: 'Here we were on sunday',
			photo: 'http://images.prd.mris.com/image/V2/1/Yc5MhpzB9jJ6NYHPaRThj8UBi-5Cler_H3qMg4YY3fyM9vW-BGSV7qKsbRcSab-Ed1MOQl4KLDLI4QzXZuboSQ.jpg'
		}, {
			location: {
				latitude: 51.113253392421864,
				longitude: 17.01015246582033
			},
			tags: ['two'],
			comment: 'Here we were on sunday',
			photo: 'http://images.prd.mris.com/image/V2/1/Yc5MhpzB9jJ6NYHPaRThj8UBi-5Cler_H3qMg4YY3fyM9vW-BGSV7qKsbRcSab-Ed1MOQl4KLDLI4QzXZuboSQ.jpg'
		}];
		
		$scope.globalEvents = {
			click: function(a, b, c) {
				this.$parent.marker.showWindow = true;
			}
		};
		/*
		$scope.$watch('$root.tags', function() {
			console.log($rootScope.tags);
			var tags = $rootScope.tags.sort();
			var toReturn = [];
			angular.forEach($scope.materialsAll, function(material) {
				var materialTags = material.tags;//.sort();
				var isOk = false;
				for(var i in tags) {
					for(var j in materialTags) {
						if (tags[i].checked && tags[i].value === materialTags[j]) {
							isOk = true;
						}
					}
				}
				if (isOk) {
					toReturn.push(material);
				}
			});
			$scope.materials = toReturn;
		}, true);*/
	}]);
	
	app.filter('tagowanie', ['$rootScope', function($rootScope) {
		var tags = $rootScope.tags.sort();
		return function(materials) {
			var toReturn = [];
			angular.forEach(materials, function(material) {
				var materialTags = material.tags;//.sort();
				var isOk = false;
				for(var i in tags) {
					for(var j in materialTags) {
						if (((tags[i].checked || tags[i].checked === 'true') && tags[i].checked !== 'false') && tags[i].value === materialTags[j]) {
							isOk = true;
						}
					}
				}
				if (isOk) {
					toReturn.push(material);
				}
			});
			return toReturn;
		};
	}]);
})();
