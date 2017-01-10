package com.noblemktkyc.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;;

/**
 * 
 * @author Silicus Technologies, 2016 Model for Personal Info screen
 */
public class PersonalInfoModel implements Serializable, Model {

	// personal details
	private static final long serialVersionUID = 1L;
	@Email
	private String userName;
	@Email
	private String email;
	@JsonProperty(value = "type")
	@JsonIgnore
	private String type;
	@NotEmpty
	@Pattern(regexp = "^[A-Za-z.'`,\\s]+$")
	private String firstName;
	@NotEmpty
	@Pattern(regexp = "^[A-Za-z.'`,\\s]+$")
	private String lastName;
	private String nationalIdentifier;
	@Valid
	private List<DocumentUploadDetailModel> documentUploadDetail;
	@Valid
	private PersonalDetailsModel contact_information;
	@Valid
	private ContactDetails contact_address;

	public PersonalInfoModel() {
		documentUploadDetail = new ArrayList<>();
	}

	public PersonalDetailsModel getContact_information() {
		return contact_information;
	}

	public void setContact_information(PersonalDetailsModel contact_information) {
		this.contact_information = contact_information;
	}

	public ContactDetails getContact_address() {
		return contact_address;
	}

	public void setContact_address(ContactDetails contact_address) {
		this.contact_address = contact_address;
	}

	@Override
	public String getType() {
		return type;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getNationalIdentifier() {
		return nationalIdentifier;
	}

	public void setNationalIdentifier(String nationalIdentifier) {
		this.nationalIdentifier = nationalIdentifier;
	}

	public List<DocumentUploadDetailModel> getDocumentUploadDetail() {
		return documentUploadDetail;
	}

	public void setDocumentUploadDetail(List<DocumentUploadDetailModel> documentUploadDetail) {
		this.documentUploadDetail = documentUploadDetail;
	}

	@Override
	public void setType(String type) {
		this.type = type;

	}

	@Override
	public String getUserName() {

		return userName;
	}

	@Override
	public void setUserName(String userName) {
		this.userName = userName;

	}

}
