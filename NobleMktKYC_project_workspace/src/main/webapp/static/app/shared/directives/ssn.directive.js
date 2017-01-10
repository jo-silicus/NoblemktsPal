app.directive('ssn', function() {

	function isEmpty(value) {
		return angular.isUndefined(value) || value === null;
	}

	String.prototype.replaceAt = function(index, character) {
		return this.substr(0, index) + character
				+ this.substr(index + character.length);
	}

	var REGEXP_FORMAT = /[^0-9*]+/g;

	return {
		restrict : "A",
		require : "ngModel",
		link : link,
		scope : {

		}
	};

	function link(scope, element, attributes, ngModelCtrl) {

		ngModelCtrl.$setValidity('incompletessn', true);
		scope.finalSSN = '*********';

		ngModelCtrl.$parsers.push(function setModelValue(value) {
			if (!isEmpty(value)) {
				var number = value.replace(REGEXP_FORMAT, '');
				number = number.substring(0, 9);
				scope.finalSSN = formatSSN(number, scope.finalSSN);
				var transformedInput = maskSSN(number);//$filter('socialSecurityNumber')(number);

				if (transformedInput != value) {
					ngModelCtrl.$setViewValue(transformedInput);
					ngModelCtrl.$render();
				}
				scope.tempSSN = scope.finalSSN;
				scope.tempSSN = scope.tempSSN.replace(/\*/g, '')
				doValidations(scope.tempSSN);
				return scope.tempSSN;
			}
		});

		// Needed for initial formatting i.e when initial data is passed via scope of controller invoking this directive.
		ngModelCtrl.$formatters
				.push(function formatSocialSecurityNumber(value) {
					if (!isEmpty(value)) {
						var number = value.replace(REGEXP_FORMAT, '');
						scope.finalSSN = formatSSN(number, scope.finalSSN);
						scope.tempSSN = number
						return maskSSN(number);//$filter('socialSecurityNumber')(number);
					}
				});

		function doValidations(value) {
			if (angular.isDefined(value)) {
				var number = value.toString();
				var ssnComplete = isSSNComplete(number);
				ngModelCtrl.$setValidity('incompletessn', ssnComplete);
				if (ssnComplete) {
					var ssnInValid = isSSNValid(number);
					ngModelCtrl.$setValidity("invalidssn", ssnInValid);
				}
			}
		}
	}
	function isSSNComplete(ssnStr) {
		var isValidssn = ssnStr.toString().length === 9
				|| ssnStr.toString().length === 0;
		return isValidssn;
	}

	function isSSNValid(ssnStr) {
		var ssnStart = ssnStr.substring(0, 3);
		var ssnMid = ssnStr.substring(3, 5);
		var ssnlast = ssnStr.substring(5, 9);
		if (ssnStart === '000' || ssnStart === '666'
				|| (ssnStart >= '900' && ssnStart <= '999') || ssnMid === '00'
				|| ssnlast === '0000') {
			return false;
		} else {
			return true;
		}
	}

	function formatSSN(number, finalSSN) {
		for (var i = 0; i < finalSSN.length; i++) {
			if (i >= number.length)
				finalSSN = finalSSN.replaceAt(i, '*');
			else if (number[i] !== "*")
				finalSSN = finalSSN.replaceAt(i, number[i]);
		}
		return finalSSN;
	}

	function maskSSN(ssn) {
		ssn = String(ssn);
		// Will return formattedSSN.
		var formattedSSN = ssn;

		// ###-##-#### as formattedSSN.
		var suffix = ssn.substring(0, 3);
		var prefix = ssn.substring(3, 5);
		var end = ssn.substring(5, 9);

		if (prefix) {
			formattedSSN = ("***-" + prefix);
		}
		if (end) {
			formattedSSN = ("***-**-" + end);
		}
		return formattedSSN;
	}
});
