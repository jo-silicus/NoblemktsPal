package com.noblemktkyc.model;

/**
 * 
 * @author Silicus Technologies, 2016 Document model for uploaded documents
 */
public class DocumentUploadDetailModel extends DocumentModel {

	private String dtype;
	private String idIssueDate;
	private String idNo;
	private String idExpiryDate;
	private String country_issue;

	public String getCountry_issue() {
		return country_issue;
	}

	public void setCountry_issue(String country_issue) {
		this.country_issue = country_issue;
	}

	public String getDtype() {
		return dtype;
	}

	public void setDtype(String type) {
		this.dtype = type;
	}

	public String getIdIssueDate() {
		return idIssueDate;
	}

	public void setIdIssueDate(String idIssueDate) {
		this.idIssueDate = idIssueDate;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	public String getIdExpiryDate() {
		return idExpiryDate;
	}

	public void setIdExpiryDate(String idExpiryDate) {
		this.idExpiryDate = idExpiryDate;
	}

	@Override
	public String toString() {
		return "DocumentUploadDetailModel [newFileName=" + getNewFileName() + ", documentType=" + getDocumentType()
				+ ", idType=" + dtype + ", idIssueDate=" + idIssueDate + ", idNo=" + idNo + ", idExpiryDate="
				+ idExpiryDate + "]";
	}

}
