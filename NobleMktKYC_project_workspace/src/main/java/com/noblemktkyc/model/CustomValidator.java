package com.noblemktkyc.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

import org.springframework.validation.Validator;

/**
 * 
 * @author Silicus Technologies, 2016
 * 
 *         Validator class for custom validations
 */
@Component
public class CustomValidator implements Validator {

	final static Logger logger = Logger.getLogger(CustomValidator.class);

	public boolean supports(Class<?> clazz) {
		return Model.class.isAssignableFrom(clazz);
	}

	public void validate(Object target, Errors errors) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD");
		if (target != null) {
			if (target instanceof PersonalInfoModel) {

				PersonalInfoModel user = (PersonalInfoModel) target;

				// Date of birth cannot be a future date
				if (user != null && user.getContact_information().getDob() != null
						&& !user.getContact_information().getDob().isEmpty()) {

					try {

						Date userDob = dateFormat.parse(user.getContact_information().getDob());
						Date currentDate = dateFormat.parse(dateFormat.format(new Date()));
						if (userDob.compareTo(currentDate) > 0) {
							errors.reject("dob.validation");
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						logger.error("CustomValidator Error::", e);
						e.printStackTrace();
					}
				}

				for (DocumentUploadDetailModel documentUploadDetailModel : user.getDocumentUploadDetail()) {

					if (documentUploadDetailModel != null) {
						if ((documentUploadDetailModel.getIdExpiryDate() != null
								&& !documentUploadDetailModel.getIdExpiryDate().isEmpty())
								&& (documentUploadDetailModel.getIdIssueDate() != null
										&& !documentUploadDetailModel.getIdIssueDate().isEmpty())) {

							try {
								Date issueDate = dateFormat.parse(documentUploadDetailModel.getIdIssueDate());

								Date expiryDate = dateFormat.parse(documentUploadDetailModel.getIdExpiryDate());
								if (issueDate.compareTo(expiryDate) > 0) {
									logger.error("Issue date must be earlier than expiry date" + issueDate + " "
											+ expiryDate);
									errors.reject("idIssueDate.validation."
											+ documentUploadDetailModel.getDtype().replace(" ", ""));
								}
							} catch (ParseException e) {
								logger.error("ParseException in validate" + e);
								e.printStackTrace();
							}

						}
					}

				}

			} else if (target instanceof EntityInfoModel) {
				EntityInfoModel user = (EntityInfoModel) target;
				if (user != null && user.getEntity_address().getPhone() != null
						&& user.getEntity_address().getAlt_Phone() != null
						&& !user.getEntity_address().getPhone().isEmpty()
						&& !user.getEntity_address().getPhone().isEmpty()) {
					// Phone no and alternate phone number should be different
					if (user.getEntity_address().getPhone().equals(user.getEntity_address().getAlt_Phone())) {
						errors.reject("phone.validation");
					}
				}
			}
		}
	}
}
