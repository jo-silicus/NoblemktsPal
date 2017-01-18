package com.noblemktkyc.service;

import java.util.HashMap;
import java.util.Map;

import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.velocity.VelocityEngineUtils;

/**
 * @author Silicus Technologies, 2016
 * 
 */

@Service("EmailNotification")
@Component
@Transactional

public class EmailNotificationImpl implements EmailNotification {
	final static Logger logger = Logger.getLogger(EmailNotificationImpl.class);

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	VelocityEngine velocityEngine;
	public EmailNotificationImpl() {
		//constructor stub
	}

	/**
	 * Set the email details and send email
	 * 
	 * @param toAddress
	 * @param fromAddress
	 * @param subject
	 * 
	 * @return void
	 */

	public void sendKycCompletionEmail(final String toAddress, final String fromAddress, final String subject)
			throws Exception {
		logger.info("Inside EmailNotificationImpl :: sendKycCompletionEmail Method");
		try {
			MimeMessagePreparator preparator = new MimeMessagePreparator() {

				public void prepare(MimeMessage mimeMessage) throws Exception {
					MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
					message.setTo(toAddress);
					message.setFrom(fromAddress);
					message.setSubject(subject);

					Map<String, Object> model = new HashMap<String, Object>();
					model.put("firstName", fromAddress);
					model.put("source", toAddress);
					model.put("userEmailId", fromAddress);

					String text = VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, "emailTemplate.vm",
							"UTF-8", model);
					message.setText(text, true);
				}
			};

			mailSender.send(preparator);
		} catch (MailSendException e) {
			logger.error(e.getStackTrace());
			logger.error(
					"MailSendException in EmailNotificationImpl :: sendKycCompletionEmail method :: Please check Network Connection and Source Email Id ::",
					e);
			throw e;
		} catch (MailAuthenticationException e) {
			logger.error(e.getStackTrace());
			logger.error(
					"MailAuthenticationException in EmailNotificationImpl :: sendKycCompletionEmail method :: Invalid Email Id of Registered User::",
					e);
			throw e;
		} catch (Exception e) {
			logger.error(e.getStackTrace());
			logger.error("Exception in EmailNotificationImpl::sendKycCompletionEmail Method :: ecxeption is ::", e);
			throw e;
		}

	}

	/**
	 * Set the email details and send email to kyc pending user
	 * 
	 * @param toAddress
	 * @param fromAddress
	 * @param subject
	 * @param encryptedMsg
	 * 
	 * @return void
	 */

	public void sendReminderEmailToCompleteKyc(final String toAddress, final String fromAddress, final String subject,
			final String encryptedMsg) throws Exception {
		logger.info("Inside EmailNotificationImpl :: sendReminderEmailToCompleteKyc Method");
		try {
			MimeMessagePreparator preparator = new MimeMessagePreparator() {

				public void prepare(MimeMessage mimeMessage) throws Exception {
					MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
					message.setTo(toAddress);
					message.setFrom(fromAddress);
					message.setSubject(subject);
					Map<String, Object> model = new HashMap<String, Object>();
					model.put("encryptedEmailId", '"' + encryptedMsg + '"');
					String text = VelocityEngineUtils.mergeTemplateIntoString(velocityEngine,
							"mailForEncryptedEmailId.vm", "UTF-8", model);
					message.setText(text, true);
				}
			};
			mailSender.send(preparator);
		} catch (MailSendException e) {
			logger.error(
					"MailSendException in EmailNotificationImpl :: sendReminderEmailToCompleteKyc method :: Please check Network Connection and Source Email Id ::",
					e);
			throw e;
		} catch (MailAuthenticationException e) {
			logger.error(
					"MailAuthenticationException in EmailNotificationImpl :: sendReminderEmailToCompleteKyc method :: Invalid Email Id of Registered User::",
					e);
			throw e;
		}

		catch (Exception e) {
			logger.error("Exception in EmailNotificationImpl:: sendReminderEmailToCompleteKyc method :: exception is",
					e);
			throw e;
		}

	}

}
