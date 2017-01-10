package com.noblemktkyc.fileoperation;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.User;
import com.noblemktkyc.service.box.api.BoxApiService;

/**
 * 
 * @author Silicus Technologies, 2016
 * 
 *         FileOperationImp :: Create the Personal, Entity and Account Info
 *         files and save to disk Save the uploaded files to disk
 *
 */
@Component
public class FileOperationImp implements Serializable, FileOperation {

	private static final long serialVersionUID = 1L;
	final static Logger logger = Logger.getLogger(FileOperationImp.class);

	@Autowired
	BoxApiService boxService;

	/**
	 * Method to save the Json object to the txt file
	 * 
	 * @param modelInfo
	 * @param infoType
	 * @throws Exception
	 */
	public void saveKycInfo(Model modelInfo, User userInfo) throws Exception {
		logger.info("Inside FileOperationImp :: saveKycInfo Method");
		File modelDataFile = null;
		BufferedOutputStream stream = null;
		String folderName = userInfo.getUserName() + userInfo.getStatus();
		String fileName = modelInfo.getType() + "_" + userInfo.getUserName() + ".txt";
		try {
			if (modelInfo != null && userInfo.getUserName() != null && modelInfo.getType() != null) {
				boolean success = (new File(userInfo.getDirectoryPath() + "\\" + folderName)).mkdirs();
				if (success)
					logger.info("  FileOperation::directory is created" + userInfo.getDirectoryPath() + "\\"
							+ userInfo.getUserName());

				modelDataFile = new File(userInfo.getDirectoryPath() + "\\" + folderName + "\\" + fileName);
				if (!modelDataFile.exists()) {
					modelDataFile.createNewFile();
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error("Exception in FileOperationImp :: saveKycInfo Method :: exception is", e);
			throw e;
		}
		try {
			stream = new BufferedOutputStream(new FileOutputStream(modelDataFile));
			ObjectMapper mapper = new ObjectMapper();
			stream.write(mapper.writeValueAsString(modelInfo).getBytes());
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error("Exception in FileOperationImp :: saveKycInfo Method :: exception is", e);
			throw e;
		} finally {
			if (stream != null) {
				stream.close();
			}
		}

		// Upload the above file to Box
		boxService.uploadFileToBox(fileName, modelDataFile, userInfo.getBoxFolder());

	}

	/**
	 * Method to save the uploaded file to disk
	 * 
	 * @param file
	 * @param fileName
	 * @param userInfo
	 * @return
	 * @throws Exception
	 */
	public String saveUploadedFileToDisk(MultipartFile file, String fileName, User userInfo) throws Exception {
		logger.info("Inside FileOperationImp :: saveUploadedFileToDisk Method");
		File convFile;
		String folderName = userInfo.getUserName() + userInfo.getStatus();
		FileOutputStream fos = null;
		boolean success = (new File(userInfo.getDirectoryPath() + "\\" + folderName)).mkdirs();
		if (success) {
			logger.info("Inside FileOperationImp :: saveUploadedFileToDisk Method :: directory creation successful");
		}
		try {
			convFile = new File(userInfo.getDirectoryPath() + "\\" + folderName + "\\" + fileName);
			fos = new FileOutputStream(convFile);
			fos.write(file.getBytes());
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in FileOperationImp :: saveUploadedFileToDisk Method :: Exception is", e);
			throw e;
		} finally {
			if (fos != null) {
				fos.close();
			}
		}

		// Upload the above file to Box
		return boxService.uploadFileToBox(fileName, convFile, userInfo.getBoxFolder());

	}

	/**
	 * Method to rename folder from "username_inprogress" to "username_complete"
	 * after submission of KYC forms
	 * 
	 * @param userInfo
	 * @param finalStatus
	 * @return
	 * @throws Exception
	 */
	public void renameDirectory(User userInfo, String finalStatus) throws Exception {
		logger.info("Inside FileOperationImp :: renameDirectory Method");
		try {
			String oldName = userInfo.getUserName() + userInfo.getStatus();
			String newName = userInfo.getUserName() + finalStatus;
			File inprogressFile = new File(userInfo.getDirectoryPath() + "\\" + oldName);
			// rename existing directory after submission of kyc information
			File completedFile = new File(userInfo.getDirectoryPath() + "\\" + newName);
			if (!completedFile.exists()) {
				boolean srcSucess = inprogressFile.renameTo(completedFile);
				if (srcSucess) {
					logger.info("Inside FileOperationImp :: renameDirectory Method:: Folder renamed successfully");
				}
			} else {
				logger.info(
						"Inside FileOperationImp :: renameDirectory Method :: Completed folder already exists hence Cannot be rename");
			}

			boxService.reNameFolder(oldName, newName);

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in FileOperationImp :: renameDirectory Method:: Exception is", e);
			throw e;
		}

	}

	/**
	 * Method to read text file and convert it to object
	 * 
	 * @param path
	 * @param userName
	 * @param listInfoType
	 * @param finalStatus
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> readFileInObject(String path, String userName, List<String> listInfoType,
			String finalStatus) throws Exception {
		logger.info("Inside FileOperationImp :: readFileInObject Method");
		try {
			boxService.downloadFolderFromBox(userName + finalStatus, listInfoType, path, userName);
			Map<String, Object> kycDetail = null;
			ObjectMapper objectMapper = new ObjectMapper();
			for (String infoType : listInfoType) {
				File file = new File(path + "\\" + userName + finalStatus + "\\" + infoType + "_" + userName + ".txt");
				logger.info("File path is : " + file.getPath());
				if (file.exists()) {
					if (kycDetail == null) {
						kycDetail = new HashMap<>();
					}
					kycDetail.put(infoType, objectMapper.readValue(file, Model.class));
				}
			}
			return kycDetail;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in FileOperationImp :: readFileInObject Method :: Exception is", e);
			throw e;
		}

	}

}
