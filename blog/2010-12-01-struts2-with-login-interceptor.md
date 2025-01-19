---
  layout: post
  title: Struts2 with login interceptor
  published: true
  tags: [Java , Struts2 ]
  date: 2010-12-01 19:55:00 +5:30
  keywords: [Struts2, Interceptor, login application]
  summary: "Example of Struts2 Interceptor, Complete example of Struts2 Interceptor, Download Struts2 Interceptor example, How to use interceptor in login application, How to create complete login application using struts2"
---

Hi All,

This is my first blog and this blog is for those who are not beginners because I am not going to explain HelloWorld application here. So if you are a beginner of Struts2 then follow the [link](http://www.mkyong.com/).

<h3>About application</h3>

It’s an application of Struts 2 with LoginInterceptor this will perform these tasks:-


1. Check user exist in session or not.
2. Runs before every action to check .If some one try to access direct url of welcome page and not present in session then it will redirect towards login page.
3. If user already in session then call the action called by user.
4. If session time out and user clicks on any link, then also redirect towards login page.


<h3>Package Structure</h3>



<h3>jar required</h3>



<h3>web.xml</h3>

web.xml with struts2 configuration and defining session time out 1 min.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" id="WebApp_ID" version="2.5">
  <display-name>login-app</display-name>
  <filter>
    <filter-name>struts2</filter-name>
    <filter-class>org.apache.struts2.dispatcher.FilterDispatcher</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>struts2</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
  <session-config>
    <session-timeout>1</session-timeout>
  </session-config>
  <welcome-file-list>
    <welcome-file>login.jsp</welcome-file>
  </welcome-file-list>
</web-app>  
```

<h3>struts.xml</h3>
Here we configure our custom interceptor named LoginInterceptor defining loginStack as default stack.

``` xml  
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE struts PUBLIC
   "-//Apache Software Foundation//DTD Struts Configuration 2.0//EN"
   "http://struts.apache.org/dtds/struts-2.0.dtd">
<struts>
	<constant name="struts.devMode" value="true" />
	<package extends="struts-default" name="default" namespace="/">

		<interceptors>
			<interceptor class="com.blog.struts.interceptor.LoginInterceptor"
				name="loginInterceptor" />
			<interceptor-stack name="loginStack">
				<interceptor-ref name="loginInterceptor" />
				<interceptor-ref name="defaultStack" />
			</interceptor-stack>
		</interceptors>

 		<default-interceptor-ref name="loginStack"/>

		<global-results>
			<result name="login">login.jsp</result>
		</global-results>

		<action class="com.blog.struts.action.LoginAction"
			name="loginAuthenticaion">
			<result  name="login-success">/WEB-INF/pages/welcome.jsp</result>
			<result name="input">login.jsp</result>
		</action>

		<action class="com.blog.struts.action.ProfileAction"
			name="profile">
			<result name="success">/WEB-INF/pages/profile.jsp</result>
		</action>

		<action class="com.blog.struts.action.LogoutAction"
			name="logout">
			<result name="logout">login.jsp</result>
		</action>

	</package>
</struts>
```

<h3>LoginInterceptor.java</h3>

LoginInterceptor class extends AbstractInterceptor and checking user present in session or not.

``` java
package com.blog.struts.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.StrutsStatics;

import com.blog.struts.action.LoginAction;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class LoginInterceptor extends AbstractInterceptor implements
		StrutsStatics {

	private static final Log log = LogFactory.getLog(LoginInterceptor.class);
	private static final String USER_HANDLE = "loggedInUser";

	public void init() {
		log.info("Intializing LoginInterceptor");
	}

	public void destroy() {
	}

	public String intercept(ActionInvocation invocation) throws Exception {

		final ActionContext context = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) context
				.get(HTTP_REQUEST);
		HttpSession session = request.getSession(true);

		// Is there a "user" object stored in the user's HttpSession?
		Object user = session.getAttribute(USER_HANDLE);
		if (user == null) {
			// The user has not logged in yet.

			/* The user is attempting to log in. */
			if (invocation.getAction().getClass().equals(LoginAction.class))
			{
				return invocation.invoke();
			}
			return "login";
		} else {
			return invocation.invoke();
		}
	}

}
```

<h3>LoginAction.java</h3>

LoginAction class with simple bussiness logic you can login with any username and password but cannot left blank the mandatory fields.

``` java  
package com.blog.struts.action;

import org.apache.commons.lang.xwork.StringUtils;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

public class LoginAction extends ActionSupport {
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

	// all struts logic here
	public String execute() {

		ServletActionContext.getRequest().getSession().setAttribute("loggedInUser", userName);
		return "login-success";

	}

	// simple validation
	public void validate() {
		if (StringUtils.isNotEmpty(userName)
				|| StringUtils.isNotEmpty(password)) {
			addActionMessage("You are valid user!");

		} else {
			addActionError("Username and Password can't be blanked");
		}

	}
}
```

<h3>LogoutAction.java</h3>

LogutAction class calls when user click on logout link.

``` java
package com.blog.struts.action;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

public class LogoutAction extends ActionSupport {

	// all struts logic here
	public String execute() {

		ServletActionContext.getRequest().getSession().invalidate();
		addActionMessage("You are successfully logout!");
		return "logout";

	}
}
```

<h3>ProfileAction.java</h3>

ProfileAction executes when we click on profile link on welcome page. If we tried to call the profile action without login then login interceptor redirect user to login page. This is the whole purpose of using the login interceptor.

``` java
package com.blog.struts.action;

import com.opensymphony.xwork2.ActionSupport;

public class ProfileAction extends ActionSupport {

	// all struts logic here
	public String execute() {

		return "success";

	}
}  
```


<h3>Login.jsp</h3>

``` html  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Login page</title>

<link rel="stylesheet" type="text/css" href="css/style.css" />

</head>
<body>

	<s:if test="hasActionErrors()">
		<div class="errors">
			<s:actionerror />
		</div>
	</s:if>
	<s:if test="hasActionMessages()">
		<div class="welcome">
			<s:actionmessage />
		</div>
	</s:if>

	<s:form action="loginAuthenticaion.action">
		<s:hidden name="loginAttempt" value="%{'1'}" />
		<s:textfield label="UserName" name="userName" />
		<s:password label="Password" name="password" />

		<s:submit label="Login" name="submit" />
	</s:form>
</body>
</html>
```

<h3>welcome.jsp</h3>

``` html  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@page import="java.util.Date"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Welcome page</title>

<link rel="stylesheet" type="text/css" href="css/style.css" />

</head>

<body>
	<div class="content">
		<div style="float: right;">
		<a  href="profile">Profile</a> | <a href="logout">logout</a>
		</div>

		</br>
		<h3>Struts 2 with Login Interceptor</h3>

		<s:if test="hasActionMessages()">
			<div class="welcome">
				<s:actionmessage />
			</div>
		</s:if>

		<h4>
			Hello :
			<%=session.getAttribute("loggedInUser")%>
			Login time : <%=new Date()%></h4>
	</div>

</body>
</html>
```

<h3>profile.jsp</h3>

``` html  
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Profile page</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>
	<div class="content">

		<div style="float: right;">
			<a href="logout">logout</a>
		</div>

		</br>
		<h3>Struts 2 with Login Interceptor</h3>

		<p>
			This is profile page . This page can't be accessed by direct access <a
				href="http://localhost:8080/login-app/profile.action">http://localhost:8080/login-app/profile.action</a>
			if there is no valid used then it will redirect to login page.

		</p>
	</div>
</body>
</html>
```

<h3>style.css</h3>

``` css
.errors {
 background-color: #FFCCCC;
 border: 1px solid #CC0000;
 width: 400px;
 margin-bottom: 8px;
}

.errors li {
 list-style: none;
}

.welcome {
 background-color: #DDFFDD;
 border: 1px solid #009900;
 width: 300px;
}

.welcome li {
 list-style: none;
}

.content{
 padding: 5px;
 height: 400px;

 border: 2px solid #d0d1d0;
}
```

Now paste these files according to package structure and run it by typing [http://localhost:8080/LoginApp](http://localhost:8080/LoginApp).

If you tries to hit direct url without login like [http://localhost:8080/LoginApp/loginAuthenticaion](http://localhost:8080/LoginApp/loginAuthenticaion) then it will redirect towards login page.

Next time, i will try to write some more interesting you can also give me some suggestion about new topics.

Thanks,
Have a great day !!!
