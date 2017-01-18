package com.noblemktkyc.fileoperation;

import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.User;

/**
 * @author : Silicus Technologies, 2016 FileOperation :: interface for File
 *         Operation
 * 
 */

public interface FileOperation {
	void saveKycInfo(Model modelInfo, User userInfo) throws  Exception;

	String saveUploadedFileToDisk(MultipartFile file, String fileName, User userInfo) throws Exception;

	void renameDirectory(User userInfo, String finalStatus) throws Exception;

	Map<String, Object> readFileInObject(String path, String userName, List<String> infoType, String finalStatus)
			throws Exception;
}
