package com.noblemktkyc.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Silicus Technologies, 2016 Model for EntityInfo screen
 */
public class EntityInfoModel implements Serializable, Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String userName;
	@JsonIgnore
	@JsonProperty(value = "type")
	private String type;

	@NotEmpty
	private String name;

	@NotEmpty
	private String base_currency;

	@NotEmpty
	private String typeOfBusiness;
	@Valid
	private List<DocumentModel> entityDocUpload;
	@Valid
	private List<DocumentModel> enhancedDueDiligence;
	@Valid
	private EntityDetailsModel entity_information;
	@Valid
	private EntityContactDetails entity_address;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBase_currency() {
		return base_currency;
	}

	public void setBase_currency(String base_currency) {
		this.base_currency = base_currency;
	}

	public String getTypeOfBusiness() {
		return typeOfBusiness;
	}

	public void setTypeOfBusiness(String typeOfBusiness) {
		this.typeOfBusiness = typeOfBusiness;
	}

	public List<DocumentModel> getEntityDocUpload() {
		return entityDocUpload;
	}

	public void setEntityDocUpload(List<DocumentModel> entityDocUpload) {
		this.entityDocUpload = entityDocUpload;
	}

	public List<DocumentModel> getEnhancedDueDiligence() {
		return enhancedDueDiligence;
	}

	public void setEnhancedDueDiligence(List<DocumentModel> enhancedDueDiligence) {
		this.enhancedDueDiligence = enhancedDueDiligence;
	}

	public EntityDetailsModel getEntity_information() {
		return entity_information;
	}

	public void setEntity_information(EntityDetailsModel entity_information) {
		this.entity_information = entity_information;
	}

	public EntityContactDetails getEntity_address() {
		return entity_address;
	}

	public void setEntity_address(EntityContactDetails entity_address) {
		this.entity_address = entity_address;
	}

	public EntityInfoModel() {
		super();
		entityDocUpload = new ArrayList<DocumentModel>();
		enhancedDueDiligence = new ArrayList<DocumentModel>();
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

}
