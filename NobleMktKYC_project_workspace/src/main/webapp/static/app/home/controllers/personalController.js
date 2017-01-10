app
		.controller(
				'personalController',
				[
						'$scope',
						'homeService',
						'localStorageService',
						'$location',
						'$filter',
						'sharedFactory',
						'$q',
						'$http',
						'$sce',
						'sharedConst',
						'$rootScope',
						function($scope, homeService, localStorageService,
								$location, $filter, sharedFactory, $q, $http,
								$sce, sharedConst, $rootScope) {

							$('body').removeClass('mainlogin');
							$(function() {
								$('#dateofBirth').datetimepicker({
									format : "MM/DD/YYYY",
									ignoreReadonly : true,
									maxDate : new Date()
								});
								$('#dateofBirth')
										.on(
												"dp.change",
												function(e) {
													if (e.oldDate
															&& $scope.addEditPersonalInfo) {
														$scope.dobRequired = false;
														$scope.addEditPersonalInfo.$dirty = true;
													}
												});
							});

							$(function() {
								$('#idIssueDate').datetimepicker({
									format : "MM/DD/YYYY",
									ignoreReadonly : true,
									maxDate : new Date()
								});
								$('#idIssueDate')
										.on(
												"dp.change",
												function(e) {
													if (e.oldDate
															&& $scope.addEditPersonalInfo) {
														$scope.idIssueDateRequired = false;
													}
												});
							});

							$(function() {
								$('#idExpiryDate').datetimepicker({
									format : "MM/DD/YYYY",
									ignoreReadonly : true
								});
								$('#idExpiryDate')
										.on(
												"dp.change",
												function(e) {
													if (e.oldDate
															&& $scope.addEditPersonalInfo) {
														$scope.expiryDateRequired = false;
													}
												});
							});

							// Initialise members
							function init() {
								if (localStorageService.get('userName') == undefined
										|| localStorageService.get('userName') == null) {
									$location.path('/login');
								}
								$rootScope.loggedInUserName = localStorageService
										.get('userName');
								$scope.listData = [];
								$scope.states = [];
								// Personal Info Models Declaration
								$scope.personalInfoModel = {};
								$scope.personalInfoModel.contact_information = {};
								$scope.personalInfoModel.contact_address = {};
								$scope.docArray = [];
								$scope.isFileSelected = false;
								$scope.docTypeRequired = false;
								$scope.idTypeRequired = false;
								$scope.issueDateRequired = false;
								$scope.idNotRequired = false;
								$scope.expiryDateRequired = false;
								$scope.countryofissueRequired = false;
								$scope.emailCompare = false;
								$scope.invalidEmail = false;
								$scope.dobRequired = false;
								$scope.idIssueDateRequired = false;
								$scope.expiryDateRequired = false;
								$scope.strError = "";
								$scope.serverError = false;
								$scope.isW9DocType = false;
								$scope.countryOfCitizenshipNotFound = false;
								$scope.contactCountryNotFound = false;
								$scope.countryOfIssueNotFound = false;
								$scope.contactStateNotFound = false;
								$scope.isCountryOfCitizenshipSelected = false;
								$scope.isContactCountrySelected = false;
								$scope.isCountryOfIssueSelected = false;
								$scope.documentPath = "";
								getInitialData(localStorageService
										.get('userName'));
							}

							// Save Personal Information
							$scope.savePersonalInfo = function() {
								$scope.addEditPersonalInfo.$setSubmitted(true);
								if ($("#dateofBirth").data('date') == undefined
										|| $("#dateofBirth").data('date') == null
										|| $("#dateofBirth").data('date') === "") {
									$scope.dobRequired = true;
									toastr.error(sharedConst.requiredError);
									return false;
								}
								if ($scope.addEditPersonalInfo.$valid) {
									$scope.personalInfoModel.type = "PersonalInfo";// change
									if ($scope.docArray.length == 0) {
										toastr
												.error(sharedConst.documentRequiredError);
										$scope.docTypeRequired = true;
										$scope.idTypeRequired = true;
										$scope.countryofissueRequired = true;
										$scope.idNotRequired = true;
										$scope.idIssueDateRequired = true;
										$scope.expiryDateRequired = true;
										return false;
									}
									$scope.personalInfoModel.userName = localStorageService
											.get('userName');
									$scope.personalInfoModel.email = localStorageService
											.get('userName');
									$scope.personalInfoModel.contact_information.dob = $filter(
											'date')(
											new Date($("#dateofBirth").data(
													'date')), 'yyyy-MM-dd');
									$scope.personalInfoModel.documentUploadDetail = $scope.docArray;
									if ($scope.file != undefined) {
										var fileArray = $scope.file.split('.');
										$scope.personalInfoModel.file = fileArray[0]
												+ "_"
												+ $scope.personalInfoModel.userName
												+ "." + fileArray[1];
									}
									homeService
											.addPersonalInfo(
													$scope.personalInfoModel)
											.then(
													function(results) {
														if (results.statusText == "OK") {
															$rootScope.isSave.personalSave = true;
															toastr
																	.success(sharedConst.personalSuccess);
															$scope.addEditPersonalInfo
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

							// Validate Personal info document upload section
							$scope.validateForm = function(e) {
								$("#file").val("");
								var issueDate = $("#idIssueDate").data('date');
								var expiryDate = $("#idExpiryDate")
										.data('date');

								if ((!$scope.personalInfoModel.documentType
										|| !$scope.personalInfoModel.idType
										|| !$scope.personalInfoModel.idNo
										|| !$scope.personalInfoModel.idCountry
										|| issueDate == undefined || expiryDate == undefined)
										&& $scope.isW9DocType == false) {
									$scope.docTypeRequired = true;
									$scope.idTypeRequired = true;
									$scope.idNotRequired = true;
									$scope.countryofissueRequired = true;
									$scope.idIssueDateRequired = true;
									$scope.expiryDateRequired = true;
									e.preventDefault();
									toastr.error(sharedConst.requiredError);
								} else {
									var isdaterror = validateDate(issueDate,
											expiryDate);
									if (!isdaterror) {
										$scope.idIssueDateRequired = true;
										$scope.expiryDateRequired = true;
										e.preventDefault();
									} else {
										$scope.docTypeRequired = false;
										$scope.idTypeRequired = false;
										$scope.idNotRequired = false;
										$scope.countryofissueRequired = false;
										$scope.idIssueDateRequired = false;
										$scope.expiryDateRequired = false;
									}
								}
							}

							// Validate Personal tab selected document
							$scope.selectFile = function(file) {
								var isDuplicate = false;
								var fd = new FormData();
								var data = file[0];
								var ext = data.name.split('.').pop()
										.toLowerCase();
								if (!($.inArray(ext, [ 'pdf', 'png', 'jpeg',
										'jpg' ]) == -1)) {

									var isValidFileSize = validateFileSize(data);
									if (isValidFileSize == false)
										return false;
									$("#fileError").css("display", "none");
									$scope.isFileSelected = true;
									var docObject = {
										dtype : $scope.personalInfoModel.idType,
										documentType : $scope.personalInfoModel.documentType,
										idNo : $scope.personalInfoModel.idNo,
										country_issue : $scope.personalInfoModel.idCountry,
										idIssueDate : $filter('date')(
												new Date($("#idIssueDate")
														.data('date')),
												'yyyy-MM-dd'),
										idExpiryDate : $filter('date')(
												new Date($("#idExpiryDate")
														.data('date')),
												'yyyy-MM-dd'),
										originalName : data.name,
										newFileName : $scope.personalInfoModel.documentType
												+ "_"
												+ localStorageService
														.get('userName')
												+ "."
												+ data.name.split('.')[1]
									};
									angular
											.forEach(
													$scope.docArray,
													function(d, i) {
														if (d.dtype === $scope.personalInfoModel.idType
																|| d.documentType === $scope.personalInfoModel.documentType) {
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
																				uploadFile(
																						file,
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
										uploadFile(file, fd, data, docObject);
									}
								} else {
									toastr.error(sharedConst.fileTypeError);
								}
							};

							// Upload personal tab document
							function uploadFile(file, fd, data, docObject,
									currIndex) {
								var filePath = "";
								$scope.file = data.name;
								fd.append("file", data);
								fd.append("userName", localStorageService
										.get('userName'));
								fd.append("newFileName",
										$scope.personalInfoModel.documentType
												+ "_"
												+ localStorageService
														.get('userName') + "."
												+ data.name.split('.')[1]);
								homeService
										.uploadFile(fd)
										.then(
												function(results) {
													if (results.statusText == "OK") {
														$scope.documentPath = $("#file")[0].value;
														if (results.data.length > 0)
															docObject.file_path = results.data[0];

														if (currIndex != undefined)
															$scope.docArray[currIndex] = docObject;
														else
															$scope.docArray
																	.push(docObject);

														resetPersonalInfoUploadSection();
														$scope.personalInfoModel.documentType = "";
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
								return filePath;

							}

							function resetPersonalInfoUploadSection() {
								$scope.personalInfoModel.idType = "";
								$scope.personalInfoModel.idNo = "";
								$scope.personalInfoModel.idCountry = "";
								$scope.personalInfoModel.idCountryName = "";
								$scope.personalInfoModel.idIssueDate = "";
								$scope.personalInfoModel.idExpiryDate = "";
								$('#idIssueDate').data('DateTimePicker').date(
										'');
								$('#idExpiryDate').data('DateTimePicker').date(
										'');
								$('#idIssueDate').data('DateTimePicker').date(
										null);
								$('#idExpiryDate').data('DateTimePicker').date(
										null);
							}

							function validateFileSize(file) {
								var maxSize = 10485760; // in bytes
								if (file.size > maxSize) {
									toastr.error(sharedConst.fileSizeError);
									return false;
								} else
									return true;
							}

							// Get States by country
							function getState(country) {
								var statesbyCountry = $filter('filter')(
										$scope.listData.stateList, {
											countryid : parseInt(country.id)
										}, true);
								$scope.states = statesbyCountry;
							}

							$scope.personalNext = function() {
								if ($scope.addEditPersonalInfo.$dirty == false) {
									$('#Entity').css("display", "block");
									$('#Personal').css("display", "none")
									reset();
									pNext();
								} else {
									$('#modalDirty').modal('show');
								}
							};

							$scope.emailValidate = function(email, field) {
								if (email != "" && email != undefined) {
									var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
									var validEmail = pattern.test(email);
									if (validEmail) {
										if (field === "email") {
											$scope.addEditPersonalInfo.email
													.$setValidity(
															$scope.addEditPersonalInfo.email.$name,
															true);
											$scope.invalidEmail = false;
										} else if (field === "alternateEmail") {
											$scope.addEditPersonalInfo.alternateEmail
													.$setValidity(
															$scope.addEditPersonalInfo.alternateEmail.$name,
															true);
										} else if (field === "entityEmail") {
											$scope.addEditEntityInfo.email
													.$setValidity(
															$scope.addEditEntityInfo.email.$name,
															true);
											$scope.invalidEmail = false;
										}
									} else {
										if (field === "email") {
											$scope.addEditPersonalInfo.email
													.$setValidity(
															$scope.addEditPersonalInfo.email.$name,
															false);
											$scope.invalidEmail = true;
										} else if (field === "alternateEmail")
											$scope.addEditPersonalInfo.alternateEmail
													.$setValidity(
															$scope.addEditPersonalInfo.alternateEmail.$name,
															false);
										else if (field === "entityEmail") {
											$scope.addEditEntityInfo.email
													.$setValidity(
															$scope.addEditEntityInfo.email.$name,
															false);
											$scope.invalidEmail = true;
										}
									}
								} else {
									if (field === "email") {
										$scope.addEditPersonalInfo.email
												.$setValidity(
														$scope.addEditPersonalInfo.email.$name,
														true);
										$scope.invalidEmail = false;
									} else if (field === "alternateEmail")
										$scope.addEditPersonalInfo.alternateEmail
												.$setValidity(
														$scope.addEditPersonalInfo.alternateEmail.$name,
														true);
									else if (field === "entityEmail") {
										$scope.addEditEntityInfo.email
												.$setValidity(
														$scope.addEditEntityInfo.email.$name,
														true);
										$scope.invalidEmail = false;
									}
								}
							};

							$scope.resetPersonalInfo = function() {
								$scope.addEditPersonalInfo.$setPristine();
								$scope.personalInfoModel = {};
								$scope.docArray = [];
								$('#dateofBirth').data('DateTimePicker').date(
										'');
								$('#idIssueDate').data('DateTimePicker').date(
										'');
								$('#idExpiryDate').data('DateTimePicker').date(
										'');
								$('#dateofBirth').data('DateTimePicker').date(
										null);
								$('#idIssueDate').data('DateTimePicker').date(
										null);
								$('#idExpiryDate').data('DateTimePicker').date(
										null);
							};

							function reset() {
								window.scrollTo(0, 0);
								$scope.fileTypeError = false;
								$scope.emailCompare = false;
								$scope.serverError = false;
							}

							function validateDate(issueDate, expiryDate) {
								if (issueDate > expiryDate
										&& (issueDate != undefined && expiryDate != undefined)) {
									toastr.error(sharedConst.dateCompareError);
									return false;
								} else
									return true;
							}

							function pNext() {
								function sticky_relocate2() {
									var window_top = $(window).scrollTop();
									var div_top = ($('#sticky-anchor2')
											.offset() || {
										"top" : NaN
									}).top;

									if (window_top > div_top) {
										$('#sticky2').addClass('stick');

									} else {
										$('#sticky2').removeClass('stick');
									}
								}
								$(function() {
									$(window).scroll(sticky_relocate2);
									sticky_relocate2();
								});
							}

							$scope.checkDocType = function(type) {
								if (type === 'Personal W-9-Form') {
									$scope.isW9DocType = true;
									resetPersonalInfoUploadSection();
								} else {
									$scope.isW9DocType = false;
								}
							};

							function getInitialData(userName) {
								homeService
										.getCurrency()
										.then(
												function(results) {
													if (results.data != null) {
														$scope.listData.currencyList = results.data;
														sharedFactory
																.setCurrencyList(results.data);
													}
												}, function(error) {

												});

								$q
										.all(
												[
														(function() {
															var d = $q.defer();
															homeService
																	.getCountries()
																	.then(
																			function(
																					results) {
																				if (results.data != null) {
																					$scope.listData.countryList = results.data;
																					sharedFactory
																							.setCountryList(results.data);
																					d
																							.resolve(results);
																				}
																			},
																			function(
																					error) {

																			});
															return d.promise;
														})(),
														(function() {
															var d = $q.defer();
															homeService
																	.getStates()
																	.then(
																			function(
																					results) {
																				if (results.data != null) {
																					d
																							.resolve(results);
																					$scope.listData.stateList = results.data;
																					sharedFactory
																							.setStateList(results.data);
																					if (localStorageService
																							.get('isExistingUser') != "true") {
																						$scope
																								.$broadcast(
																										'initalizeEntity',
																										{
																											message : ''
																										});
																						$scope
																								.$broadcast(
																										'initalizeAccount',
																										{
																											message : ''
																										});
																					}
																				}
																			},
																			function(
																					error) {

																			});
															return d.promise;
														})(),
														(function() {
															var d = $q.defer();
															if (localStorageService
																	.get('isExistingUser') === "true") {
																$scope.isCountryOfCitizenshipSelected = true;
																$scope.isContactCountrySelected = true;
																$scope.isCountryOfIssueSelected = true;
																$scope.isContactStateSelected = true;
																homeService
																		.getUserDetails(
																				userName)
																		.then(
																				function(
																						results) {
																					if (results.data != null
																							&& results.data != "") {
																						d
																								.resolve(results);
																						if (results.data.PersonalInfo != undefined) {
																							$scope.personalInfoModel = results.data.PersonalInfo;
																							$rootScope.isSave.personalSave = true;
																							setCountryNames($scope.personalInfoModel);
																						}
																						sharedFactory
																								.setUserDetails(results.data);
																						$scope.personalInfoModel.contact_information.dob = $filter(
																								'date')
																								(
																										new Date(
																												$scope.personalInfoModel.contact_information.dob),
																										'MM/dd/yyyy');
																						$(
																								'#dateofBirth')
																								.data(
																										'DateTimePicker')
																								.date(
																										$scope.personalInfoModel.contact_information.dob);
																						if (results.data.PersonalInfo != undefined) {
																							if (results.data.PersonalInfo.documentUploadDetail.length > 0) {
																								$scope.docArray = results.data.PersonalInfo.documentUploadDetail;
																								$scope.isFileSelected = true;
																							}
																						}
																						$scope
																								.$broadcast(
																										'initalizeEntity',
																										{
																											message : ''
																										});
																						$scope
																								.$broadcast(
																										'initalizeAccount',
																										{
																											message : ''
																										});
																					}
																				},
																				function(
																						error) {

																				});
															}
															return d.promise;
														})() ]).then(
												function(responses) {
													console.log(responses); // array
													// of
													// your
													// responses
												});

							}
							function setCountryNames(personalInfoModel) {
								var country = $filter('filter')
										(
												$scope.listData.countryList,
												{
													code : personalInfoModel.contact_address.countryName
												}, true)[0];
								$scope.personalInfoModel.contact_address.contactCountryName = country.name;
								if (country != undefined) {
									getState(country);
								}
								var countryOfCitizenship = $filter('filter')
										(
												$scope.listData.countryList,
												{
													code : personalInfoModel.contact_information.country_of_Citizenship
												}, true)[0];
								if (countryOfCitizenship != undefined) {
									$scope.personalInfoModel.contact_information.country_of_CitizenshipName = countryOfCitizenship.name;
								}
								var countryOfIssue = $filter('filter')
										(
												$scope.listData.countryList,
												{
													code : personalInfoModel.contact_information.idCountry
												}, true)[0];
								if (countryOfIssue != undefined) {
									$scope.personalInfoModel.contact_information.idCountryName = countryOfIssue.name;
								}
							}
							// Autocomplete Section
							$scope.autocomplete_countryOfCitizenship = {
								suggest : suggest_suggestCountryOfCitizenshipNames,
								on_select : function(selected) {
									setSelectedName(1, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isCountryOfCitizenshipSelected == false
											&& current_value != "") {
										$scope.countryOfCitizenshipNotFound = true;
										$scope.addEditPersonalInfo.citizenshipCountry
												.$setValidity("invalid", false);
									} else {
										$scope.countryOfCitizenshipNotFound = false;
										$scope.addEditPersonalInfo.citizenshipCountry
												.$setValidity("invalid", true);
									}
								}
							};
							$scope.autocomplete_contactCountries = {
								suggest : suggest_suggestContactCountryNames,
								on_select : function(selected) {
									setSelectedName(2, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isContactCountrySelected == false
											&& current_value != "") {
										$scope.contactCountryNotFound = true;
										$scope.personalInfoModel.contact_address.state = "";
										$scope.states = [];
										$scope.addEditPersonalInfo.country
												.$setValidity("invalid", false);
									} else {
										$scope.contactCountryNotFound = false;
										$scope.addEditPersonalInfo.country
												.$setValidity("invalid", true);
									}
								}
							};

							$scope.autocomplete_countryOfIssue = {
								suggest : suggest_suggestCountryOfIssueNames,
								on_select : function(selected) {
									setSelectedName(3, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isCountryOfIssueSelected == false
											&& current_value != "")
										$scope.countryOfIssueNotFound = true;
									else
										$scope.countryOfIssueNotFound = false;

								}
							};

							function suggest_suggestCountryOfCitizenshipNames(
									term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.countryOfCitizenshipNotFound = false;
									$scope.isCountryOfCitizenshipSelected = false;
								} else {
									$scope.countryOfCitizenshipNotFound = true;
									$scope.isCountryOfCitizenshipSelected = false;
								}

								return results;
							}

							function suggest_suggestContactCountryNames(term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.contactCountryNotFound = false;
									$scope.isContactCountrySelected = false;
								} else {
									$scope.contactCountryNotFound = true;
									$scope.isContactCountrySelected = false;
								}

								return results;
							}

							function suggest_suggestCountryOfIssueNames(term) {
								var results = [];
								results = getCountries(term);
								if (results.length > 0) {
									$scope.countryOfIssueNotFound = false;
									$scope.isCountryOfIssueSelected = false;
								} else {
									$scope.countryOfIssueNotFound = true;
									$scope.isCountryOfIssueSelected = false;
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
									setSelectedName(4, selected.obj);
								},
								on_detach : function(current_value) {
									if ($scope.isContactStateSelected == false
											&& current_value) {
										$scope.contactStateNotFound = true;
										$scope.addEditPersonalInfo.state
												.$setValidity("invalid", false);
									} else {
										$scope.contactStateNotFound = false;
										$scope.addEditPersonalInfo.state
												.$setValidity("invalid", true);
									}
								}
							};

							function suggest_suggestStateNames(term) {
								var results = [];
								results = getStates(term, $scope.states);
								if (results.length > 0) {
									$scope.contactStateNotFound = false;
									$scope.isContactStateSelected = false;
								} else {
									$scope.contactStateNotFound = true;
									$scope.isContactStateSelected = false;
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
									$scope.personalInfoModel.contact_information.country_of_Citizenship = selectedObject.code;
									$scope.personalInfoModel.contact_information.country_of_CitizenshipName = selectedObject.name;
									$scope.isCountryOfCitizenshipSelected = true;
								} else if (type == 2) {
									$scope.personalInfoModel.contact_address.countryName = selectedObject.code;
									$scope.personalInfoModel.contact_address.contactCountryName = selectedObject.name;
									$scope.personalInfoModel.contact_address.state = "";
									$scope.isContactCountrySelected = true;
									getState(selectedObject);
								} else if (type == 3) {
									$scope.personalInfoModel.idCountry = selectedObject.code;
									$scope.personalInfoModel.idCountryName = selectedObject.name;
									$scope.isCountryOfIssueSelected = true;
								} else if (type == 4) {
									$scope.personalInfoModel.contact_address.state = selectedObject.name;
									$scope.isContactStateSelected = true;
								}
							}

							init();

							$('this.active')

							var acc = document
									.getElementsByClassName("accordion");
							var i;

							for (i = 0; i < acc.length; i++) {
								acc[i].onclick = function() {
									this.classList.toggle("active");
									this.nextElementSibling.classList
											.toggle("show");
								}
							}
							$scope.isMouseIn = false;
							$scope.showTooltip = function() {
								$scope.isMouseIn = true;
							};
						} ]);
