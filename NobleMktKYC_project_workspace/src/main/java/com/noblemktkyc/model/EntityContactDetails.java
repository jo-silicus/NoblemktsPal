package com.noblemktkyc.model;

import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author Silicus Technologies, 2016
 * 
 */

public class EntityContactDetails {

	private String postal_Address;
	private String country;
	private String state;
	private String city;
	private String postcode;
	@NotEmpty
	@Pattern(regexp = "^[0-9]+$")
	private String phone;
	@NotEmpty
	@Pattern(regexp = "^[0-9]+$")
	private String alt_Phone;

	private String reports_Email;
	public EntityContactDetails() {
		// constructor stub
	}

	public String getPostal_Address() {
		return postal_Address;
	}

	public void setPostal_Address(String postal_Address) {
		this.postal_Address = postal_Address;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostcode() {
		return postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAlt_Phone() {
		return alt_Phone;
	}

	public void setAlt_Phone(String alt_Phone) {
		this.alt_Phone = alt_Phone;
	}

	public String getReports_Email() {
		return reports_Email;
	}

	public void setReports_Email(String reports_Email) {
		this.reports_Email = reports_Email;
	}

}
