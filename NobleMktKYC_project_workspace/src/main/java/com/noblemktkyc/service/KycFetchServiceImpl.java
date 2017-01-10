package com.noblemktkyc.service;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noblemktkyc.fileoperation.FileOperationImp;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         Service for fetching KYC information
 * 
 */
@Service("KycFetchService")
@Transactional
public class KycFetchServiceImpl implements KycFetchService {
	final static Logger logger = Logger.getLogger(KycFetchServiceImpl.class);
	@Autowired
	FileOperationImp fileOperation;

	/**
	 * Fetch KYC information from JSON file
	 * 
	 * @param path
	 * @param userName
	 * @param infoType
	 * @param finalStatus
	 * 
	 * @return
	 */
	@Override
	public Map<String, Object> readFileInObject(String path, String userName, List<String> infoType, String finalStatus)
			throws Exception {
		logger.info("Inside KycFetchServiceImpl :: readFileInObject Method");
		return fileOperation.readFileInObject(path, userName, infoType, finalStatus);
	}
}
