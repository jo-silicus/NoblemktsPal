package com.noblemktkyc.service.scheduler;

/**
 * @author Silicus Technologies, 2016
 * 
 */
@FunctionalInterface
public interface Encryptor {
	String getEncryptedUrl(String stringToEncode);
}
