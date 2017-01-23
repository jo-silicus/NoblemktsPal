package TestSupportMethods;

import java.io.File;
import java.io.FileInputStream;
import java.net.URL;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.noblemktkyc.model.Model;
import com.noblemktkyc.model.PersonalInfoModel;
import com.noblemktkyc.model.User;
import com.noblemktkyc.service.UserService;

public class TestSupport {
	final static Logger logger = Logger.getLogger(TestSupport.class);
	
	public User setSessionForMockTest(UserService mockUserService) throws Exception {
		String userName = "test";
		String status = "_inProgress";
		String directoryPath = "D:/NobleMktKYC/KYCDocuments";

		User user = new User();
		user.setUserName(userName);
		user.setDirectoryPath(directoryPath);
		user.setStatus(status);

		try {
			user.setBoxFolder(mockUserService.getUserBoxFolder(userName + status));

		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			logger.error("Exception in TestSupport :: setSessionForMockTest method:: Exception is ::", e);

		}
		return user;
	}

	public String createPersonalModelForTestInString() throws Exception {
		
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource("PersonalInfo_test@gmail.com.txt").getFile());
		Model model = null;
		ObjectMapper mapperObj = new ObjectMapper();
		logger.info("File path is : " + file.getPath());
		if (file.exists()) {
			
			model= mapperObj.readValue(file, PersonalInfoModel.class);
			
		}
	

		
		return mapperObj.writeValueAsString(model);

	}
}