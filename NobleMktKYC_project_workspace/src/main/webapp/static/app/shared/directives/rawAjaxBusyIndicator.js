app.directive('rawAjaxBusyIndicator', function() {
	return {
		link : function(scope, element) {
			scope.$on("ajax-start", function(arg) {
				if (arg.currentScope.parentIndexCtrl.showLoadingIndicator) {
					element[0].hidden = false;
				}
				arg.currentScope.parentIndexCtrl.showLoadingIndicator = true;
			});
			scope.$on("ajax-stop", function(arg) {
				element[0].hidden = true;
			});
		}
	}
});
