package TestSupportMethods;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.noblemktkyc.model.PersonalInfoModel;
import com.noblemktkyc.model.User;
import com.noblemktkyc.service.UserService;

public class TestSupport {
	final static Logger logger = Logger.getLogger(TestSupport.class);
	
	public User setSessionForMockTest(UserService mockUserService) throws Exception {
		String userName = "pallavi";
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
		System.out.println("hi me ya hu;;;;;;;;;;;;;;;;;;;;;;;;;;");
		ObjectMapper mapperObj = new ObjectMapper();
		PersonalInfoModel model=new PersonalInfoModel();
		model.setType("PersonalInfo");
		model.setEmail("pall@gmail.com");
		model.setFirstName("pallavi");
		model.setLastName("zade");
		model.setUserName("pallavi");
		System.out.println(mapperObj.writeValueAsString(model));
		return mapperObj.writeValueAsString(model);

	}
}