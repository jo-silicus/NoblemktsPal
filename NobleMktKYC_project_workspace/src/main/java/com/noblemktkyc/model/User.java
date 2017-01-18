package com.noblemktkyc.model;

import java.io.Serializable;

import com.box.sdk.BoxFolder;

/**
 * @author Silicus Technologies, 2016
 * 
 */
public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	private String userName;
	private String directoryPath;
	private BoxFolder boxFolder;
	private String status;
	public User() {
		//constructor stub
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDirectoryPath() {
		return directoryPath;
	}

	public void setDirectoryPath(String directoryPath) {
		this.directoryPath = directoryPath;
	}

	public BoxFolder getBoxFolder() {
		return boxFolder;

	}

	public void setBoxFolder(BoxFolder boxFolder) {
		this.boxFolder = boxFolder;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
