package com.noblemktkyc.configuration;

import java.io.IOException;
import java.util.Properties;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.VelocityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.ui.velocity.VelocityEngineFactoryBean;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * @author : Silicus Technologies, 2016
 * 
 *         MailConfig :: class for mail configuration.
 */

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.noblemktkyc")
@PropertySource(value = { "classpath:mail.properties" })
public class MailConfig {
	@Autowired
	private Environment environment;
	
	public MailConfig() {
		// Constructor stub
	}

	/**
	 * Configuration for setting the properties for sending email
	 */
	@Bean
	public JavaMailSender mailSender() {

		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setDefaultEncoding("UTF-8");
		mailSender.setHost(environment.getProperty("mail.host"));
		mailSender.setPort(environment.getProperty("mail.port", Integer.class, 25));
		mailSender.setUsername(environment.getProperty("mail.username"));
		mailSender.setPassword(environment.getProperty("mail.password"));
		Properties properties = new Properties();
		properties.put("mail.smtp.auth", environment.getProperty("mail.smtp.auth", Boolean.class, false));
		properties.put("mail.smtp.starttls.enable",
				environment.getProperty("mail.smtp.starttls.enable", Boolean.class, true));
		mailSender.setJavaMailProperties(properties);
		return mailSender;
	}

	/**
	 * Configuration for setting email template
	 */
	@Bean
	public VelocityEngine velocityEngine() throws VelocityException, IOException {
		VelocityEngineFactoryBean factory = new VelocityEngineFactoryBean();
		Properties props = new Properties();
		props.put("resource.loader", "class");
		props.put("class.resource.loader.class",
				"org.apache.velocity.runtime.resource.loader." + "ClasspathResourceLoader");
		factory.setVelocityProperties(props);

		return factory.createVelocityEngine();
	}

}
