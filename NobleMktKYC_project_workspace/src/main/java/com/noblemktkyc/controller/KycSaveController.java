package com.noblemktkyc.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.noblemktkyc.model.CustomValidator;
import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.User;
import com.noblemktkyc.service.KycSaveService;

/**
 * @author Silicus Technologies, 2016
 * 
 *         KycSaveController :: Spring MVC Controller for rest services to
 *         upload and save the personal, entity and account info
 * 
 */
@RestController
public class KycSaveController {
	final static Logger logger = Logger.getLogger(KycSaveController.class);

	@Value("${fileMaxSize}") // get the value from the property file for max
								// file size
	private String fileMaxSize;

	@Autowired
	private KycSaveService kycSaveService;

	@Autowired
	Environment env;

	@Autowired
	CustomValidator customValidator;
	
	public KycSaveController() {
		//constructor stub
	}

	/**
	 * 
	 * @param user
	 *            - The model
	 *            (PersonalInfoModel/EntityInfoModel/AccountInfoModel) depending
	 *            on the JSon object sent while calling the service
	 * @param kycInfoModel
	 * @param result
	 * @param httpServletRequest
	 * @return
	 */
	@RequestMapping(value = "/saveKycInfo/", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
	public @ResponseBody ResponseEntity<List<String>> saveKycInfo(@Valid @RequestBody Model kycInfoModel,
			BindingResult result, HttpServletRequest httpServletRequest) {
		logger.info("inside KycSaveController :: saveKycInfo Method");
		List<String> errorList = new ArrayList<>();
		try {
			/**
			 * Perform custom validations
			 */
			customValidator.validate(kycInfoModel, result);

			/**
			 * Add errors to errorlist and return the list in the response
			 */
			String errorMsg = null;
			if (result.hasErrors()) {
				for (Object object : result.getAllErrors()) {
					if (object instanceof FieldError) {
						FieldError fieldError = (FieldError) object;
						errorMsg = fieldError.getField();
					} else if (object instanceof ObjectError) {
						ObjectError objectError = (ObjectError) object;
						errorMsg = objectError.getCode();
					}
					errorList.add(env.getProperty(errorMsg));
					logger.info("validation Errors::" + env.getProperty(errorMsg));
				}
			}
			logger.info("inside KycSaveController user detail is::" + kycInfoModel);

			/**
			 * Call the service to save the InfoModel object userInfo.getType()
			 * - PersonalInfo or EntityInfo or AccountInfo
			 */
			HttpSession session = httpServletRequest.getSession(false);
			if (kycInfoModel != null && kycInfoModel.getUserName() != null
					&& session.getAttribute("userInfo") != null &&  kycInfoModel.getType()!=null) {
				kycSaveService.saveKycInfo(kycInfoModel, (User) session.getAttribute("userInfo"));
				logger.info("inside controller ::" + kycInfoModel.getType() + kycInfoModel.getUserName());
			}

			

			if (errorList != null && errorList.size() > 0) {
				return new ResponseEntity<List<String>>(errorList, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return new ResponseEntity<List<String>>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in KycSaveController :: saveKycInfo method:: Exception is ::", e);
			return new ResponseEntity<List<String>>(errorList, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * To upload the file selected by the user
	 * 
	 * @param request
	 * @param response
	 * @param httpServletRequest
	 * @param userName
	 * @param newFileName
	 * @return
	 */
	@RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
	public ResponseEntity<List<String>> uploadFileHandler(MultipartHttpServletRequest request,
			HttpServletResponse response, HttpServletRequest httpServletRequest, @RequestParam String userName,
			@RequestParam String newFileName) {
		logger.info("inside KycSaveController :: uploadFileHandler Method to save the file");
		List<String> errorList = new ArrayList<>();
		String uploadedFilePath = null;
		try {
			// Get the list of files from the request object
			java.util.Iterator<String> itr = request.getFileNames();
			if (itr == null) {
				logger.info("inside KycSaveController :: uploadFileHandler Method::No file to iterate");
			} else {
				MultipartFile file = request.getFile(itr.next());
				// file size validation
				if (file.getSize() > Integer.parseInt(fileMaxSize)) {
					errorList.add(env.getProperty("fileSize"));
					logger.warn(
							"uploadFileHandler::File to be uploaded exceeds maximum size limit of 10MB. File size is : "
									+ file.getSize());
					return new ResponseEntity<List<String>>(errorList, HttpStatus.INTERNAL_SERVER_ERROR);
				}
				// save the file
				List<String> uploadedFileInfoList = new ArrayList<>();

				HttpSession session = httpServletRequest.getSession(false);

				uploadedFilePath = kycSaveService.saveUploadedFileToDisk(file, newFileName,
						(User) session.getAttribute("userInfo"));
				uploadedFileInfoList.add(uploadedFilePath);
				return new ResponseEntity<List<String>>(uploadedFileInfoList, HttpStatus.OK);
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in KycSaveController :: uploadFileHandler method:: Exception is ::", e);
			return new ResponseEntity<List<String>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<String>>(HttpStatus.OK);
	}

	/**
	 * To update folder name after successful submission of KYC forms
	 * 
	 * @param userName
	 * @param httpServletRequest
	 * 
	 * @return
	 */
	@RequestMapping(value = "/renameFolder", method = RequestMethod.POST)
	public ResponseEntity<List<String>> renameFolder(@RequestParam String userName,
			HttpServletRequest httpServletRequest) {
		logger.info("inside KycSaveController :: renameFolder Method");
		HttpSession session = httpServletRequest.getSession(false);
		try {
			kycSaveService.renameDirectory((User) session.getAttribute("userInfo"),
					env.getProperty("kycStatusForcompletion"));
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in KycSaveController:: renameFolder method:: Exception is", e);
			return new ResponseEntity<List<String>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (session != null)
			session.invalidate();
		return new ResponseEntity<List<String>>(HttpStatus.OK);
	}

}