app
		.controller(
				'entityController',
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
							$scope.$on('initalizeEntity',
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
								$scope.states = [];
								$scope.mailingStates = [];
								$scope.entityInfoModel = {};
								$scope.entityInfoModel.entity_information = {};
								$scope.entityInfoModel.entity_address = {};
								$scope.docEntityArray = [];
								$scope.docEDDArray = [];
								$scope.isEntityFileSelected = false;
								$scope.isEDDFileSelected = false;
								$scope.entityDocUpload = false;
								$scope.entityEDDUpload = false;
								$scope.invalidCallbackEmail = false;
								$scope.strError = "";
								$scope.countryNotFound = false;
								$scope.mailingCountryNotFound = false;
								$scope.stateNotFound = false;
								$scope.mailingStateNotFound = false;
								$scope.isCountrySelected = false;
								$scope.isMailingCountrySelected = false;
								$scope.isStateSelected = false;
								$scope.isMailingStateSelected = false;
								$scope.entityFilePath = "";
								$scope.EDDFilePath = "";
								getInitialData(localStorageService
										.get('userName'));
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
									if (sharedFactory.getUserDetails().EntityInfo != undefined) {
										$scope.isCountrySelected == true;
										$scope.isStateSelected = true;

										$scope.entityInfoModel = sharedFactory
												.getUserDetails().EntityInfo;
										$rootScope.isSave.entitySave = true;
										if ($scope.entityInfoModel.enhancedDueDiligence.length > 0) {
											$scope.docEDDArray = $scope.entityInfoModel.enhancedDueDiligence;
											$scope.isEDDFileSelected = true;
										}
										if ($scope.entityInfoModel.entityDocUpload.length > 0) {
											$scope.docEntityArray = $scope.entityInfoModel.entityDocUpload;
											$scope.isEntityFileSelected = true;
										}
									}
								}

								if ($scope.entityInfoModel != undefined) {
									if ($scope.entityInfoModel.entity_information.registered_Country != undefined) {
										var hqCountryList = $filter('filter')
												(
														$scope.listData.countryList,
														{
															code : $scope.entityInfoModel.entity_information.registered_Country
														}, true)[0];
										$scope.entityInfoModel.hqCountryName = hqCountryList.name;
										$scope.entityInfoModel.hqCountry = $scope.entityInfoModel.entity_information.registered_Country;
										if (hqCountryList != undefined) {
											getState(hqCountryList);
										}
									}
									if ($scope.entityInfoModel.entity_address.country != undefined) {
										var mailingCountryList = $filter(
												'filter')
												(
														$scope.listData.countryList,
														{
															code : $scope.entityInfoModel.entity_address.country
														}, true)[0];
										$scope.entityInfoModel.mailingCountryName = mailingCountryList.name;
										$scope.entityInfoModel.mailingCountry = $scope.entityInfoModel.entity_address.country;
										if (mailingCountryList != undefined) {
											getState(mailingCountryList,
													'mailingStates');
										}
									}
								} else {
									$scope.entityInfoModel = {};
									$scope.entityInfoModel.entity_information = {};
									$scope.entityInfoModel.entity_address = {};
								}
							}

							// Get States by country
							function getState(country, type) {
								var statesbyCountry = $filter('filter')(
										$scope.listData.stateList, {
											countryid : parseInt(country.id)
										}, true);
								if (type === "mailingStates")
									$scope.mailingStates = statesbyCountry
								else
									$scope.states = statesbyCountry

							}

							// Save Entity Information
							$scope.saveEntityInfo = function() {
								$scope.addEditEntityInfo.$setSubmitted(true);
								if ($scope.addEditEntityInfo.$valid) {
									$scope.entityInfoModel.type = "EntityInfo";
									if ($scope.docEntityArray.length == 0) {
										toastr
												.error(sharedConst.documentRequiredError);
										$scope.entityDocUpload = true;
										return false;
									}
									var isValid = true;
									isvalid = validatePhone(
											$scope.entityInfoModel.entity_address.phone,
											$scope.entityInfoModel.entity_address.alt_Phone)
									if (!isvalid)
										return false;
									$scope.entityInfoModel.userName = localStorageService
											.get('userName');
									$scope.entityInfoModel.email = localStorageService
											.get('userName');
									$scope.entityInfoModel.entity_information.registered_Country = $scope.entityInfoModel.hqCountry;
									$scope.entityInfoModel.entity_address.country = $scope.entityInfoModel.mailingCountry;
									$scope.entityInfoModel.entity_information.registeredCountryName = $scope.entityInfoModel.entity_information.registeredCountry;

									if ($scope.file != undefined) {
										var fileArray = $scope.file.split('.');
										$scope.entityInfoModel.file = fileArray[0]
												+ "_"
												+ $scope.entityInfoModel.userName
												+ "." + fileArray[1];
									}
									if ($scope.fileEDD != undefined) {
										var fileArray = $scope.fileEDD
												.split('.');
										$scope.entityInfoModel.eddFile = fileArray[0]
												+ "_"
												+ $scope.entityInfoModel.userName
												+ "." + fileArray[1];
									}
									$scope.entityInfoModel.entityDocUpload = $scope.docEntityArray;// change
									$scope.entityInfoModel.enhancedDueDiligence = $scope.docEDDArray;// change
									homeService
											.addEntityInfo(
													$scope.entityInfoModel)
											.then(
													function(results) {
														if (results.statusText == "OK") {
															$rootScope.isSave.entitySave = true;
															toastr
																	.success(sharedConst.entitySuccess);
															$scope.addEditEntityInfo
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

							function validatePhone(phone, alternatePhone) {
								if (phone == alternatePhone
										&& (phone != undefined && alternatePhone != undefined)) {
									toastr.error(sharedConst.phoneCompareError);
									return false;
								} else
									return true;
							}

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

							// Validate Entity tab document upload section
							$scope.validateEntityForm = function(e) {
								$("#entityFile").val("");
								if (!$scope.entityInfoModel.entityDocUpload) {
									$scope.entityDocUpload = true;
									e.preventDefault();
									toastr.error(sharedConst.requiredError);
								} else
									$scope.entityDocUpload = false;
							}

							// Validate Entity tab selected document
							$scope.selectEntityFile = function(file) {
								var isDuplicate = false
								var fd = new FormData();
								var data = file[0];
								var ext = data.name.split('.').pop()
										.toLowerCase();
								if (!($.inArray(ext, [ 'pdf', 'png', 'jpeg',
										'jpg' ]) == -1)) {
									var isValidFileSize = validateFileSize(data);
									if (isValidFileSize == false)
										return false;
									$scope.isEntityFileSelected = true;
									var docObject = {
										documentType : $scope.entityInfoModel.entityDocUpload,
										originalName : data.name,
										newFileName : $scope.entityInfoModel.entityDocUpload
												+ "_"
												+ localStorageService
														.get('userName')
												+ "."
												+ data.name.split('.')[1]
									};
									var cnt = 0;
									angular
											.forEach(
													$scope.docEntityArray,
													function(d, i) {
														if (d.documentType === docObject.documentType) {
															$(
																	'#modalConfirmYesNo')
																	.modal(
																			'show');
															$("#btnYes")
																	.off(
																			'click')
																	.click(
																			function() {
																				$(
																						'#modalConfirmYesNo')
																						.modal(
																								'hide');

																				uploadEntityFile(
																						fd,
																						data,
																						docObject,
																						i);
																			});
															$("#btnNo")
																	.off(
																			'click')
																	.click(
																			function() {
																				$(
																						'#modalConfirmYesNo')
																						.modal(
																								'hide');
																			});
															isDuplicate = true;
														}
													});
									if (!isDuplicate) {

										uploadEntityFile(fd, data, docObject);
									}
								} else
									toastr.error(sharedConst.fileTypeError);
							};

							// Upload Entity tab selected document
							function uploadEntityFile(fd, data, docObject,
									currIndex) {
								$scope.file = data.name;
								fd.append("file", data);
								fd.append("userName", localStorageService
										.get('userName'));
								fd.append("newFileName",
										$scope.entityInfoModel.entityDocUpload
												+ "_"
												+ localStorageService
														.get('userName') + "."
												+ data.name.split('.')[1]);
								homeService
										.uploadFile(fd)
										.then(
												function(results) {
													if (results.statusText == "OK") {
														$scope.entityFilePath = $("#entityFile")[0].value;
														if (results.data.length > 0)
															docObject.file_path = results.data[0];

														if (currIndex != undefined)
															$scope.docEntityArray[currIndex] = docObject;
														else
															$scope.docEntityArray
																	.push(docObject);

														$scope.entityInfoModel.entityDocUpload = "";
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
							}

							$scope.validateEntityEDDForm = function(e) {
								$("#eddFile").val("");
								if (!$scope.entityInfoModel.enhancedDueDiligence) {
									$scope.entityEDDUpload = true;
									e.preventDefault();
									toastr.error(sharedConst.requiredError);
								} else
									$scope.entityEDDUpload = false;
							}

							// Validate Entity tab selected document
							$scope.selectEntityEDDFile = function(file) {
								var isDuplicate = false
								var fd = new FormData();
								var data = file[0];
								var ext = data.name.split('.').pop()
										.toLowerCase();
								if (!($.inArray(ext, [ 'pdf', 'png', 'jpeg',
										'jpg' ]) == -1)) {
									var isValidFileSize = validateFileSize(data);
									if (isValidFileSize == false)
										return false;
									$scope.isEDDFileSelected = true;
									var docObject = {
										documentType : $scope.entityInfoModel.enhancedDueDiligence,
										originalName : data.name,
										newFileName : $scope.entityInfoModel.enhancedDueDiligence
												+ "_"
												+ localStorageService
														.get('userName')
												+ "."
												+ data.name.split('.')[1]
									};
									var cnt = 0;
									angular
											.forEach(
													$scope.docEDDArray,
													function(d, i) {
														if (d.documentType === docObject.documentType) {
															$(
																	'#modalConfirmYesNo')
																	.modal(
																			'show');
															$("#btnYes")
																	.off(
																			'click')
																	.click(
																			function() {
																				$(
																						'#modalConfirmYesNo')
																						.modal(
																								'hide');
																				uploadEntityEDDFile(
																						fd,
																						data,
																						docObject,
																						i);
																			});
															$("#btnNo")
																	.off(
																			'click')
																	.click(
																			function() {
																				$(
																						'#modalConfirmYesNo')
																						.modal(
																								'hide');
																			});
															isDuplicate = true;
														}
													});
									if (!isDuplicate) {
										uploadEntityEDDFile(fd, data, docObject);
									}
								} else
									toastr.error(sharedConst.fileTypeError);
							};

							// Upload Entity tab selected document
							function uploadEntityEDDFile(fd, data, docObject,
									currIndex) {
								$scope.fileEDD = data.name;
								fd.append("file", data);
								fd.append("userName", localStorageService
										.get('userName'));
								fd
										.append(
												"newFileName",
												$scope.entityInfoModel.enhancedDueDiligence
														+ "_"
														+ localStorageService
																.get('userName')
														+ "."
														+ data.name.split('.')[1]);
								homeService
										.uploadFile(fd)
										.then(
												function(results) {
													if (results.statusText == "OK") {
														$scope.EDDFilePath = $("#eddFile")[0].value;
														if (results.data.length > 0)
															docObject.file_path = results.data[0];

														if (currIndex != undefined)
															$scope.docEDDArray[currIndex] = docObject;
														else
															$scope.docEDDArray
																	.push(docObject);

														$scope.entityInfoModel.enhancedDueDiligence = "";
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
							}

							function validateFileSize(file) {
								var maxSize = 10485760; // in bytes
								if (file.size > maxSize) {
									toastr.error(sharedConst.fileSizeError);
									return false;
								} else
									return true;
							}

							$scope.entityNext = function() {
								if ($scope.addEditEntityInfo.$dirty == false) {
									$('#Account').css("display", "block");
									$('#Entity').css("display", "none")
									reset();
									eNext();
								} else {
									$('#modalDirty').modal('show');
								}
							};

							$scope.entityPrev = function() {
								if ($scope.addEditEntityInfo.$dirty == false) {
									$('#Personal').css("display", "block");
									$('#Entity').css("display", "none")
									$scope.isSave = true;
									reset();
								} else {
									$('#modalDirty').modal('show');
								}
							};

							$scope.emailValidate = function(email, field) {
								if (email != "" && email != undefined) {
									var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
									var validEmail = pattern.test(email);
									if (validEmail) {
										if (field === "reportsEmail")
											$scope.addEditEntityInfo.reportsEmail
													.$setValidity(
															$scope.addEditEntityInfo.reportsEmail.$name,
															true);
										else if (field === "callbackEmail") {
											$scope.addEditEntityInfo.callbackEmail
													.$setValidity(
															$scope.addEditEntityInfo.callbackEmail.$name,
															true);
											$scope.invalidCallbackEmail = false;
										}
									} else {
										if (field === "reportsEmail")
											$scope.addEditEntityInfo.reportsEmail
													.$setValidity(
															$scope.addEditEntityInfo.reportsEmail.$name,
															false);
										else if (field === "callbackEmail") {
											$scope.addEditEntityInfo.callbackEmail
													.$setValidity(
															$scope.addEditEntityInfo.callbackEmail.$name,
															false);
											$scope.invalidCallbackEmail = true;
										}
									}
								} else {
									if (field === "reportsEmail")
										$scope.addEditEntityInfo.reportsEmail
												.$setValidity(
														$scope.addEditEntityInfo.reportsEmail.$name,
														true);
									else if (field === "callbackEmail") {
										$scope.addEditEntityInfo.callbackEmail
												.$setValidity(
														$scope.addEditEntityInfo.callbackEmail.$name,
														true);
										$scope.invalidCallbackEmail = false;
									}
								}
							};

							$scope.validateReportsEmail = function(email) {
								if (email != "" && email != undefined) {
									var emailArray = email.replace(/ /g, '')
											.split(',');
									if (emailArray.length > 1) {
										for (i = 0; i < emailArray.length; i++) {
											validate(emailArray[i]);
										}
									} else
										validate(email);
								} else
									$scope.addEditEntityInfo.reportsEmail
											.$setValidity(
													$scope.addEditEntityInfo.reportsEmail.$name,
													true);
							}

							function validate(email) {
								var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
								var validEmail = pattern.test(email);
								if (validEmail)
									$scope.addEditEntityInfo.reportsEmail
											.$setValidity(
													$scope.addEditEntityInfo.reportsEmail.$name,
													true);
								else
									$scope.addEditEntityInfo.reportsEmail
											.$setValidity(
													$scope.addEditEntityInfo.reportsEmail.$name,
													false);
							}

							$scope.resetEntityInfo = function() {
								$scope.addEditEntityInfo.$setPristine();
								$scope.entityInfoModel = {};
								$scope.docEntityArray = [];
								$scope.docEDDArray = [];
							};

							function reset() {
								window.scrollTo(0, 0);
								$scope.fileTypeError = false;
							}

							function eNext() {
								function sticky_relocate3() {
									var window_top = $(window).scrollTop();
									var div_top = ($('#sticky-anchor3')
											.offset() || {
										"top" : NaN
									}).top;
									if (window_top > div_top) {
										$('#sticky3').addClass('stick');

									} else {
										$('#sticky3').removeClass('stick');

									}
								}
								$(function() {
									$(window).scroll(sticky_relocate3);
									sticky_relocate3();
								});
							}

							// Copy Headquarter details to Mailing address
							// section
							$scope.setData = function(sameasAbove) {
								if (sameasAbove == true) {
									$scope.entityInfoModel.entity_address.postal_Address = angular
											.copy($scope.entityInfoModel.entity_information.registered_Address);
									$scope.entityInfoModel.mailingStreetAddress2 = angular
											.copy($scope.entityInfoModel.hqStreetAddress2);
									$scope.entityInfoModel.mailingCountryName = $scope.entityInfoModel.hqCountryName;
									$scope.entityInfoModel.mailingCountry = $scope.entityInfoModel.hqCountry;
									$scope.mailingStates = $filter('filter')
											(
													$scope.listData.stateList,
													{
														countryid : parseInt($scope.entityInfoModel.hqCountryId)
													}, true);
									$scope.entityInfoModel.entity_address.state = $scope.entityInfoModel.entity_information.registered_State;
									$scope.entityInfoModel.entity_address.city = angular
											.copy($scope.entityInfoModel.entity_information.registered_City);
									$scope.entityInfoModel.entity_address.postcode = angular
											.copy($scope.entityInfoModel.entity_information.registered_Postcode);
								} else {
									$scope.entityInfoModel.entity_address.postal_Address = "";
									$scope.entityInfoModel.mailingStreetAddress2 = "";
									$scope.entityInfoModel.mailingCountry = "";
									$scope.entityInfoModel.mailingCountryName = "";
									$scope.entityInfoModel.entity_address.state = "";
									$scope.entityInfoModel.entity_address.city = "";
									$scope.entityInfoModel.entity_address.postcode = "";
								}
							};

							// Autocomplete Section
							$scope.autocomplete_countries = {
								suggest : suggest_suggestCountryNames,
								on_select : function(selected) {
									setSelectedName(1, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isCountrySelected == false
											&& current_value != "") {
										$scope.countryNotFound = true;
										$scope.entityInfoModel.entity_information.registered_State = "";
										$scope.states = [];
										$scope.addEditEntityInfo.hqCountry
												.$setValidity("invalid", false);
									} else {
										$scope.countryNotFound = false;
										$scope.addEditEntityInfo.hqCountry
												.$setValidity("invalid", true);
									}
								}
							};
							$scope.autocomplete_mailingCountries = {
								suggest : suggest_suggestMailingCountryNames,
								on_select : function(selected) {
									setSelectedName(2, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isMailingCountrySelected == false
											&& current_value != "") {
										$scope.mailingCountryNotFound = true;
										$scope.entityInfoModel.entity_address.state = "";
										$scope.mailingStates = [];
										$scope.addEditEntityInfo.country
												.$setValidity("invalid", false);
									} else {
										$scope.mailingCountryNotFound = false;
										$scope.addEditEntityInfo.country
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

							function suggest_suggestMailingCountryNames(term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.mailingCountryNotFound = false;
									$scope.isMailingCountrySelected = false;
								} else {
									$scope.mailingCountryNotFound = true;
									$scope.isMailingCountrySelected = false;
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
									setSelectedName(3, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isStateSelected == false
											&& current_value != "") {
										$scope.stateNotFound = true;
										$scope.addEditEntityInfo.registeredState
												.$setValidity("invalid", false);
									} else {
										$scope.stateNotFound = false;
										$scope.addEditEntityInfo.registeredState
												.$setValidity("invalid", true);
									}
								}
							};

							$scope.autocomplete_mailingStates = {
								suggest : suggest_suggestMailingStateNames,
								on_select : function(selected) {
									setSelectedName(4, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isMailingStateSelected == false
											&& current_value != "") {
										$scope.mailingStateNotFound = true;
										$scope.addEditEntityInfo.state
												.$setValidity("invalid", false);
									} else {
										$scope.mailingStateNotFound = false;
										$scope.addEditEntityInfo.state
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

							function suggest_suggestMailingStateNames(term) {
								var results = [];
								results = getStates(term, $scope.mailingStates);
								if (results.length > 0) {
									$scope.mailingStateNotFound = false;
									$scope.isMailingStateSelected = false;
								} else {
									$scope.mailingStateNotFound = true;
									$scope.isMailingStateSelected = false;
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

							function setSelectedName(type, selectedObject) {
								if (type == 1) {
									$scope.entityInfoModel.hqCountry = selectedObject.code;
									$scope.entityInfoModel.hqCountryName = selectedObject.name;

									$scope.entityInfoModel.hqCountryId = selectedObject.id;
									$scope.entityInfoModel.entity_information.registered_State = "";
									$scope.isCountrySelected = true;
									getState(selectedObject, 'hqStates');
								} else if (type == 2) {
									$scope.entityInfoModel.mailingCountry = selectedObject.code;
									$scope.entityInfoModel.mailingCountryName = selectedObject.name;
									$scope.entityInfoModel.entity_address.state = "";
									$scope.isMailingCountrySelected = true;
									getState(selectedObject, 'mailingStates');
								} else if (type == 3) {
									$scope.entityInfoModel.entity_information.registered_State = selectedObject.name;
									$scope.isStateSelected = true;
								} else if (type == 4) {
									$scope.entityInfoModel.entity_address.state = selectedObject.name;
									$scope.isMailingStateSelected = true;
								}
							}
							;

							init();
						} ]);