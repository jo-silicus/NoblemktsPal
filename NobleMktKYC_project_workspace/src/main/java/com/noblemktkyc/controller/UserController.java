package com.noblemktkyc.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.noblemktkyc.model.User;
import com.noblemktkyc.service.UserService;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         UserController :: Spring MVC Controller for rest service to create
 *         user.
 */

@RestController
public class UserController {

	@Autowired
	CommonController commonController;

	@Autowired
	UserService userService;

	@Value("${kycStatusForInProgress}")
	String status;

	final static Logger logger = Logger.getLogger(UserController.class);

	
	/**
	 * To create userInfo object for logged in user.
	 * 
	 * @param userName
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/createUser", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<String> createUser(@RequestParam String userName, HttpServletRequest request) {
		logger.info("inside UserController :: createUser Method");
		User user = new User();
		user.setUserName(userName);
		user.setDirectoryPath(commonController.getDocumentPath());
		user.setStatus(status);
		try {
			HttpSession session = request.getSession(true);
			session.setAttribute("userInfo", user);
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in UserController :: createUser method:: Exception is ::", e);
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<String>(HttpStatus.OK);
	} 

}