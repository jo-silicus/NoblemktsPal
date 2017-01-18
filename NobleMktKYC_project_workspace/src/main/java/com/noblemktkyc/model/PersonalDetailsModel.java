package com.noblemktkyc.model;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * 
 * @author Silicus Technologies, 2016 PersonalDetailsModel
 */
public class PersonalDetailsModel {
	@NotEmpty
	private String dob;
	private String maiden_Name;
	private String title;
	@NotEmpty
	private String country_of_Citizenship;
	public PersonalDetailsModel() {
		//constructor stub
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getMaiden_Name() {
		return maiden_Name;
	}

	public void setMaiden_Name(String maiden_Name) {
		this.maiden_Name = maiden_Name;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCountry_of_Citizenship() {
		return country_of_Citizenship;
	}

	public void setCountry_of_Citizenship(String country_of_Citizenship) {
		this.country_of_Citizenship = country_of_Citizenship;
	}

}
