package com.noblemktkyc.service;

import org.springframework.web.multipart.MultipartFile;

import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.User;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         interface for service method
 * 
 */
public interface KycSaveService {
	void saveKycInfo(Model ModelInfo, User userInfo) throws Exception;

	String saveUploadedFileToDisk(MultipartFile file, String fileName, User userInfo) throws Exception;

	void renameDirectory(User userInfo, String finalStatus) throws Exception;
}
