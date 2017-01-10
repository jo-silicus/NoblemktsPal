app.filter('socialSecurityNumber', function() {

	/*
	Format ssn as: xxx-xx-xxxx or as close as possible if ssn length is not 9
	 */
	return [ function() {

		return function(ssn) {
			/*
			@param {Number | String} number - Number that will be formatted as telephone number
			Returns formatted number: ###-##-####
			   if number.length < 3: ###
			   else if number.length < 6: ##-###
			 */
			if (!ssn) {
				return '';
			}

			ssn = String(ssn);

			// Will return formattedSSN.

			var formattedSSN = ssn;

			// ###-##-#### as formattedSSN.
			var suffix = ssn.substring(0, 3);
			var prefix = ssn.substring(3, 5);
			var end = ssn.substring(5, 9);

			if (prefix) {
				formattedSSN = (suffix + "_");
			}
			if (end) {
				formattedSSN = (prefix + "-" + end);
			}

			return formattedSSN;
		}
	} ];

});