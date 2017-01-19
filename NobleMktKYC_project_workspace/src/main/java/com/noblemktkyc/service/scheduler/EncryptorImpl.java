package com.noblemktkyc.service.scheduler;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;


/**
 * @author : Silicus Technologies, 2016
 * 
 *         Encryptor :: This class will be used to generate the URL with
 *         encrypted email id of the user. This class has to be moved to the
 *         scheduler that will send emails.
 *
 */
@Service
public class EncryptorImpl implements Encryptor {

	/*
	 * @Value("${keyString}") // get the value from the property file for max
	
	 */
	private String keyString = "adkj@#$0p#@adflkj)(*jlj@#$#@LKjasdjlkj<.,mo@#$@#kljlkdsuqrs";
	final static Logger logger = Logger.getLogger(EncryptorImpl.class);

	@Override
	public String getEncryptedUrl(String stringToEncode) {
		logger.info("Inside Encryptor:: getEncryptedUrl method");
		try {
			String[] encrypted = encryptObject(stringToEncode);
			// url may differ.. based upon project initial context
			String encryptedUrl = "http://10.55.1.131:9591/NobleMktKYC/static/index.html#/login?" + encrypted[0]
					+ "&" + encrypted[1];
			logger.info(encryptedUrl);
			return encryptedUrl;

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error("Exception in Encryptor:: getEncryptedUrl method :: exception is ", e);
			e.printStackTrace();
		}
		return null;
	}

	
	public String[] encryptObject(Object obj) throws Exception {
		logger.info("Inside Encryptor:: encryptObject method");
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		ObjectOutput out = new ObjectOutputStream(stream);
		try {
			// Serialize the object
			out.writeObject(obj);
			byte[] serialized = stream.toByteArray();

			logger.info("serialized " + serialized[0]);

			// Setup the cipher and Init Vector
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			byte[] iv = new byte[cipher.getBlockSize()];

			logger.info("cipher.getBlockSize() " + cipher.getBlockSize());
			logger.info("iv.length " + iv.length);

			new SecureRandom().nextBytes(iv);
			IvParameterSpec ivSpec = new IvParameterSpec(iv);

			// Hash the key with SHA-256 and trim the output to 128-bit for the
			// key
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.update(keyString.getBytes());
			byte[] key = new byte[16];
			System.arraycopy(digest.digest(), 0, key, 0, key.length);
			SecretKeySpec keySpec = new SecretKeySpec(key, "AES");

			// encrypt
			cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);

			// Encrypt & Encode the input
			byte[] encrypted = cipher.doFinal(serialized);
			byte[] base64Encoded = Base64.encodeBase64(encrypted);
			String base64String = new String(base64Encoded);
			String urlEncodedData = URLEncoder.encode(base64String, "UTF-8");

			// Encode the Init Vector
			byte[] base64IV = Base64.encodeBase64(iv);
			String base64IVString = new String(base64IV);
			String urlEncodedIV = URLEncoder.encode(base64IVString, "UTF-8");

			logger.info("urlEncodedData.length " + urlEncodedData.length());
			logger.info("urlEncodedIV.length " + urlEncodedIV.length());

			return new String[] { urlEncodedData, urlEncodedIV };
		} finally {
			stream.close();
			out.close();
		}
	}

}
