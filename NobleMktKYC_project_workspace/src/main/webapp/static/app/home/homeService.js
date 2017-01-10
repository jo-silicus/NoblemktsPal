'use strict';
app.factory('homeService', [
		'$http',
		'webAPI',
		function($http, webAPI) {

			var homeServiceFactory = {};
			var serviceBase = webAPI.apiServiceBaseUri;
			var clientURL = webAPI.ClientUri;
			var _addPersonalInfo = function(model) {
				return $http.post(serviceBase + 'saveKycInfo/', model, {
					headers : {
						'Content-Type' : 'application/json'
					}
				}).then(function(response) {
					return response;
				}, function errorCallback(response) {
					return response;
				});
			};
			var _addEntityInfo = function(model) {
				return $http.post(serviceBase + 'saveKycInfo/', model, {
					headers : {
						'Content-Type' : 'application/json'
					}
				}).then(function(response) {
					return response;
				}, function errorCallback(response) {
					return response;
				});
			};
			var _addAccountInfo = function(model) {
				return $http.post(serviceBase + 'saveKycInfo/', model, {
					headers : {
						'Content-Type' : 'application/json'
					}
				}).then(function(response) {
					return response;
				}, function errorCallback(response) {
					return response;
				});
			};
			var _uploadFile = function(file) {
				return $http.post(serviceBase + 'uploadFile/', file, {
					transformRequest : angular.identity,
					headers : {
						'Content-Type' : undefined
					}
				}).then(function(response) {
					return response;
				}, function errorCallback(response) {
					return response;
				});
			};
			var _renameFolder = function(userName) {
				return $http.post(
						serviceBase + 'renameFolder?userName=' + userName)
						.then(function(response) {
							return response;
						});
			};
			var _getCountries = function() {
				return $http.get(clientURL + 'data/countryList.txt').then(
						function(response) {
							return response;
						});
			};
			var _getCurrency = function() {
				return $http.get(clientURL + 'data/currencyList.txt').then(
						function(response) {
							return response;
						});
			};
			var _getStates = function() {
				return $http.get(clientURL + 'data/statesList.txt').then(
						function(response) {
							return response;
						});
			};

			var _getUserDetails = function(userName) {
				return $http.get(
						serviceBase + 'fetchKycDetail?userName=' + userName)
						.then(function(response) {
							return response;
						}, function errorCallback(response) {
							return response;
						});
			};
			var _sendEmail = function(emailId) {
				return $http.post(serviceBase + 'sendMail?email=' + emailId, {
					headers : {
						'Content-Type' : 'application/json'
					}
				}).then(function(response) {
					return response;
				}, function errorCallback(response) {
					return response;
				});
			};
			var _decryptUrl = function(userName) {
				return $http.get(serviceBase + 'decryptUrl?' + userName).then(
						function(response) {
							return response;
						}, function errorCallback(response) {
							return response;
						});
			};

			var _getBankNames = function() {
				return $http.get(clientURL + 'data/bankNameMaster.txt').then(
						function(response) {
							return response;
						});
			};
			var _createUser = function(userName) {
				return $http.post(
						serviceBase + 'createUser?userName=' + userName).then(
						function(response) {
							return response;
						});
			};

			homeServiceFactory = {
				addPersonalInfo : _addPersonalInfo,
				addEntityInfo : _addEntityInfo,
				addAccountInfo : _addAccountInfo,
				uploadFile : _uploadFile,
				getCountries : _getCountries,
				getCurrency : _getCurrency,
				getStates : _getStates,
				renameFolder : _renameFolder,
				getUserDetails : _getUserDetails,
				sendEmail : _sendEmail,
				decryptUrl : _decryptUrl,
				getBankNames : _getBankNames,
				createUser : _createUser

			};
			return homeServiceFactory;
		} ]);
