app
		.directive(
				'emailValidate',
				function() {
					return {
						require : 'ngModel',
						link : function(scope, element, attrs, modelCtrl) {

							element.bind("blur", function(event) {
								if (event.which === 32) {
									event.preventDefault();
								}
							});

							modelCtrl.$parsers
									.push(function(inputValue) {
										if (inputValue == undefined)
											return ''
										if (inputValue == null
												|| inputValue == "") {
											if (modelCtrl.$error.invalidEmail)
												delete modelCtrl.$error.invalidEmail;
											if (modelCtrl.$error.email)
												delete modelCtrl.$error.email;
											if (modelCtrl.$$parentForm.$error.invalidEmail)
												delete modelCtrl.$$parentForm.$error.invalidEmail;
											modelCtrl.$render();
											return ''
										}
										var transformedInput = inputValue
												.replace(' ', '');

										var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

										var validEmail = pattern
												.test(transformedInput);

										modelCtrl.$setValidity('invalidEmail',
												validEmail);

										modelCtrl
												.$setViewValue(transformedInput);
										modelCtrl.$render();

										return transformedInput;
									});
						}
					};
				});