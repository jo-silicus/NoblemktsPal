app.controller('loginController', [
		'$scope',
		'$location',
		'localStorageService',
		'homeService',
		'sharedConst',
		'$rootScope',
		function($scope, $location, localStorageService, homeService,
				sharedConst, $rootScope) {
			$('body').addClass('mainlogin');
			$scope.parentIndexCtrl = {};
			$scope.parentIndexCtrl.showLoadingIndicator = false;
			$rootScope.loggedInUserName = "";
			$rootScope.isSave = {};
			if ($location.absUrl().split('?')[1] != undefined) {
				homeService.decryptUrl($location.absUrl().split('?')[1]).then(
						function(results) {
							if (results.statusText === "OK") {
								if (results.data.length > 0) {
									localStorageService.add('userName',
											results.data[0]);
									localStorageService.add('isExistingUser',
											true);
									createUser(results.data[0]);
								}
							}
						}, function(error) {

						});
			} else {
				localStorageService.add('isExistingUser', false);
			}

			$scope.login = {};
			$scope.login = function() {
				$scope.loginForm.$setSubmitted(true);
				if ($scope.loginForm.$valid) {
					localStorageService.add('userName', $scope.login.userName);
					createUser($scope.login.userName);
				}
			};

			function createUser(userName) {
				homeService.createUser(userName).then(function(results) {
					if (results.statusText === "OK") {
						$rootScope.loggedInUserName = userName;
						$location.url($location.path());
						$location.path('/home');

					} else
						toastr.error(sharedConst.serverError);
				}, function(error) {
					toastr.error(sharedConst.serverError);
				});
			}

			$rootScope.logOutUser = function() {
				localStorage.setItem('userName', null);
				localStorageService.add('isExistingUser', null);
				$scope.personalInfoModel = {};
				$scope.entityInfoModel = {};
				$scope.accountInfoModel = {};
				$location.path('/login')
			};
		} ]);
