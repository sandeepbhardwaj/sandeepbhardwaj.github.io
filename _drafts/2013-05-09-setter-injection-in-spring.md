---
layout: post
title: Setter Injection in Spring
date: '2013-05-09T10:04:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.242-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-2431352817999532518
blogger_orig_url: http://refcard.blogspot.com/2013/05/setter-injection-in-spring.html
---

<b>Employee.java </b><pre class="brush: java"><br />package com.bloggers.spring.injection.setter;<br /><br />public class Employee {<br /><br /> private String name;<br /><br /> /*public Employee(String aName) {<br />  super();<br />  name = aName;<br /> }*/<br /><br /> public String getName()<br /> {<br />  return name;<br /> }<br /><br /> public void setName(String aName)<br /> {<br />  name = aName;<br /> }<br /><br /> @Override<br /> public String toString()<br /> {<br />  return "Employee [name=" + name + "]";<br /> }<br /><br />}<br /><br /></pre> <b>applicationContext.xml</b><pre class="brush: xml"><br /><?xml version="1.0" encoding="UTF-8"?><br /><beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"<br /> xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.2.xsd"><br /><br /><br /> <bean name="employee" class="com.bloggers.spring.injection.setter.Employee"><br />  <property name="name" value="Sandeep"></property><br /> </bean><br /><br /></beans><br /></pre> <b>Test.java</b><pre class="brush: java"><br />package com.bloggers.spring.injection.setter;<br /><br />import org.springframework.context.ApplicationContext;<br />import org.springframework.context.support.ClassPathXmlApplicationContext;<br /><br />public class Test {<br /><br /> public static void main(String[] args)<br /> {<br />  ApplicationContext context = new ClassPathXmlApplicationContext(<br />    "/com/bloggers/spring/injection/setter/applicationContext.xml");<br />  Employee employee = (Employee) context.getBean("employee");<br /><br />  System.out.println("******Output using setter injection******");<br />  System.out.println("Employee Name :"+employee.getName());<br /><br /> }<br /><br />}<br /></pre>