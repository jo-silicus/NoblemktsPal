package com.noblemktkyc.test.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.noblemktkyc.configuration.ApplicationConfiguration;
import com.noblemktkyc.configuration.ApplicationInitializer;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ComponentScan(basePackages = "com.noblemktkyc")
@TestExecutionListeners(inheritListeners = false, listeners = { DependencyInjectionTestExecutionListener.class,
		DirtiesContextTestExecutionListener.class })
@ContextConfiguration(classes = {ApplicationConfiguration.class, ApplicationInitializer.class })
public class ITUserControllerTest {

	final static Logger logger = Logger.getLogger(ITUserControllerTest.class);
	

	@Autowired
	private WebApplicationContext wac;
	private MockMvc mockMvc;
	
public ITUserControllerTest() {
		// constructor stub
	}

	@Before
	public void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	@Test
	public void createUserTest() throws Exception {
	mockMvc.perform(post("/createUser").param("userName", "test").contentType(MediaType.APPLICATION_JSON_VALUE))
			.andExpect(status().isOk());
	}
	
}
