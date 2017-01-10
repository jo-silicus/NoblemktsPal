app
		.controller(
				'accountController',
				[
						'$scope',
						'homeService',
						'localStorageService',
						'$location',
						'$filter',
						'sharedFactory',
						'$sce',
						'sharedConst',
						'$rootScope',
						function($scope, homeService, localStorageService,
								$location, $filter, sharedFactory, $sce,
								sharedConst, $rootScope) {
							$scope.$on('initalizeAccount',
									function(event, args) {
										init();
									});

							function init() {
								if (localStorageService.get('userName') == undefined
										|| localStorageService.get('userName') == null) {
									$location.path('/login');
								}
								$rootScope.loggedInUserName = localStorageService
										.get('userName');
								$scope.listData = [];
								$scope.accountSave = false;
								$scope.states = [];
								$scope.correspondenceStates = [];
								$scope.accountInfoModel = {};
								$scope.accountInfoModel.account_information = {};
								$scope.strError = "";
								$scope.bankNotFound = false;
								$scope.corrBankNotFound = false;
								$scope.countryNotFound = false;
								$scope.corrCountryNotFound = false;
								$scope.stateNotFound = false;
								$scope.corrStateNotFound = false;
								$scope.isBankNameSelected = false;
								$scope.isCorrBankNameSelected = false;
								$scope.isCountrySelected == false;
								$scope.isCorrCountrySelected == false
								$scope.isStateSelected = false;
								$scope.isCorrStateSelected = false;
								$scope.isAutoComplete = false;
								$scope.isCorrAutoComplete = false;
								$scope.isCorrPaymentTypeSelected = false;
								$scope.corr_payment_code_one_id = "";
								getInitialData(localStorageService
										.get('userName'));
								fetchBankNames();
							}

							function getInitialData(userName) {
								$scope.listData.currencyList = sharedFactory
										.getCurrencList();
								$scope.listData.countryList = sharedFactory
										.getCountryList();
								if ($scope.listData.stateList == undefined)
									$scope.listData.stateList = sharedFactory
											.getStateList();

								if (sharedFactory.getUserDetails() != undefined) {
									if (sharedFactory.getUserDetails().AccountInfo != undefined) {
										$scope.isCorrBankNameSelected = true;
										$scope.isCountrySelected == true;
										$scope.isCorrCountrySelected == true;
										$scope.isStateSelected = true;
										$scope.isCorrStateSelected = true;
										$scope.accountInfoModel = sharedFactory
												.getUserDetails().AccountInfo;
										$scope.corr_payment_code_one_id = $scope.accountInfoModel.payment_code_one_id;
										$scope.isCorrPaymentTypeSelected = true;
										$rootScope.isSave.accountSave = true;
									}
								}

								if ($scope.accountInfoModel != undefined) {
									if ($scope.accountInfoModel.account_information.accountCountry != undefined) {
										var accountsCountry = $filter('filter')
												(
														$scope.listData.countryList,
														{
															code : $scope.accountInfoModel.account_information.accountCountry
														}, true)[0];
										$scope.accountInfoModel.accCountryName = accountsCountry.name;
										if (accountsCountry != undefined) {
											getState(accountsCountry);
										}
									}
									if ($scope.accountInfoModel.corrAccountsCountryName != undefined) {
										var corrAccountsCountry = $filter(
												'filter')
												(
														$scope.listData.countryList,
														{
															code : $scope.accountInfoModel.corrAccountsCountryName
														}, true)[0];
										$scope.accountInfoModel.corrAccCountryName = corrAccountsCountry.name;
										if (corrAccountsCountry != undefined) {
											getState(corrAccountsCountry,
													'correspondenceStates');
										}
									}
								} else {
									$scope.accountInfoModel = {};
									$scope.accountInfoModel.account_information = {};
								}
							}

							// Get States by country
							function getState(country, type) {
								var statesbyCountry = $filter('filter')(
										$scope.listData.stateList, {
											countryid : parseInt(country.id)
										}, true);
								if (type === "correspondenceStates")
									$scope.correspondenceStates = statesbyCountry
								else
									$scope.states = statesbyCountry;
							}
							;

							$scope.submit = function() {
								if ($scope.addEditAccountInfo.$dirty == false) {
									if (!$rootScope.isSave.personalSave
											&& !$rootScope.isSave.entitySave
											&& !$rootScope.isSave.accountSave) {
										toastr
												.error(sharedConst.personalInfoRequiredError
														+ '</br>'
														+ sharedConst.entityInfoRequiredError
														+ '</br>'
														+ sharedConst.accountInfoRequiredError);
										return false;
									}
									if (!$rootScope.isSave.personalSave
											&& !$rootScope.isSave.entitySave) {
										toastr
												.error(sharedConst.personalInfoRequiredError
														+ '</br>'
														+ sharedConst.entityInfoRequiredError);
										return false;
									} else if (!$rootScope.isSave.personalSave) {
										toastr
												.error(sharedConst.personalInfoRequiredError);
										return false;
									} else if (!$rootScope.isSave.entitySave) {
										toastr
												.error(sharedConst.entityInfoRequiredError);
										return false;
									}
									$('#modalConfirmSubmit').modal('show');
									$("#btYes")
											.off('click')
											.click(
													function() {
														$('#modalConfirmSubmit')
																.modal('hide');
														homeService
																.renameFolder(
																		localStorageService
																				.get('userName'))
																.then(
																		function(
																				results) {
																		});
														homeService
																.sendEmail(
																		localStorageService
																				.get('userName'))
																.then(
																		function(
																				results) {
																		});
														$('#myModal').modal(
																'show');
													});
									$("#btNo").off('click').click(function() {
										$('#modalConfirmSubmit').modal('hide');
									});
								} else {
									$('#modalDirty').modal('show');
									$scope.accountSave = false;
								}
							};

							// Save Account Information
							$scope.saveAccountInfo = function() {
								$scope.addEditAccountInfo.$setSubmitted(true);
								if ($scope.addEditAccountInfo.$valid) {
									$scope.accountInfoModel.type = "AccountInfo";
									$scope.accountInfoModel.userName = localStorageService
											.get('userName');
									$scope.accountInfoModel.email = localStorageService
											.get('userName');
									homeService
											.addAccountInfo(
													$scope.accountInfoModel)
											.then(
													function(results) {
														if (results.statusText == "OK") {
															localStorageService
																	.add(
																			'isExistingUser',
																			true);
															$rootScope.isSave.accountSave = true;
															$scope.accountSave = true;
															toastr
																	.success(sharedConst.accountSuccess);
															$scope.addEditAccountInfo
																	.$setPristine();
														} else {
															if (results.data.length != 0)
																showServerErrors(results.data)
															else
																toastr
																		.error(sharedConst.serverError);
														}
													},
													function(error) {
														toastr
																.error(sharedConst.serverError);
													});
								} else {
									toastr.error(sharedConst.requiredError);
								}
							};

							function showServerErrors(errorList) {
								$scope.strError = "";
								for (i = 0; i < errorList.length; i++) {
									if ($scope.strError === "") {
										$scope.strError = "<div>Error!</div>";
										$scope.strError = $scope.strError
												+ "<ul><li>" + errorList[i]
												+ "</li>";
									} else {
										$scope.strError = $scope.strError
												+ "<li>" + errorList[i]
												+ "</li>";
									}
								}
								$scope.strError = $scope.strError + "</ul>";
								toastr.error($scope.strError);
							}

							$scope.accountPrev = function() {
								if ($scope.addEditAccountInfo.$dirty == false) {
									$('#Entity').css("display", "block");
									$('#Account').css("display", "none")
									reset();
								} else {
									$('#modalDirty').modal('show');
									$scope.accountSave = false;
								}
							};

							$scope.resetAccountInfo = function() {
								$scope.addEditAccountInfo.$setPristine();
								$scope.accountInfoModel = {};
							};

							$scope.Logout = function() {
								$('#myModal').modal('hide');
								localStorage.setItem('userName', null);
								localStorageService.add('isExistingUser', null);
								$scope.personalInfoModel = {};
								$scope.entityInfoModel = {};
								$scope.accountInfoModel = {};
								reset();
								$location.path('/login')
							};

							function reset() {
								window.scrollTo(0, 0);
							}

							// AutoComplete Section
							$scope.autocomplete_corrBankNames = {
								suggest : suggest_corrBankNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.Name,
											selected.obj.Id, 1);
								},
								on_detach : function(current_value) {
									if ($scope.isCorrBankNameSelected == false
											&& current_value != "") {
										$scope.corrBankNotFound = true;
										$scope.accountInfoModel.corrbankName = "";
										$scope.addEditAccountInfo.corrBankCode
												.$setValidity("invalid", false);
									} else {
										$scope.corrBankNotFound = false;
										$scope.addEditAccountInfo.corrBankCode
												.$setValidity("invalid", true);
									}
								}
							};

							$scope.autocomplete_accountBankNames = {
								suggest : suggest_bankNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.Name,
											selected.obj.Id, 2);
								},
								on_detach : function(current_value) {
									if ($scope.isBankNameSelected == false
											&& current_value != "") {
										$scope.bankNotFound = true;
										$scope.accountInfoModel.bank = "";
										$scope.addEditAccountInfo.bankCode
												.$setValidity("invalid", false);
									} else {
										$scope.bankNotFound = false;
										$scope.addEditAccountInfo.bankCode
												.$setValidity("invalid", true);
									}
								}
							};

							function suggest_bankNames(term) {
								var q = term.toLowerCase().trim();
								var results = [];
								for (var i = 0; i < $scope.bankNamesList.length; i++) {
									var bankDetails = $scope.bankNamesList[i];
									if (bankDetails.Name == null) {
										bankDetails.Name = '';
									}
									if (bankDetails.Id.toString().indexOf(q) == 0) {
										results
												.push({
													value : bankDetails.Name,
													id : bankDetails.Id,
													obj : bankDetails,
													label : $sce.trustAsHtml = ('<div>'
															+ '<table>'
															+ '<tbody>'
															+ '<tr>'
															+ '<td  ng-if="bankDetails.Id">'
															+ bankDetails.Id
															+ ' - '
															+ bankDetails.Name
															+ '</td>'
															+ '</tr>'
															+ '</tbody>'
															+ '</table>' + '</div>')
												});
									}
								}
								if (results.length > 0) {
									$scope.bankNotFound = false;
									$scope.isBankNameSelected = false;

								} else
									$scope.bankNotFound = true;

								return results;
							}

							function suggest_corrBankNames(term) {
								var q = term.toLowerCase().trim();
								var results = [];
								for (var i = 0; i < $scope.bankNamesList.length; i++) {
									var bankDetails = $scope.bankNamesList[i];
									if (bankDetails.Name == null) {
										bankDetails.Name = '';
									}
									if (bankDetails.Id.toString().indexOf(q) == 0) {
										results
												.push({
													value : bankDetails.Name,
													id : bankDetails.Id,
													obj : bankDetails,
													label : $sce.trustAsHtml = ('<div>'
															+ '<table>'
															+ '<tbody>'
															+ '<tr>'
															+ '<td  ng-if="bankDetails.Id">'
															+ bankDetails.Id
															+ ' - '
															+ bankDetails.Name
															+ '</td>'
															+ '</tr>'
															+ '</tbody>'
															+ '</table>' + '</div>')
												});
									}
								}
								if (results.length > 0) {
									$scope.corrBankNotFound = false;
									$scope.isCorrBankNameSelected = false;
								} else
									$scope.corrBankNotFound = true;
								return results;
							}

							$scope.autocomplete_countries = {
								suggest : suggest_suggestCountryNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.name,
											selected.obj.Id, 3, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isCountrySelected == false
											&& current_value != "") {
										$scope.countryNotFound = true;
										$scope.accountInfoModel.account_information.addrState = "";
										$scope.states = [];
										$scope.addEditAccountInfo.accountsCountry
												.$setValidity("invalid", false);
									} else {
										$scope.countryNotFound = false;
										$scope.addEditAccountInfo.accountsCountry
												.$setValidity("invalid", true);
									}
								}
							};
							$scope.autocomplete_correspondenceCountries = {
								suggest : suggest_suggestCorrCountryNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.name,
											selected.obj.Id, 4, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isCorrCountrySelected == false
											&& current_value != "") {
										$scope.corrCountryNotFound = true;
										$scope.accountInfoModel.corrstate = "";
										$scope.correspondenceStates = [];
										$scope.addEditAccountInfo.corrAccountsCountry
												.$setValidity("invalid", false);
									} else {
										$scope.corrCountryNotFound = false;
										$scope.addEditAccountInfo.corrAccountsCountry
												.$setValidity("invalid", true);
									}
								}
							};

							function suggest_suggestCountryNames(term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.countryNotFound = false;
									$scope.isCountrySelected = false;
								} else {
									$scope.countryNotFound = true;
									$scope.isCountrySelected = false;
								}

								return results;
							}

							function suggest_suggestCorrCountryNames(term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.corrCountryNotFound = false;
									$scope.isCorrCountrySelected = false;
								} else {
									$scope.corrCountryNotFound = true;
									$scope.isCorrCountrySelected = false;
								}

								return results;
							}

							function getCountries(term) {
								var q = term.toLowerCase().trim();
								var results = [];
								for (var i = 0; i < $scope.listData.countryList.length; i++) {
									var countryDetails = $scope.listData.countryList[i];
									if (countryDetails.name == null) {
										countryDetails.name = '';
									}
									if (countryDetails.name.toLowerCase()
											.indexOf(q) == 0) {
										results
												.push({
													value : countryDetails.name,
													id : countryDetails.id,
													obj : countryDetails,
													label : $sce.trustAsHtml = ('<div>'
															+ '<table>'
															+ '<tbody>'
															+ '<tr>'
															+ '<td  ng-if="countryDetails.id">'
															+ countryDetails.name
															+ '</td>'
															+ '</tr>'
															+ '</tbody>'
															+ '</table>' + '</div>')
												});
									}
								}
								return results;
							}

							$scope.autocomplete_states = {
								suggest : suggest_suggestStateNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.name,
											selected.obj.Id, 5);
								},
								on_detach : function(current_value) {
									if ($scope.isStateSelected == false
											&& current_value != "") {
										$scope.stateNotFound = true;
										$scope.addEditAccountInfo.addrState
												.$setValidity("invalid", false);
									} else {
										$scope.stateNotFound = false;
										$scope.addEditAccountInfo.addrState
												.$setValidity("invalid", true);
									}
								}
							};

							$scope.autocomplete_correspondenceStates = {
								suggest : suggest_suggestCorrStateNames,
								on_select : function(selected) {
									setSelectedName(selected.obj.name,
											selected.obj.Id, 6);
								},
								on_detach : function(current_value) {
									if ($scope.isCorrStateSelected == false
											&& current_value != "") {
										$scope.corrStateNotFound = true;
										$scope.addEditAccountInfo.corrstate
												.$setValidity("invalid", false);
									} else {
										$scope.corrStateNotFound = false;
										$scope.addEditAccountInfo.corrstate
												.$setValidity("invalid", true);
									}
								}
							};

							function suggest_suggestStateNames(term) {
								var results = [];
								results = getStates(term, $scope.states);
								if (results.length > 0) {
									$scope.stateNotFound = false;
									$scope.isStateSelected = false;
								} else {
									$scope.stateNotFound = true;
									$scope.isStateSelected = false;
								}
								return results;
							}

							function suggest_suggestCorrStateNames(term) {
								var results = [];
								results = getStates(term,
										$scope.correspondenceStates);
								if (results.length > 0) {
									$scope.corrStateNotFound = false;
									$scope.isCorrStateSelected = false;
								} else {
									$scope.corrStateNotFound = true;
									$scope.isCorrStateSelected = false;
								}

								return results;
							}

							function getStates(term, stateList) {
								var q = term.toLowerCase().trim();
								var results = [];
								for (var i = 0; i < stateList.length; i++) {
									var stateDetails = stateList[i];
									if (stateDetails.name == null) {
										stateDetails.name = '';
									}
									if (stateDetails.name.toLowerCase()
											.indexOf(q) == 0) {
										results
												.push({
													value : stateDetails.name,
													id : stateDetails.id,
													obj : stateDetails,
													label : $sce.trustAsHtml = ('<div>'
															+ '<table>'
															+ '<tbody>'
															+ '<tr>'
															+ '<td  ng-if="stateDetails.id">'
															+ stateDetails.name
															+ '</td>'
															+ '</tr>'
															+ '</tbody>'
															+ '</table>' + '</div>')
												});
									}
								}
								return results;
							}

							function setSelectedName(Name, Id, type,
									selectedObject) {
								if (type == 1) {
									$scope.accountInfoModel.corrbankName = Name;
									$scope.accountInfoModel.corrRoutingNo = Id;
									$scope.isCorrBankNameSelected = true;
								} else if (type == 2) {
									$scope.accountInfoModel.bank = Name;
									$scope.accountInfoModel.payment_code_one_ref = Id;
									$scope.isBankNameSelected = true;
								} else if (type == 3) {
									$scope.accountInfoModel.account_information.accountCountry = selectedObject.code;
									$scope.accountInfoModel.accCountryName = selectedObject.name;
									$scope.accountInfoModel.account_information.addrState = "";
									$scope.isCountrySelected = true;
									getState(selectedObject, 'accountsCountry');
								} else if (type == 4) {
									$scope.accountInfoModel.corrAccountsCountryName = selectedObject.code;
									$scope.accountInfoModel.corrAccCountryName = selectedObject.name;
									$scope.accountInfoModel.corrstate = "";
									$scope.isCorrCountrySelected = true;
									getState(selectedObject,
											'correspondenceStates');
								} else if (type == 5) {
									$scope.accountInfoModel.account_information.addrState = Name;
									$scope.isStateSelected = true;
								} else if (type == 6) {
									$scope.accountInfoModel.corrstate = Name;
									$scope.isCorrStateSelected = true;
								}
							}
							;

							function fetchBankNames() {
								$scope.bankNamesList = [];
								homeService
										.getBankNames()
										.then(
												function(results) {
													if (results.data != null) {
														$scope.bankNamesList = results.data;
													}
												}, function(error) {
												});
							}

							$scope.checkSelectedPaymentType = function(
									paymentType, type) {
								if (type == 1) {
									$scope.corr_payment_code_one_id = paymentType;
									if (paymentType != undefined)
										$scope.isCorrPaymentTypeSelected = true;
									else
										$scope.isCorrPaymentTypeSelected = false;

									if (paymentType === "Routing/ABA No") {
										$scope.isAutoComplete = true;
										$scope.isCorrAutoComplete = true;
										resetPaymentSection();
									} else {
										$scope.isAutoComplete = false;
										$scope.isCorrAutoComplete = false;
										resetPaymentSection();
									}
								} else {
									if (paymentType === "Routing/ABA No") {
										$scope.isCorrAutoComplete = true;
										$scope.accountInfoModel.corrRoutingNo = "";
										$scope.accountInfoModel.corrbankName = "";
									} else {
										$scope.isCorrAutoComplete = false;
										$scope.accountInfoModel.corrRoutingNo = "";
										$scope.accountInfoModel.corrbankName = "";
									}
								}
							}
							function resetPaymentSection() {
								$scope.accountInfoModel.payment_code_one_ref = "";
								$scope.accountInfoModel.bank = "";
								$scope.accountInfoModel.corrRoutingNo = "";
								$scope.accountInfoModel.corrbankName = "";
							}

							init();
						} ]);