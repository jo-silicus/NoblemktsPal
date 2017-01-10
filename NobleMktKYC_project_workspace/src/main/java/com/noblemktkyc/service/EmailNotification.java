package com.noblemktkyc.service;

/**
 * @author Silicus Technologies, 2016
 * 
 */
public interface EmailNotification {
	void sendKycCompletionEmail(String toAddress, String fromAddress, String subject) throws Exception;

	void sendReminderEmailToCompleteKyc(final String toAddress, final String fromAddress, final String subject,
			final String encryptedMsg) throws Exception;
}
