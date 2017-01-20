package com.noblemktkyc.controller;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.ServletContextAware;

/**
 * @author Silicus Technologies, 2016
 * 
 *         CommonController:: Spring MVC Common Controller
 * 
 */
@RestController
public class CommonController implements ServletContextAware {
	final static Logger logger = Logger.getLogger(CommonController.class);

	@Autowired
	ServletContext context;

	@Value("${document_path}") // get the value from the property file
	private String document_path;

	public CommonController() {
// constructor stub
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.context = servletContext;
	}

	/**
	 * Return the path of the KYCDocuments in the Servletcontext if path is not
	 * set in the application.properties file
	 * 
	 * @return
	 */
	public String getDocumentPath() {
		logger.info("Inside CommonController ::  getDocumentPath Method");
		if (document_path == null || document_path.isEmpty()) {
			return context.getRealPath("/KYCDocuments");
		}
		return document_path;
	}
}