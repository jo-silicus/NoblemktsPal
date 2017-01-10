package com.noblemktkyc.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.noblemktkyc.service.Decryptor;

/**
 * @author Silicus Technologies, 2016
 * 
 *         DecryptionController :: Spring MVC Controller for rest service to
 *         decrypt url
 * 
 */
@RestController
public class DecryptionController {
	final static Logger logger = Logger.getLogger(DecryptionController.class);

	@Autowired
	private Decryptor decryptorService;

	/**
	 * To decrypt email id of user from URL. The email id will be used to fetch
	 * KYC information from JSONs.
	 * 
	 * @param httpServletRequest
	 * @return
	 */
	@RequestMapping(value = "/decryptUrl", method = RequestMethod.GET)
	public ResponseEntity<List<String>> decryptUrl(HttpServletRequest httpServletRequest) {
		logger.info("Inside DecryptionController :: decryptUrl Method");
		List<String> decryptedString;
		try {
			decryptedString = new ArrayList<>();
			logger.info("DecryptionController::decryptUrl method::decryptUrl url");
			String[] strRequestParams = httpServletRequest.getQueryString().split("&");
			logger.debug("value:::e=" + strRequestParams[0] + " h=" + strRequestParams[1]);
			decryptedString.add((String) decryptorService.decryptObject(strRequestParams[0], strRequestParams[1]));
			logger.debug(decryptedString);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
			logger.error("Exception in DecryptionController:: decryptUrl method :: exception is ::", ex);
			return new ResponseEntity<List<String>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<String>>(decryptedString, HttpStatus.OK);
	}

}