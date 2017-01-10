package com.noblemktkyc.service;

import java.util.List;
import java.util.Map;

/**
 * @author Silicus Technologies, 2016
 * 
 *         Interface for fetch service method
 * 
 */

public interface KycFetchService {

	Map<String, Object> readFileInObject(String path, String userName, List<String> infoType, String finalStatus)
			throws Exception;
}
