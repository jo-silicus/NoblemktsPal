package com.noblemktkyc.service.box.api;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.NoSuchFileException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.box.sdk.BoxAPIConnection;
import com.box.sdk.BoxAPIException;
import com.box.sdk.BoxFile;
import com.box.sdk.BoxFolder;
import com.box.sdk.BoxItem;
import com.box.sdk.BoxItem.Info;
import com.box.sdk.BoxSharedLink;
import com.box.sdk.FileUploadParams;
//import com.noblemarkets.storage.box.NobleBoxClient;
//import com.noblemarkets.storage.box.NobleBoxConnectionSpecification;

/**
 * @author : Silicus Technologies, 2016
 * 
 */

@Component
public class BoxApiServiceImpl implements BoxApiService {

	BoxAPIConnection apiConn = null;

	final static Logger logger = Logger.getLogger(BoxApiServiceImpl.class);

	private void setBoxAPIConnection() throws Exception {
		logger.info("Inside BoxApiServiceImpl::setBoxAPIConnection Method");
		try {
			
			BoxAPIConnection intakeConnSpec=new BoxAPIConnection("kycintake");
			logger.info("BoxApiServiceImpl::setBoxAPIConnection Method::before creating connection::");
			if (intakeConnSpec != null) {
				
				this.apiConn = intakeConnSpec;
				logger.info("BoxApiServiceImpl::setBoxAPIConnection Method::after creating connection::");
			}
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxAPIException in BoxApiServiceImpl::setBoxAPIConnection Method::exception is" + e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl::setBoxAPIConnection Method::exception is" + e);
			throw e;
		}
	}

	/**
	 * Create a folder on BOX
	 * 
	 * @param folderName
	 * 
	 * @return BoxFolder
	 * @throws Exception
	 */
	@Override
	public BoxFolder createFolder(String folderName) throws Exception {
		logger.info("Inside BoxApiServiceImpl::createFolder Method");
		try {
			BoxFolder rootFolder = BoxFolder.getRootFolder(apiConn);
			Info userInfo = rootFolder.createFolder(folderName);
			return (BoxFolder) userInfo.getResource();
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxAPIException in BoxApiServiceImpl:: createFolder method :: exception is" + e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl:: createFolder method :: exception is" + e);
			throw e;
		}

	}

	/**
	 * Fetch a folder from BOX
	 * 
	 * @param folderName
	 * 
	 * @return BoxFolder
	 * @throws Exception
	 */
	@Override
	public BoxFolder getBoxFolder(String folderName) throws Exception {
		logger.info("Inside BoxApiServiceImpl::getBoxFolder Method");
		try {
			setBoxAPIConnection();
			BoxFolder userfolder = null;
			BoxFolder rootFolder = BoxFolder.getRootFolder(apiConn);

			for (BoxItem.Info info : rootFolder) {
				logger.info("Inside BoxApiServiceImpl::getBoxFolder Method :: File/folder name is " + info.getName());
				if (folderName.equals(info.getName())) {
					logger.info("Inside BoxApiServiceImpl::getBoxFolder Method :: User Folder found " + info.getName());
					userfolder = (BoxFolder) info.getResource();
					break;
				}
			}
			if (userfolder == null) {
				userfolder = createFolder(folderName);
			}
			return userfolder;
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxApiException in BoxApiServiceImpl:: getBoxFolder method :: exception is" + e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl:: getBoxFolder method :: exception is" + e);
			throw e;
		}

	}

	/**
	 * Prepare the folder structure and upload files to BOX
	 * 
	 * @param fileName
	 * @param file
	 * @param BoxFolder
	 * 
	 * @return string
	 */
	public String uploadFileToBox(String fileName, File file, BoxFolder boxFolder) throws Exception {
		logger.info("Inside BoxApiServiceImpl::uploadFileToBox Method");
		try {
			logger.info("Inside BoxApiServiceImpl::uploadFileToBox Method :: Before uploading file " + fileName);
			FileUploadParams fileParams = new FileUploadParams();
			fileParams.setContent(new FileInputStream(file));
			fileParams.setName(fileName);
			fileParams.setCreated(new Date());
			fileParams.setModified(new Date());

			Iterable<Info> folderChildrens = boxFolder.getChildren();
			if (folderChildrens != null) {
				for (Info info : folderChildrens) {
					if (fileName.equals(info.getName())) {
						logger.info(
								"Inside BoxApiServiceImpl::uploadFileToBox Method :: File exists and needs to be deleted");
						BoxFile oldFile = (BoxFile) info.getResource();
						oldFile.delete();
						break;
					}
				}
			}
			Info uploadedFileInfo = boxFolder.uploadFile(fileParams);
			BoxFile uploadedFile = (BoxFile) uploadedFileInfo.getResource();
			BoxSharedLink boxSharedLink = uploadedFile.createSharedLink(BoxSharedLink.Access.DEFAULT, null, null);
			return boxSharedLink.getDownloadURL();
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxApiException in BoxApiServiceImpl:: uploadFileToBox method :: exception is" + e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl::uploadFileToBox method:: Exception is ::", e);
			throw e;
		}
	}

	/**
	 * Download user's folder from BOX to the path set in the
	 * application.properties file
	 * 
	 * @param folderName
	 * @param listInfoType
	 * @param destinationDirectoryPath
	 * @param userName
	 * 
	 * @return void
	 * @throws IOException
	 */
	@Override
	public void downloadFolderFromBox(String folderName, List<String> listInfoType, String destinationDirectoryPath,
			String userName) throws Exception {
		logger.info("Inside BoxApiServiceImpl::downloadFolderFromBox Method");
		BoxFile file = null;
		File destinationFile = null;
		FileOutputStream stream = null;
		try {
			new File(destinationDirectoryPath + "\\" + folderName).mkdirs();
			BoxFolder userFolder = getBoxFolder(folderName);
			for (Info info : userFolder) {
				for (String infoType : listInfoType) {
					if (info.getName().contains(infoType)) {
						file = (BoxFile) info.getResource();

						destinationFile = new File(
								destinationDirectoryPath + "\\" + folderName + "\\" + info.getName());

						stream = new FileOutputStream(destinationFile);
						file.download(stream);
						logger.info("file" + infoType + userName + "is created");
						stream.close();
						break;
					}
				}
			}
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxAPIException in BoxApiServiceImpl::downloadFolderFromBox Method :: Exception is ::", e);
			throw e;
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("FileNotFoundException in BoxApiServiceImpl::downloadFolderFromBox Method :: Exception is ::",
					e);
			throw e;
		} catch (IOException e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("IOException in BoxApiServiceImpl::downloadFolderFromBox Method :: Exception is ::", e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl::downloadFolderFromBox Method :: Exception is ::", e);
			throw e;
		}

	}

	/**
	 * Rename the folder on BOX
	 * 
	 * @param oldName
	 * @param newName
	 * 
	 * @return void
	 */
	@Override
	public void reNameFolder(String oldName, String newName) {
		logger.info("Inside BoxApiServiceImpl :: reNameFolder Method");
		try {
			BoxFolder userFolder = getBoxFolder(oldName);
			com.box.sdk.BoxFolder.Info userFolderInfo = userFolder.getInfo();
			userFolderInfo.setName(newName);
			userFolder.updateInfo(userFolderInfo);
		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxAPIException in BoxApiServiceImpl::reNameFolder Method :: Exception is ::", e);
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl::reNameFolder Method :: Exception is ::", e);
		}
	}
	
	/**
	 * get email ids of the users with incomplete KYC process
	 * 
	 * @return List
	 */
	@Override
	public List<String> getEmailIdsOfIncompleteKycForms() throws Exception {
		logger.info("Inside BoxApiServiceImpl::getEmailIdsOfIncompleteKycForms Method");
		List<String> emailList = new ArrayList<String>();
		try {
			setBoxAPIConnection();
			BoxFolder rootFolder = BoxFolder.getRootFolder(apiConn);
			for (BoxItem.Info info : rootFolder) {
				logger.info("Inside BoxApiServiceImpl::getEmailIdsOfIncompleteKycForms Method :: File/folder name is "
						+ info.getName());
				if (info.getName().contains("_inProgress")) {
					logger.info(
							"Inside BoxApiServiceImpl::getEmailIdsOfIncompleteKycForms Method :: Incomplete KYC Folder found "
									+ info.getName());
					emailList.add(info.getName().replace("_inProgress", ""));
				}
			}

		} catch (BoxAPIException e) {
			logger.error(e.getResponse());
			logger.error(e.getStackTrace());
			logger.error("BoxApiException in BoxApiServiceImpl:: getEmailIdsOfIncompleteKycForms method :: exception is"
					+ e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in BoxApiServiceImpl:: getEmailIdsOfIncompleteKycForms method :: exception is" + e);
			throw e;
		}
		return emailList;
	}

}
