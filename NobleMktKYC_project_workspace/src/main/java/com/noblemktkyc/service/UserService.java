package com.noblemktkyc.service;

import com.box.sdk.BoxFolder;

/**
 * @author Silicus Technologies, 2016
 * 
 */
@FunctionalInterface
public interface UserService {
	BoxFolder getUserBoxFolder(String folderName) throws Exception;
}