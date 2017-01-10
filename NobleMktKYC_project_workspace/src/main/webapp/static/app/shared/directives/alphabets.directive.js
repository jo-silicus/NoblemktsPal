﻿app.directive('alphabets', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attr, ngModelCtrl) {
			function fromUser(text) {
				var transformedInput = text.replace(/[^a-zA-Z\s.'`,]+/g, '');
				if (transformedInput !== text) {
					ngModelCtrl.$setViewValue(transformedInput);
					ngModelCtrl.$render();
				}
				return transformedInput;
			}
			ngModelCtrl.$parsers.push(fromUser);
		}
	}
});