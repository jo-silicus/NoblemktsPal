'use strict';
app.factory('loaderService', [
		'$q',
		'$rootScope',
		function($q, $rootScope) {
			var requests = 0, loaderFlag = true;

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
					if (config.headers.isLoaderOff
							&& config.headers.isLoaderOff === 'true')
						loaderFlag = false;
					if (loaderFlag)
						show();
					return $q.when(config);
				},
				'response' : function(response) {
					if (loaderFlag)
						hide();
					loaderFlag = true;
					return $q.when(response);
				},
				'responseError' : function(rejection) {
					if (loaderFlag)
						hide();
					loaderFlag = true;
					return $q.reject(rejection);
				}
			};
		} ]);