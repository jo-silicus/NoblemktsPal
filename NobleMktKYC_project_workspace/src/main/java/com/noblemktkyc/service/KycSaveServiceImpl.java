package com.noblemktkyc.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.noblemktkyc.controller.KycSaveController;
import com.noblemktkyc.fileoperation.FileOperationImp;
import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.User;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         Service for KYC Save functionality
 * 
 */
@Service("KycSaveService")
@Transactional
public class KycSaveServiceImpl implements KycSaveService {
	final static Logger logger = Logger.getLogger(KycSaveController.class);

	@Autowired
	FileOperationImp fileOperation;

	/**
	 * save the kyc details as a JSON object to a text file
	 * 
	 * @param modelInfo
	 * @param userInfo
	 * 
	 * @return void
	 */
	@Override
	public void saveKycInfo(Model modelInfo, User userInfo) throws Exception {
		logger.info("Inside KycSaveServiceImpl :: saveObject Method");
		fileOperation.saveKycInfo(modelInfo, userInfo);
	}

	/**
	 * save uploaded files
	 * 
	 * @param file
	 * @param fileName
	 * @param userInfo
	 * 
	 * @return string
	 */
	@Override
	public String saveUploadedFileToDisk(MultipartFile file, String fileName, User userInfo) throws Exception {
		logger.info("Inside KycSaveServiceImpl :: saveUploadedFileToDisk Method");
		return fileOperation.saveUploadedFileToDisk(file, fileName, userInfo);
	}

	/**
	 * rename the user info directory on submission of the kyc details
	 * 
	 * @param userInfo
	 * @param finalStatus
	 * 
	 * @return void
	 */
	@Override
	public void renameDirectory(User userInfo, String finalStatus) throws Exception {
		logger.info("Inside KycSaveServiceImpl :: renameDirectory Method");
		fileOperation.renameDirectory(userInfo, finalStatus);
	}

}
