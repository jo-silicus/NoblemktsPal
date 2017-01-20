package com.noblemktkyc.service;

/**
 * @author Silicus Technologies, 2016
 * 
 */
@FunctionalInterface
public interface Decryptor {

	Object decryptObject(String base64Data, String base64IV) throws Exception;
}
