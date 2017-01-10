package com.noblemktkyc.service;

import com.box.sdk.BoxFolder;

/**
 * @author Silicus Technologies, 2016
 * 
 */
public interface UserService {
	BoxFolder getUserBoxFolder(String folderName) throws Exception;
}