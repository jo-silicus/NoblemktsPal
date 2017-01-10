package com.noblemktkyc.service.box.api;

import java.io.File;
import java.util.List;

import com.box.sdk.BoxFolder;

/**
 * @author : Silicus Technologies, 2016
 * 
 */
public interface BoxApiService {

	public BoxFolder createFolder(String folderName) throws Exception;

	BoxFolder getBoxFolder(String folderName) throws Exception;

	public String uploadFileToBox(String fileName, File file, BoxFolder boxFolder) throws Exception;

	public void downloadFolderFromBox(String folderName, List<String> listInfoType, String destinationDirectoryPath,
			String userName) throws Exception;

	void reNameFolder(String oldName, String newName);

	List<String> getEmailIdsOfIncompleteKycForms() throws Exception;
}
