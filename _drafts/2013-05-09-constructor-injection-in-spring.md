---
layout: post
title: Constructor Injection in Spring
date: '2013-05-09T10:00:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.276-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-573530348264517748
blogger_orig_url: http://refcard.blogspot.com/2013/05/constructor-injection-in-spring.html
---

**Employee**

<pre class="brush: java">  
package com.bloggers.spring.injection.constructor;  

public class Employee {  

 private String name;  

 public Employee(String aName) {  
  super();  
  name = aName;  
 }  

 public String getName()  
 {  
  return name;  
 }  

 public void setName(String aName)  
 {  
  name = aName;  
 }  

 @Override  
 public String toString()  
 {  
  return "Employee [name=" + name + "]";  
 }  

}  

</pre>

**applicationContext.xml**

<pre class="brush: xml">  

 <beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" <br="">xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.2.xsd">  

 <bean name="employee" class="com.bloggers.spring.injection.constructor.Employee">  
  <constructor-arg type="String" value="Sandeep"></constructor-arg> </bean></beans>  

</pre>

**Test.java**

<pre class="brush: java">  
package com.bloggers.spring.injection.constructor;  

import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  

public class Test {  

 public static void main(String[] args)  
 {  
  ApplicationContext context = new ClassPathXmlApplicationContext(  
    "/com/bloggers/spring/injection/constructor/applicationContext.xml");  
  Employee employee = (Employee) context.getBean("employee");  

  System.out.println("******Output using constructor injection******");  
  System.out.println("Employee Name :"+employee.getName());  

 }  

}  

</pre>