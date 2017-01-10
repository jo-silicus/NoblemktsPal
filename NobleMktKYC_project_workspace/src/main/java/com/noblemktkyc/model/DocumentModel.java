package com.noblemktkyc.model;

/**
 * 
 * @author Silicus Technologies, 2016 Document model
 */
public class DocumentModel {
	private String newFileName;
	private String originalName;
	private String documentType;
	private String file_path;

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getNewFileName() {
		return newFileName;
	}

	public void setNewFileName(String newFileName) {
		this.newFileName = newFileName;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOrignalName(String originalName) {
		this.originalName = originalName;
	}

	public String getFile_path() {
		return file_path;
	}

	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}

}
