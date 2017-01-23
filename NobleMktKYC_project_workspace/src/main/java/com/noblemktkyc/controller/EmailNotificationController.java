package com.noblemktkyc.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.noblemktkyc.service.EmailNotification;

/**
 * @author Silicus Technologies, 2016
 * 
 *         EmailNotificationController :: Spring MVC Controller for rest
 *         services to send email notifications
 * 
 */
@RestController
public class EmailNotificationController {
	static	final  Logger logger = Logger.getLogger(EmailNotificationController.class);

	@Autowired
	EmailNotification emailService;
	@Value("${emailSource}")
	private String emailSource;
	@Value("${emailSubject}")
	private String emailSubject;
	
	
	public EmailNotificationController() {
		//Constructor 
	}

	/**
	 * To send a KYC process completion confirmation to the registered user
	 * email id
	 * 
	 * @param email
	 * 
	 * @return
	 */
	@RequestMapping(value = "/sendMail", method = RequestMethod.POST)
	public ResponseEntity<List<String>> sendKycCompletionEmail(@RequestParam String email) {
		logger.info("Inside EmailNotificationController:: sendKycCompletionEmail method ::sending mail");
		try {
			emailService.sendKycCompletionEmail(email, emailSource, emailSubject);
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in EmailNotificationController::sendKycCompletionEmail method:: Exception is ::",
					e);
			return new ResponseEntity<List<String>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<String>>(HttpStatus.OK);
	}

}