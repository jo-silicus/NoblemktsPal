package com.noblemktkyc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Silicus Technologies, 2016
 * 
 *         IndexController :: Mapping for the index page of the application
 *  
 */
@Controller
@RequestMapping("/")
public class IndexController {

	@RequestMapping(method = RequestMethod.GET)
	public String getIndexPage() {
	
		return "redirect:/static/index.html";
	}

}