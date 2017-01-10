package com.noblemktkyc.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.noblemktkyc.service.KycFetchService;

/**
 * @author Silicus Technologies, 2016
 * 
 *         KycFetchController :: Spring MVC Controller for rest services to
 *         fetch KYC information
 * 
 */
@RestController
public class KycFetchController {
	final static Logger logger = Logger.getLogger(KycFetchController.class);
	
	private String path;
	@Autowired
	private KycFetchService kycFetchService;
	@Autowired
	private CommonController commonController;
	@Autowired
	Environment env;

	/**
	 * To fetch KYC details of the user from JSON files
	 * 
	 * @param userName
	 * @param httpServletRequest
	 * 
	 * @return
	 */
	@RequestMapping(value = "/fetchKycDetail", method = RequestMethod.GET)
	public ResponseEntity<Map<String, Object>> fetchKycDetail(@RequestParam String userName,
			HttpServletRequest httpServletRequest) {
		logger.info("Inside KycFetchController::fetchKycDetail method::fetching data of kyc user::");
		Map<String, Object> kycDetail = null;
		try {
			path = commonController.getDocumentPath();
			ArrayList<String> infoType = new ArrayList<String>(Arrays.asList(env.getProperty("PersonalInfo"),
					env.getProperty("EntityInfo"), env.getProperty("AccountInfo")));
			kycDetail = kycFetchService.readFileInObject(path, userName, infoType,
					env.getProperty("kycStatusForInProgress"));
			if (kycDetail == null) {
				logger.info("KycFetchController::fetchKycDetail method::information of user is not present");
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in KycFetchController::fetchKycDetail method::fetching fail : exception is ::", e);
			return new ResponseEntity<Map<String, Object>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Map<String, Object>>(kycDetail, HttpStatus.OK);
	}

}