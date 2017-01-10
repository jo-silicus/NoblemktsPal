app.factory('sharedFactory', function() {
	var sharedFactory = {};
	return {
		getCurrencList : function() {
			return sharedFactory.currencyList;
		},
		setCurrencyList : function(currencyList) {
			sharedFactory.currencyList = currencyList;
		},
		getCountryList : function() {
			return sharedFactory.countryList;
		},
		setCountryList : function(countryList) {
			sharedFactory.countryList = countryList;
		},
		getStateList : function() {
			return sharedFactory.stateList;
		},
		setStateList : function(stateList) {
			sharedFactory.stateList = stateList;
		},
		getUserDetails : function() {
			return sharedFactory.userDetails;
		},
		setUserDetails : function(userDetails) {
			sharedFactory.userDetails = userDetails;
		}
	}
});