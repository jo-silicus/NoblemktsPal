package com.noblemktkyc.service;

import java.io.ByteArrayInputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.net.URLDecoder;
import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Silicus Technologies, 2016
 * 
 */

@Service("Decryptor")
@Component
@Transactional
public class DecryptorImpl implements Decryptor {

	@Value("${keyString}")
	private String keyString;
	public DecryptorImpl() {
		//constructor stub
	}

	/**
	 * Decrypts the input string
	 * 
	 * @param base64Data
	 * @param base64IV
	 * @return
	 * @throws Exception
	 */
	public Object decryptObject(String base64Data, String base64IV) throws Exception {

		String urlDecodedData = URLDecoder.decode(base64Data, "UTF-8");
		// Decode the data
		byte[] encryptedData = Base64.decodeBase64(urlDecodedData.getBytes());

		String urlDecodedIV = URLDecoder.decode(base64IV, "UTF-8");
		// Decode the Init Vector
		byte[] rawIV = Base64.decodeBase64(urlDecodedIV.getBytes());

		// Configure the Cipher
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		IvParameterSpec ivSpec = new IvParameterSpec(rawIV);

		MessageDigest digest = MessageDigest.getInstance("SHA-256");

		digest.update(keyString.getBytes());
		byte[] key = new byte[16];
		System.arraycopy(digest.digest(), 0, key, 0, key.length);
		SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
		cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

		// Decrypt the data..
		byte[] decrypted = cipher.doFinal(encryptedData);

		// Deserialize the object
		ByteArrayInputStream stream = new ByteArrayInputStream(decrypted);
		ObjectInput in = new ObjectInputStream(stream);
		Object obj = null;
		try {
			obj = in.readObject();
		} finally {
			stream.close();
			in.close();
		}
		return obj;
	}

}
