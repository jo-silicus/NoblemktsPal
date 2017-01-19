package com.noblemktkyc.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.box.sdk.BoxFolder;
import com.noblemktkyc.service.box.api.BoxApiService;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         Service for to acess box folder functionality
 * 
 */
@Service
@Component
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	BoxApiService boxApiService;

	final static Logger logger = Logger.getLogger(UserServiceImpl.class);

	/**
	 * to get box folder of existing user or create box folder for new user
	 * 
	 * @param folderName
	 * 
	 * @return BoxFolder
	 */
	@Override
	public BoxFolder getUserBoxFolder(String folderName) throws Exception {
		logger.error("Inside UserServiceImpl :: getUserBoxFolder method");
		
		try {
		
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in UserServiceImpl :: getUserBoxFolder method:: Exception is ", e);
			throw e;
		} 
		return null;
	}

}
