package com.noblemktkyc.model;

import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author Silicus Technologies, 2016
 * 
 */

public class EntityDetailsModel {
	@NotEmpty
	private String employer_Identification_Number;
	@NotEmpty
	private String source_of_Funds;
	private String trademark_Name;
	@NotEmpty
	@Pattern(regexp = "^[0-9]+$")
	private String transfer_Call_back_Phone;
	@NotEmpty
	@Email
	private String transfer_Call_back_Email;
	@NotEmpty

	private String registered_Address;
	@NotEmpty

	private String registered_Country;

	private String registered_State;
	@NotEmpty

	private String registered_City;
	@NotEmpty
	private String registered_Postcode;

	public String getEmployer_Identification_Number() {
		return employer_Identification_Number;
	}

	public void setEmployer_Identification_Number(String employer_Identification_Number) {
		this.employer_Identification_Number = employer_Identification_Number;
	}

	public String getSource_of_Funds() {
		return source_of_Funds;
	}

	public void setSource_of_Funds(String source_of_Funds) {
		this.source_of_Funds = source_of_Funds;
	}

	public String getTrademark_Name() {
		return trademark_Name;
	}

	public void setTrademark_Name(String trademark_Name) {
		this.trademark_Name = trademark_Name;
	}

	public String getTransfer_Call_back_Phone() {
		return transfer_Call_back_Phone;
	}

	public void setTransfer_Call_back_Phone(String transfer_Call_back_Phone) {
		this.transfer_Call_back_Phone = transfer_Call_back_Phone;
	}

	public String getTransfer_Call_back_Email() {
		return transfer_Call_back_Email;
	}

	public void setTransfer_Call_back_Email(String transfer_Call_back_Email) {
		this.transfer_Call_back_Email = transfer_Call_back_Email;
	}

	public String getRegistered_Address() {
		return registered_Address;
	}

	public void setRegistered_Address(String registered_Address) {
		this.registered_Address = registered_Address;
	}

	public String getRegistered_Country() {
		return registered_Country;
	}

	public void setRegistered_Country(String registered_Country) {
		this.registered_Country = registered_Country;
	}

	public String getRegistered_State() {
		return registered_State;
	}

	public void setRegistered_State(String registered_State) {
		this.registered_State = registered_State;
	}

	public String getRegistered_City() {
		return registered_City;
	}

	public void setRegistered_City(String registered_City) {
		this.registered_City = registered_City;
	}

	public String getRegistered_Postcode() {
		return registered_Postcode;
	}

	public void setRegistered_Postcode(String registered_Postcode) {
		this.registered_Postcode = registered_Postcode;
	}

}
