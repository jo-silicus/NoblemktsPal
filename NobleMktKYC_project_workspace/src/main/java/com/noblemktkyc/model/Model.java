package com.noblemktkyc.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * 
 * @author Silicus Technologies, 2016 Interface Model
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", visible = true)
@JsonSubTypes({ @Type(value = PersonalInfoModel.class, name = "PersonalInfo"),
		@Type(value = AccountInfoModel.class, name = "AccountInfo"),
		@Type(value = EntityInfoModel.class, name = "EntityInfo") })

public interface Model {
	@JsonIgnore
	@JsonProperty(value = "type")
	String getType();

	void setType(String type);

	String getUserName();

	void setUserName(String userName);

}
