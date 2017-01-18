package com.noblemktkyc.model;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author Silicus Technologies, 2016
 * 
 */
public class BankAccountAddressModel {
	// Bank Account Address
	@NotEmpty
	private String addrLine1;
	private String addrState;
	private String addrLine2;
	@NotEmpty
	private String addrPostCode;
	@NotEmpty
	private String addrCity;
	private String accountCountry;
	public BankAccountAddressModel() {
		//constructor stub
	}
	public String getAddrLine1() {
		return addrLine1;
	}

	public void setAddrLine1(String addrLine1) {
		this.addrLine1 = addrLine1;
	}

	public String getAddrState() {
		return addrState;
	}

	public void setAddrState(String addrState) {
		this.addrState = addrState;
	}

	public String getAddrLine2() {
		return addrLine2;
	}

	public void setAddrLine2(String addrLine2) {
		this.addrLine2 = addrLine2;
	}

	public String getAddrPostCode() {
		return addrPostCode;
	}

	public void setAddrPostCode(String addrPostCode) {
		this.addrPostCode = addrPostCode;
	}

	public String getAddrCity() {
		return addrCity;
	}

	public void setAddrCity(String addrCity) {
		this.addrCity = addrCity;
	}

	public String getAccountCountry() {
		return accountCountry;
	}

	public void setAccountCountry(String accountCountry) {
		this.accountCountry = accountCountry;
	}

}
