package com.noblemktkyc.service.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * @author Silicus Technologies, 2016
 * 
 */

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.noblemktkyc")
@EnableScheduling
public class EmailScheduler {
	public static void main(String[] args) {
		SpringApplication.run(EmailScheduler.class);
	}
}
