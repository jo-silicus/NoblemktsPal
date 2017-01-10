var app = angular.module('KYCApp',
		[ 'ngRoute', 'LocalStorageModule', 'MassAutoComplete', 'ngSanitize' ])
		.config([ '$routeProvider', function($routeProvider) {
			$routeProvider.when("/login", {
				controller : "loginController",
				templateUrl : "login.html"
			}).when("/home", {
				controller : "personalController",
				templateUrl : "Innerpage.html"
			}).otherwise({
				redirectTo : "/login"
			});
		} ]).constant(
				'webAPI',
				{
					apiServiceBaseUri : window.location.origin + '/'
							+ window.location.href.split('/')[3] + '/',
					ClientUri : '/' + window.location.href.split('/')[3]
							+ '/static/'
				});
angular.element(document).ready(function() {
	angular.bootstrap(document, [ 'KYCApp' ]);
});
app.config(function($httpProvider) {
	$httpProvider.interceptors.push('loaderService');
	$httpProvider.interceptors.push(function($q, $rootScope) {
		var requests = 0;

		function show() {
			if (!requests) {
				$rootScope.$broadcast("ajax-start", true);
			}
			requests++;
		}
		function hide() {
			requests--;
			if (!requests) {
				$rootScope.$broadcast("ajax-stop", true);
			}
		}
		return {
			'request' : function(config) {
				show();
				return $q.when(config);
			},
			'response' : function(response) {
				hide();
				return $q.when(response);
			},
			'responseError' : function(rejection) {
				hide();
				return $q.reject(rejection);
			}
		};
	});
});
