---
layout: post
title: Common BeanUtils  to set html form values in Java Bean
published: true
date: 2011-03-08 00:20:00 +5:30
author: Sandeep Bhardwaj
tags: [Java]
---

Hi All,  
Today I am going to discuss about a important jar commons-beanutils used by struts framework and demonstrating how to use this important jar in our servlet and jsp project.  

If you worked with struts1 or struts2 then you noticed that the ActionForm or Action (in Struts2) linked with your Jsp page or html page when you clicked on submit button the values of html form with same property name is set by calling the setter method of your POJO or FormBean automatically.  

But when we worked with only servlet and Jsp without using any MVC framework then we need to set the values using below line :-  

String userName=request.getParameter(“userName”);  

If we had 10 field on a form then we need to create 10 variables and we have to write the above line 10 times by passing the form filed name as argument.

Also another problem then we have to cast the filed values according to our need like  

``` java  
int age=Integer.parseInt(request.getParameter(“age”));  
``` 

<h3>About application</h3>  
This application contains a simple form a Java Bean and a Servlet to display the form values submitted by user using Common BeanUtils jar.

1.  Simple Jsp with two input boxes and a submit button.
2.  LoginForm simple Java bean containing setter and getters of form fields.
3.  FormUtil class used to set the Jsp form values in Java Bean.
4.  LoginActionServlet to process from values.

<h3>Package Structure</h3>


<h3>jar needed</h3>


<h3>index.jsp</h3>  
index.jsp containing a form with username and password textboxes and a submit button. When user clicked on submit button LoginActionServlet called.

``` html  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<form action="loginActionServlet" method="post">
   <table>
      <tbody>
         <tr>
            <td>Username</td>
            <td>
               <input name="userName" type="text">
            </td>
         </tr>
         <tr>
            <td>Password</td>
            <td>
               <input name="password" type="password">
            </td>
         </tr>
         <tr>
            <td>
               <input type="submit">
            </td>
         </tr>
      </tbody>
   </table>
</form>
``` 

<h3>LoginForm.java</h3>  
LoginForm class with setters and getters of userName and password these fields names are same as form fields in jsp.

``` java  
package form;

public class LoginForm {

	private String userName;
	private String password;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
} 
``` 

<h3>FormUtil.java</h3>  
FormUtil class used BeanUtils class populate method for setting the form values in Java beans. I made this class a generic class so that we do not need to write same lines again and again in each servlet, just we need to pass the class of java bean and request in populate method of FormUtil.  
**LoginForm loginForm = FormUtil.populate(LoginForm.class, request);**

``` java  
package util;

import java.lang.reflect.InvocationTargetException;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.beanutils.BeanUtils;

public class FormUtil {

	public static <T> T populate(Class<T> clazz, HttpServletRequest request) {
		T object = null;
		try {

			object = (T) clazz.newInstance();
			BeanUtils.populate(object, request.getParameterMap());

		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return object;
	}
}  
```

<h3>LoginActionServlet.java</h3>  
LoginActionServlet used to process the values of LoginForm and display the values.

``` java  
package action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.FormUtil;
import form.LoginForm;

public class LoginActionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		PrintWriter out = response.getWriter();

		LoginForm loginForm = FormUtil.populate(LoginForm.class, request);

		out.println("User name is :" + loginForm.getUserName());
		out.println("Password is :" + loginForm.getPassword());

	}
} 
```

<h3>web.xml</h3>  
web.xml with LoginActionServlet  servlet mapping.

``` xml  
<web-app id="WebApp_ID" version="2.4"
	xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemalocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
	<display-name>DemoApp</display-name>
	<servlet>
		<display-name>LoginActionServlet</display-name>
		<servlet-name>LoginActionServlet</servlet-name>
		<servlet-class>action.LoginActionServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>LoginActionServlet</servlet-name>
		<url-pattern>/loginActionServlet</url-pattern>
	</servlet-mapping>
	<welcome-file-list>
		<welcome-file>index.jsp</welcome-file>
	</welcome-file-list>
</web-app> 
```

Now paste these files according to package structure and run it by typing [http://localhost:8080/DemoApp](http://localhost:8080/DemoApp).
