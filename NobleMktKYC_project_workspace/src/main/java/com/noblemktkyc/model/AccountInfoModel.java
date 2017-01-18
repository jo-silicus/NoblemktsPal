package com.noblemktkyc.model;

import java.io.Serializable;

import javax.validation.Valid;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Silicus Technologies, 2016
 * 
 */
public class AccountInfoModel implements Serializable, Model {

	private static final long serialVersionUID = 1L;
	@Email
	private String userName;
	@JsonIgnore
	@JsonProperty(value = "type")
	private String type;
	private String account_type;
	@NotEmpty
	private String accountName;
	private String account_no;
	private String payment_code_one_id;
	private String payment_code_one_ref;
	private String corrRoutingNo;
	private String bank;

	// Wallet Account Address
	private String walletAccountName;
	private String walletAddress;
	private String corraddress1;
	private String corraddress2;
	private String corrAccountsCountryName;
	private String corrstate;
	private String corrcity;
	private String corrbankName;
	private String corrzip;

	public AccountInfoModel() {
		// constructor stub
	}
	public String getPayment_code_one_id() {
		return payment_code_one_id;
	}

	public void setPayment_code_one_id(String payment_code_one_id) {
		this.payment_code_one_id = payment_code_one_id;
	}

	public String getPayment_code_one_ref() {
		return payment_code_one_ref;
	}

	public void setPayment_code_one_ref(String payment_code_one_ref) {
		this.payment_code_one_ref = payment_code_one_ref;
	}

	public String getCorrRoutingNo() {
		return corrRoutingNo;
	}

	public void setCorrRoutingNo(String corrRoutingNo) {
		this.corrRoutingNo = corrRoutingNo;
	}

	@Valid
	private BankAccountAddressModel account_information;

	public String getAccount_no() {
		return account_no;
	}

	public void setAccount_no(String account_no) {
		this.account_no = account_no;
	}

	public String getAccount_type() {
		return account_type;
	}

	public void setAccount_type(String account_type) {
		this.account_type = account_type;
	}

	public BankAccountAddressModel getAccount_information() {
		return account_information;
	}

	public void setAccount_information(BankAccountAddressModel account_information) {
		this.account_information = account_information;
	}

	public String getCorraddress1() {
		return corraddress1;
	}

	public void setCorraddress1(String corraddress1) {
		this.corraddress1 = corraddress1;
	}

	public String getCorraddress2() {
		return corraddress2;
	}

	public void setCorraddress2(String corraddress2) {
		this.corraddress2 = corraddress2;
	}

	public String getCorrstate() {
		return corrstate;
	}

	public void setCorrstate(String corrstate) {
		this.corrstate = corrstate;
	}

	public String getCorrcity() {
		return corrcity;
	}

	public void setCorrcity(String corrcity) {
		this.corrcity = corrcity;
	}

	public String getCorrzip() {
		return corrzip;
	}

	public void setCorrzip(String corrzip) {
		this.corrzip = corrzip;
	}

	public String getUserName() {
		return userName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getWalletAccountName() {
		return walletAccountName;
	}

	public void setWalletAccountName(String walletAccountName) {
		this.walletAccountName = walletAccountName;
	}

	public String getWalletAddress() {
		return walletAddress;
	}

	public void setWalletAddress(String walletAddress) {
		this.walletAddress = walletAddress;
	}

	public String getCorrAccountsCountryName() {
		return corrAccountsCountryName;
	}

	public void setCorrAccountsCountryName(String corrAccountsCountryName) {
		this.corrAccountsCountryName = corrAccountsCountryName;
	}

	public void setCorrbankName(String corrbankName) {
		this.corrbankName = corrbankName;
	}

	public String getCorrbankName() {
		return corrbankName;
	}

}
