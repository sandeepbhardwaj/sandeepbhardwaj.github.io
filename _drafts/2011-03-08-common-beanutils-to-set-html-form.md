---
layout: post
title: Common BeanUtils  to set html form values in Java Bean
date: '2011-03-08T00:20:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- Commons-BeanUtils
modified_time: '2015-07-18T07:53:30.187-07:00'
thumbnail: https://lh6.googleusercontent.com/-N86sLhZRuBM/TXX6qy9lh-I/AAAAAAAAAIs/KdU6nrxU5Ls/s72-c/common-BeanUtil.bmp
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-6664218578007346290
blogger_orig_url: http://refcard.blogspot.com/2011/03/common-beanutils-to-set-html-form.html
---

<div dir="ltr" style="text-align: left;" trbidi="on"> Hi All,</br>Today I am going to discuss about a important jar commons-beanutils used by struts framework and demonstrating how to use this important jar in our servlet and jsp project. <br /><br />If you worked with struts1 or struts2 then you noticed that the ActionForm or Action (in Struts2) linked with your Jsp page or html page when you clicked on submit button the values of html form with same property name is set by calling the setter method of your POJO or FormBean automatically. <br /><br />But when we worked with only servlet and Jsp without using any MVC framework then we need to set the values using below line :- <br /><br />String userName=request.getParameter(“userName”); <br /><br />If we had 10 field on a form then we need to create 10 variables and we have to write the above line 10 times by passing the form filed name as argument.</div><div class="MsoNormal">Also another problem then we have to cast the filed values according to our need like <br /><br />int age=Integer.parseInt(request.getParameter(“age”)); <br /><br /><b><u>About application</u></B><br/>This application contains a simple form a Java Bean and a Servlet to display the form values submitted by user using Common BeanUtils jar. <ol><li>Simple Jsp with two input boxes and a submit button.</li><li>LoginForm simple Java bean containing setter and getters of form fields.</li><li>FormUtil class used to set the Jsp form values in Java Bean.</li><li>LoginActionServlet to process from values.</li></ol><br /> <u><b>Package Structure</b></u><br /><a href="https://lh6.googleusercontent.com/-N86sLhZRuBM/TXX6qy9lh-I/AAAAAAAAAIs/KdU6nrxU5Ls/s1600/common-BeanUtil.bmp" imageanchor="1"><img border="0" src="https://lh6.googleusercontent.com/-N86sLhZRuBM/TXX6qy9lh-I/AAAAAAAAAIs/KdU6nrxU5Ls/s1600/common-BeanUtil.bmp" /></a><br /><br /> <u><b>jar needed</b></u><br /><a href="https://lh4.googleusercontent.com/-D04icwW28gg/TXX7D7sPxrI/AAAAAAAAAIw/K5evHL0Dedo/s1600/jar-needed.bmp" imageanchor="1"><img border="0" src="https://lh4.googleusercontent.com/-D04icwW28gg/TXX7D7sPxrI/AAAAAAAAAIw/K5evHL0Dedo/s1600/jar-needed.bmp" /></a><br /><br /> <u><b>index.jsp</b></u><br />index.jsp containing a form with username and password textboxes and a submit button. When user clicked on submit button LoginActionServlet called.  <pre class="brush: html"><br /><%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%><br /><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><br /><html><br /><head><br /><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><br /><title>Insert title here</title><br /></head><br /><body><br /><form action="loginActionServlet" method="post"><br /><table><br /><tr><br /><td>Username</td><br /><td><input type="text" name="userName" /></td><br /></tr><br /><tr><br /><td>Password</td><br /><td><input type="password" name="password" /></td><br /></tr><br /><tr><br /><td></td><br /><td><input type="submit" /></td><br /></tr><br /></table><br /></form><br /></body><br /></html><br /></pre> <u><b>LoginForm.java</b></u><br />LoginForm class with setters and getters of userName and password these fields names are same as form fields in jsp.  <pre class="brush: java"><br />package form;<br /><br />public class LoginForm {<br /><br />private String userName;<br />private String password;<br />public String getUserName() {<br />return userName;<br />}<br />public void setUserName(String userName) {<br />this.userName = userName;<br />}<br />public String getPassword() {<br />return password;<br />}<br />public void setPassword(String password) {<br />this.password = password;<br />}<br />}<br /></pre> <u><b>FormUtil.java</b></u><br />FormUtil class used BeanUtils class populate method for setting the form values in Java beans. I made this class a generic class so that we do not need to write same lines again and again in each servlet, just we need to pass the class of java bean and request in populate method of FormUtil. <br /><b>LoginForm loginForm = FormUtil.populate(LoginForm.class, request);</b>  <pre class="brush: java"><br />package util;<br /><br />import java.lang.reflect.InvocationTargetException;<br />import javax.servlet.http.HttpServletRequest;<br />import org.apache.commons.beanutils.BeanUtils;<br /><br />public class FormUtil {<br /><br />public static &lt;T> T populate(Class&lt;T> clazz, HttpServletRequest request) {<br />T object = null;<br />try {<br /><br />object = (T) clazz.newInstance();<br />BeanUtils.populate(object, request.getParameterMap());<br /><br />} catch (InstantiationException e) {<br />e.printStackTrace();<br />} catch (IllegalAccessException e) {<br />e.printStackTrace();<br />} catch (InvocationTargetException e) {<br />e.printStackTrace();<br />}<br />return object;<br />}<br />}<br /></pre> <u><b>LoginActionServlet.java</b></u><br />LoginActionServlet used to process the values of LoginForm and display the values.  <pre class="brush: java"><br />package action;<br /><br />import java.io.IOException;<br />import java.io.PrintWriter;<br /><br />import javax.servlet.ServletException;<br />import javax.servlet.http.HttpServlet;<br />import javax.servlet.http.HttpServletRequest;<br />import javax.servlet.http.HttpServletResponse;<br /><br />import util.FormUtil;<br />import form.LoginForm;<br /><br />public class LoginActionServlet extends HttpServlet {<br />private static final long serialVersionUID = 1L;<br /><br />protected void doPost(HttpServletRequest request,<br />HttpServletResponse response) throws ServletException, IOException {<br /><br />PrintWriter out = response.getWriter();<br /><br />LoginForm loginForm = FormUtil.populate(LoginForm.class, request);<br /><br />out.println("User name is :" + loginForm.getUserName());<br />out.println("Password is :" + loginForm.getPassword());<br /><br />}<br />}<br /></pre>   <u><b>web.xml</b></u><br />web.xml with LoginActionServlet &nbsp;servlet mapping.  <pre class="brush: xml"><br /><?xml version="1.0" encoding="UTF-8"?><br /><web-app id="WebApp_ID" version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"><br /> <display-name>DemoApp</display-name><br /> <servlet><br />  <description><br />  </description><br />  <display-name>LoginActionServlet</display-name><br />  <servlet-name>LoginActionServlet</servlet-name><br />  <servlet-class>action.LoginActionServlet</servlet-class><br /> </servlet><br /> <servlet-mapping><br />  <servlet-name>LoginActionServlet</servlet-name><br />  <url-pattern>/loginActionServlet</url-pattern><br /> </servlet-mapping><br /> <welcome-file-list><br /> <br />  <welcome-file>index.jsp</welcome-file><br />  <br /> </welcome-file-list><br /></web-app><br /></pre> Now paste these files according to package structure and run it by typing <a href="http://localhost:8080/DemoApp">http://localhost:8080/DemoApp</a></div><div dir="ltr" style="text-align: left;" trbidi="on">Hi All,  
Today I am going to discuss about a important jar commons-beanutils used by struts framework and demonstrating how to use this important jar in our servlet and jsp project.  

If you worked with struts1 or struts2 then you noticed that the ActionForm or Action (in Struts2) linked with your Jsp page or html page when you clicked on submit button the values of html form with same property name is set by calling the setter method of your POJO or FormBean automatically.  

But when we worked with only servlet and Jsp without using any MVC framework then we need to set the values using below line :-  

String userName=request.getParameter(“userName”);  

If we had 10 field on a form then we need to create 10 variables and we have to write the above line 10 times by passing the form filed name as argument.</div>

<div class="MsoNormal">Also another problem then we have to cast the filed values according to our need like  

int age=Integer.parseInt(request.getParameter(“age”));  

**<u>About application</u>**  
This application contains a simple form a Java Bean and a Servlet to display the form values submitted by user using Common BeanUtils jar.

1.  Simple Jsp with two input boxes and a submit button.
2.  LoginForm simple Java bean containing setter and getters of form fields.
3.  FormUtil class used to set the Jsp form values in Java Bean.
4.  LoginActionServlet to process from values.

<u>**Package Structure**</u>  
[![](https://lh6.googleusercontent.com/-N86sLhZRuBM/TXX6qy9lh-I/AAAAAAAAAIs/KdU6nrxU5Ls/s1600/common-BeanUtil.bmp)](https://lh6.googleusercontent.com/-N86sLhZRuBM/TXX6qy9lh-I/AAAAAAAAAIs/KdU6nrxU5Ls/s1600/common-BeanUtil.bmp)  

<u>**jar needed**</u>  
[![](https://lh4.googleusercontent.com/-D04icwW28gg/TXX7D7sPxrI/AAAAAAAAAIw/K5evHL0Dedo/s1600/jar-needed.bmp)](https://lh4.googleusercontent.com/-D04icwW28gg/TXX7D7sPxrI/AAAAAAAAAIw/K5evHL0Dedo/s1600/jar-needed.bmp)  

<u>**index.jsp**</u>  
index.jsp containing a form with username and password textboxes and a submit button. When user clicked on submit button LoginActionServlet called.

<pre class="brush: html">  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>  

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">  
<title>Insert title here</title>  

<form action="loginActionServlet" method="post">  

<table>

<tbody>

<tr>

<td>Username</td>

<td><input name="userName" type="text"></td>

</tr>

<tr>

<td>Password</td>

<td><input name="password" type="password"></td>

</tr>

<tr>

<td><input type="submit"></td>

</tr>

</tbody>

</table>

</form>

</pre>

<u>**LoginForm.java**</u>  
LoginForm class with setters and getters of userName and password these fields names are same as form fields in jsp.

<pre class="brush: java">  
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
</pre>

<u>**FormUtil.java**</u>  
FormUtil class used BeanUtils class populate method for setting the form values in Java beans. I made this class a generic class so that we do not need to write same lines again and again in each servlet, just we need to pass the class of java bean and request in populate method of FormUtil.  
**LoginForm loginForm = FormUtil.populate(LoginForm.class, request);**

<pre class="brush: java">  
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
</pre>

<u>**LoginActionServlet.java**</u>  
LoginActionServlet used to process the values of LoginForm and display the values.

<pre class="brush: java">  
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
</pre>

<u>**web.xml**</u>  
web.xml with LoginActionServlet  servlet mapping.

<pre class="brush: xml">  

<web-app id="WebApp_ID" version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">  
 <display-name>DemoApp</display-name>  
 <servlet><display-name>LoginActionServlet</display-name>  
  <servlet-name>LoginActionServlet</servlet-name>  
  <servlet-class>action.LoginActionServlet</servlet-class></servlet>   
 <servlet-mapping><servlet-name>LoginActionServlet</servlet-name>  
  <url-pattern>/loginActionServlet</url-pattern></servlet-mapping>   
 <welcome-file-list><welcome-file>index.jsp</welcome-file></welcome-file-list>   
</web-app>  
</pre>

Now paste these files according to package structure and run it by typing [http://localhost:8080/DemoApp](http://localhost:8080/DemoApp)</div>