(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives', 'google-maps']);
	
	app.controller('app', ['$scope', function($scope) {
		$scope.$root.message = function(mess) {
			alert(mess);
		};
		
		$scope.map = {
			center: {
				latitude: 51.133253392421864,
				longitude: 17.02815246582033
			},
			zoom: 12,
			pan: 'y'
		};
		
		$scope.marker = {
			coords: {
				latitude: 51.133253392421864,
				longitude: 17.02015246582033
			},
			events: {
				click: function() {
					$scope.marker.showWindow = true;
					//alert('click event');
				}
			},
			showWindow: false/*,
			labelContent: 'window1.html'*/
		};
		
		$scope.window1 = {
			isIconVisibleOnClick: false,
			templateUrl: 'window1.html',
			closeClick: function() {
				alert('close');
			}
		};
	}]);
})();
