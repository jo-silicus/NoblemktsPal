app.directive('alphaNumeric',
		function() {
			return {
				require : 'ngModel',
				link : function(scope, element, attr, ngModelCtrl) {
					function fromUser(text) {
						var transformedInput = text.replace(
								/[^a-zA-Z0-9\s.'`,]+/g, '');
						if (transformedInput !== text) {
							ngModelCtrl.$setViewValue(transformedInput);
							ngModelCtrl.$render();
						}
						return transformedInput; // or return Alphanumeric(transformedInput)
					}
					ngModelCtrl.$parsers.push(fromUser);
				}
			};
		});