package com.noblemktkyc.service.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.noblemktkyc.service.EmailNotification;
import com.noblemktkyc.service.box.api.BoxApiService;

/**
 * @author Silicus Technologies, 2016
 * 
 */

@Component
public class ScheduledTask {
	Date dateTime = new Date();
	SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// dd/MM/yyyy

	@Autowired
	BoxApiService boxApiService;

	@Autowired
	EmailNotification email;
	EncryptorImpl encryptor = new EncryptorImpl();

	// @Scheduled(fixedRate = 18000)
	public void doTask() throws Exception {
		
		
		List<String> emailList = boxApiService.getEmailIdsOfIncompleteKycForms();
		for (String emailId : emailList) {
			email.sendReminderEmailToCompleteKyc(emailId, "testemailmkt2016@gmail.com", "Reminder for kyc completion",
					encryptor.getEncryptedUrl(emailId));
		}

	}
}
