---
layout: post
title: Localization (i18n) in struts2
date: '2011-12-14T22:48:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- struts2
modified_time: '2015-07-18T07:53:29.919-07:00'
thumbnail: http://1.bp.blogspot.com/-q_Yuwv6RefM/TucFv3QxEdI/AAAAAAAAAKY/zOcUXs-NzU0/s72-c/pkgstructure.JPG
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-2202811431739581725
blogger_orig_url: http://refcard.blogspot.com/2011/12/localization-i18n-in-struts2.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">A Struts 2 internationalizing(i18n), localization(i10n) example to show the use of resource bundle to display the message from different languages.  
Will create a simple login screen, display the message from resource bundle via the Struts 2 UI components, and change the locale base on the selected language option.  
In Struts 2 web application you may associate a message resource property file with each Struts 2 Action class by creating a properties file with the same name as the Action class and having the .properties extension. This properties file must go in the same package as the Action class.  

<u>**About the Application**</u>  

1.  Application has links for 2 language ,On clicking the link, change the locale base on the selected language option.
    1.  English
    2.  German
2.  Also cover the use of global.properties file.

<u>**Package Structure**</u>  
[![](http://1.bp.blogspot.com/-q_Yuwv6RefM/TucFv3QxEdI/AAAAAAAAAKY/zOcUXs-NzU0/s1600/pkgstructure.JPG)](http://1.bp.blogspot.com/-q_Yuwv6RefM/TucFv3QxEdI/AAAAAAAAAKY/zOcUXs-NzU0/s1600/pkgstructure.JPG)  
<u>**Jar needed**</u>  
[![](http://3.bp.blogspot.com/-vN0KN4uYJ5k/TucGFTYKrpI/AAAAAAAAAKg/pb8m6rXg5tU/s1600/jarNeeded.JPG)](http://3.bp.blogspot.com/-vN0KN4uYJ5k/TucGFTYKrpI/AAAAAAAAAKg/pb8m6rXg5tU/s1600/jarNeeded.JPG)  
<u>**Resource Bundle search order**</u>  
Resource bundle is searched in the following order

1.  ActionClass.properties
2.  Interface.properties
3.  BaseClass.properties
4.  ModelDriven’s model
5.  package.properties
6.  Search up the i18n message key hierarchy itself
7.  Global resource properties

common used search orders will be :

1.  ActionClass.properties,
2.  package.properties and
3.  Global resource properties.

If a com.mycomp.action.LoginAction want to get a message via resource bundle, it will search

1.  com.mycomp.action.LoginAction.properties (found, exit, else next)
2.  com.mycomp.action.package.properties (found,exit, else next)
3.  com.mycomp.package.properties (found exit, else next)  
    ....keep find package.properties in every parent directory all the way to the root directory
4.  Find the global resource properties if you configure it in your application

<u>**web.xml**</u>  

<pre class="brush: xml">  

<web-app id="WebApp_ID" version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">  
 <display-name>Struts2Practice</display-name>   
<filter>  
 <filter-name>struts2</filter-name>  
 <filter-class>org.apache.struts2.dispatcher.FilterDispatcher</filter-class>  
</filter>  
<filter-mapping>  
 <filter-name>struts2</filter-name>  
 <url-pattern>/*</url-pattern>  
</filter-mapping>  
</web-app>  
</pre>

<u>**struts.xml**</u>  

<pre class="brush: xml">  
    "-//Apache Software Foundation//DTD Struts Configuration 2.0//EN"  
    "http://struts.apache.org/dtds/struts-2.0.dtd">  
 <struts><constant name="struts.devMode" value="true" />  
 <constant name="struts.custom.i18n.resources" value="global" />   
 <package name="default" namespace="/" extends="struts-default">  
  <action name="helloworld" class="com.mycomp.action.HelloWorld">  
   <result name="success">/helloworld.jsp</result>  
  </action>   
  <action name="login" class="com.mycomp.action.LoginAction">  
   <result>/login.jsp</result>  
  </action>      
  <action name="register" class="com.mycomp.action.UserRegisterAction">  
   <result>/userRegistration.jsp</result>  
  </action>      
 </package></struts>  
</pre>

<u>**helloworld.jsp**</u>  
In the commands section of the page has 2 links:-  

1.  User Registration
2.  Login

and Languages section has 2 links for language:-  

1.  English
2.  German

<pre class="brush: html">  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>  
<%@ taglib prefix="s" uri="/struts-tags" %>  
<html>  
    <head>  
        <title>Hello World!</title>  
    </head>  
    <body>  
        <h2>Welcome ;-)<s:property value="message"/></h2>  
        <h2>Commands:</h2>  
        <ul>  
         <li><a href="<s:url action="register"/>">New User</a></li>  
         <li><a href="<s:url action="login"/>">Login</a></li>  
        </ul>  
        <h2>Languages</h2>  
        <ul>  
      <li>  
          <s:url id="url" action="login">  
              <s:param name="request_locale">en</s:param>  
          </s:url>  
          <s:a href="%{url}">English</s:a>  
      </li>  
      <li>  
          <s:url id="url" action="login">  
              <s:param name="request_locale">de</s:param>  
          </s:url>  
          <s:a href="%{url}">German</s:a>  
      </li>  
  </ul>  
    </body>  
</html>  
</pre>

Struts2 provide the <s:url/> tag to create links.  
helloworld.jsp demonstrate the 2 different ways to use the tag :-  
<a href="<s:url action="Register"/>">New User</a>  
When the link is rendered, the tag will automatically append the appropriate extension.  
The tag will also URL-encode the link with the Java session ID, if needed, so that the Java session can be retained across requests.  

<pre class="brush: html">  
<s:url id="url" action="Welcome">   
 <s:param name="request_locale">en</s:param> </s:url>   
<s:a href="%{url}">English</s:a>  
</pre>

The param tag will add the parameter "?request_locale=en" to the Welcome Action URL, and store it under the name "url". The tag then injects the "url" reference into the hyperlink.  
<u>**HelloWorld.java**</u>  

<pre class="brush: java">  
package com.mycomp.action;  

import com.opensymphony.xwork2.ActionSupport;  

public class HelloWorld extends ActionSupport{  
 private static final long serialVersionUID = 1L;  
 public static final String MESSAGE = "In the Struts2 World !!";  
 private String message;  

 public String execute()  
 {  
  setMessage(MESSAGE);  
  return "success";  
 }  

 public String getMessage() {  
  return message;  
 }  

 public void setMessage(String message) {  
  this.message = message;  
 }   
}  
</pre>

<u>**login.jsp**</u>  

<pre class="brush: html">  
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="s" uri="/struts-tags"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
<title>Login</title>  
</head>  
<body>  
<s:form action="login">   
 <s:textfield key="login.username"  />  
 <s:password key="login.password" />   
 <s:submit key="login.submit"  />   
</s:form>  
</body>  
</html>  
</pre>

In Struts 2 “key” attribute can be used in the [textfield](http://struts.apache.org/2.2.1/docs/textfield.html) tag to instruct the framework what value to use for the textfield's name and label attributes.  
Instead of providing those attributes and their values directly, you can just use the key attribute.  
→ textfield tag  
Instead of specifying the name and label attributes you can just use the key attribute.  
→ textfield tag with key attribute  
To enable the key attribute to find the properties file, the display of the view page must be the result of executing a Struts 2 Action class.  
So, let see the LoginAction.java.

<pre class="brush: java">  
package com.mycomp.action;  
import com.opensymphony.xwork2.ActionSupport;  

public class LoginAction extends ActionSupport{  
 /**  
  *   
  */  
 private static final long serialVersionUID = 1L;  
 private String username;  
 private String password;  

 public String execute()  
 {  
  return "success";  
 }   

 public String getUsername() {  
  return username;  
 }  
 public void setUsername(String username) {  
  this.username = username;  
 }  
 public String getPassword() {  
  return password;  
 }  
 public void setPassword(String password) {  
  this.password = password;  
 }  

}  
</pre>

Make sure the properties file are named as country specified code.  
<u>**LoginAction.properties**</u>  

<pre class="brush: java">  
# LoginAction : english language  
login.username = Username  
login.password = Password  
login.submit = Submit  
</pre>

<u>**LoginAction_de.properties**</u>  

<pre class="brush: java">  
# Login action : German language   
login.username = Benutzername  
login.password = Kennwort  
login.submit = Einreichen  
</pre>

<u>**userRegistration.jsp**</u>  

<pre class="brush: html">  
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="s" uri="/struts-tags" %>      
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
<title>Register New User</title>  
</head>  
<body>  
<s:form>   
 <s:textfield key="global.username" name="username" />  
 <s:password key="global.password" name="password"/>  
 <s:password key="global.conpassword" name="conpassword"/>   
 <s:submit key="global.submit" name="submit" />   
</s:form>  
</body>  
</html>  
</pre>

<u>**UserRegistrationAction.java**</u>  

<pre class="brush: java">  
package com.mycomp.action;  

import com.opensymphony.xwork2.ActionSupport;  

public class UserRegisterAction extends ActionSupport {  
 public String execute()  
 {  
  return "success";  
 }  
}  
</pre>

<u>**Global.properties**</u>  

<pre class="brush: java">  
#Global messages  
global.username = Username  
global.password = Password  
global.conpassword = Confirm Password  
global.submit = Submit  
</pre>

The keys and values defined in that property file will be available to all the view pages that are rendered after executing an Action class.</div>

To inform the Struts 2 framework about the global.properties file add the follow node to struts.xml after the constant name="struts.devmode" node.  

<pre class="brush: html">  
<constant name="struts.custom.i18n.resources" value="global" />  
</pre>

Now run the application:  
[http://localhost:8081/Struts2Practice/helloworld.action](http://localhost:8081/Struts2Practice/helloworld.action)