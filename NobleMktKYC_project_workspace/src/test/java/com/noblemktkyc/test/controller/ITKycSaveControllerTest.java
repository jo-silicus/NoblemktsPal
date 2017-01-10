package com.noblemktkyc.test.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import java.io.FileInputStream;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.noblemktkyc.configuration.ApplicationConfiguration;
import com.noblemktkyc.configuration.ApplicationInitializer;
import com.noblemktkyc.service.UserService;

import TestSupportMethods.TestSupport;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {ApplicationConfiguration.class, ApplicationInitializer.class })
public class ITKycSaveControllerTest {
	final static Logger logger = Logger.getLogger(ITKycSaveControllerTest.class);
	@Autowired
	private WebApplicationContext wac;
	private MockMvc mockMvc;
    private TestSupport testSupportMethods =new TestSupport(); 
	@Autowired
	UserService mockUserService;
	
	@Before
	public void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}
	@Test
	public void uplodeFileTest() throws Exception {
		testSupportMethods.setSessionForMockTest(mockUserService);
		FileInputStream fis = new FileInputStream("D:\\Chrysanthemum.jpg");
		MockMultipartFile firstFile=new MockMultipartFile("Chrysanthemum.jpg", fis);
		fis.close();
		mockMvc.perform(MockMvcRequestBuilders.fileUpload("/uploadFile")
                .file(firstFile).param("userName", "pallavi").param("newFileName", "Chrysanthemum.jpg").sessionAttr("userInfo", testSupportMethods.setSessionForMockTest(mockUserService))
				.contentType(MediaType.APPLICATION_JSON_VALUE))
		.andExpect(status().isOk());
	
	}

	@Test
	public void saveKycInfoTest() throws Exception {
	
		testSupportMethods.createPersonalModelForTestInString();
		System.out.println("================%%%%%%%%%%%%%%%%%%%%%"+testSupportMethods.createPersonalModelForTestInString());
		mockMvc.perform(post("/saveKycInfo/").content(testSupportMethods.createPersonalModelForTestInString()).contentType(MediaType.APPLICATION_JSON_VALUE).sessionAttr("userInfo", testSupportMethods.setSessionForMockTest(mockUserService)))
		.andExpect(status().isOk());
		
	}


	
}
