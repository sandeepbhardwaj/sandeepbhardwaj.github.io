---
layout: post
title: Spring AOP with custom annotation validating method arguments
date: '2012-05-07T03:40:00.000-07:00'
author: Sandeep Bhardwaj
tags:[Annotation, AOP, Spring]
---

I am going to use the custom annotaion and spring AOP for checking the method argument before calling the actual method.  
Scenario :- I have a method save(Employee employee) in my service class which takes employee object as an argument. If any field of employee is null then i do not want to execute save method.  
<h3>Annotation</h3>  

{% highlight java %}   
package com.bloggers.annotation;  

import java.lang.annotation.ElementType;  
import java.lang.annotation.Retention;  
import java.lang.annotation.RetentionPolicy;  
import java.lang.annotation.Target;  

@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface NotNullAndNotEmpty {  

}  
{% endhighlight %}

<h3>Model</h3>  

{% highlight java %}   
package com.bloggers.model;  

public class Employee  
{  
 private String name;  
 private String address;  

 public Employee()  
 {  

 }  

 public Employee(String name, String address)  
 {  
  super();  
  this.name = name;  
  this.address = address;  
 }  

 public String getName()  
 {  
  return name;  
 }  

 public void setName(String name)  
 {  
  this.name = name;  
 }  

 public String getAddress()  
 {  
  return address;  
 }  

 public void setAddress(String address)  
 {  
  this.address = address;  
 }  

}  
{% endhighlight %}

<h3>EmployeeService</h3>  

{% highlight java %}   
package com.bloggers.service;  

import com.bloggers.annotation.NotNullAndNotEmpty;  
import com.bloggers.model.Employee;  

public class EmployeeService  
{  

 @NotNullAndNotEmpty  
 public void save(Employee employee)  
 {  
  System.out.println("EmployeeService.save() successfully");  
 }  
}  
{% endhighlight %}

<h3>BeanMethodValidator</h3>  

{% highlight java %}   
package com.bloggers.validate;  

import com.bloggers.annotation.NotNullAndNotEmpty;  

import java.lang.reflect.Field;  
import java.util.ArrayList;  
import java.util.List;  

import org.aopalliance.intercept.MethodInterceptor;  
import org.aopalliance.intercept.MethodInvocation;  

public class BeanMethodValidator implements MethodInterceptor  
{  
 @Override  
 public Object invoke(MethodInvocation methodInvocation) throws Throwable  
 {  
  List<String> errors = new ArrayList<String>();  
  NotNullAndNotEmpty annotations = (NotNullAndNotEmpty) methodInvocation  
    .getMethod().getAnnotation(NotNullAndNotEmpty.class);  
  if (annotations != null)  
  {  
   for (Object argument : methodInvocation.getArguments())  
   {  
    Field[] fields = argument.getClass().getDeclaredFields();  
    for (Field field : fields)  
    {  
     field.setAccessible(true);  
     try  
     {  
      if (field.get(argument) == null)  
      {  
       errors.add(field.getName() + " is null or empty");  
      }  
     }  
     catch (Exception e)  
     {  
      e.printStackTrace();  
     }  
    }  
   }  
  }  
  try  
  {  
   //if no error found execute the original method  
   if (errors.isEmpty())  
   {  
    Object result = methodInvocation.proceed();  
    return result;  
   }  
   else  
   {  
    System.out.println("error :"+errors);  
    return null;  
   }  

  }  
  catch (IllegalArgumentException e)  
  {  

   throw e;  
  }  
 }  
}  
{% endhighlight %}

<h3>Configuration:- employee.xml</h3>  

{% highlight xml %}  
 <beans xmlns="http://www.springframework.org/schema/beans" <br="">xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
 xsi:schemaLocation="http://www.springframework.org/schema/beans  
http://www.springframework.org/schema/beans/spring-beans-2.5.xsd">  

 <bean id="employee" class="com.bloggers.model.Employee"></bean>   

 <bean id="employeeService" class="com.bloggers.service.EmployeeService"></bean>   

 <bean id="beanMethodValidator" class="com.bloggers.validate.BeanMethodValidator"></bean>   

 <bean id="bloggerProxy" class="org.springframework.aop.framework.ProxyFactoryBean">  
  <property name="target" ref="employeeService"><property name="interceptorNames"><list><value>beanMethodValidator</value></list></property></property> </bean></beans>  
{% endhighlight %}

<h3>Run application :- Test class</h3>  

{% highlight java %}   
package com.bloggers.common;  

import com.bloggers.model.Employee;  
import com.bloggers.service.EmployeeService;  

import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  

public class Test  
{  
 public static void main(String[] args)  
 {  
  ApplicationContext appContext = new ClassPathXmlApplicationContext(  
    new String[] { "employee.xml" });  

  Employee employee = (Employee) appContext.getBean("employee");  

  EmployeeService employeeService = (EmployeeService) appContext  
    .getBean("bloggerProxy");  

  employeeService.save(employee);  
 }  
}  
{% endhighlight %}

<h3>pom.xml</h3>  

{% highlight xml %}  
 <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" <br="">xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">  
 <modelversion>4.0.0</modelversion>  
 <groupid>com.bloggers.common</groupid>  
 <artifactid>SpringExamples</artifactid>  
 <packaging>jar</packaging>  
 <version>1.0-SNAPSHOT</version>  
 <name>CustomValidator</name>  
 <url>http://maven.apache.org</url>  
 <dependencies><dependency><groupid>junit</groupid>  
   <artifactid>junit</artifactid>  
   <version>3.8.1</version>  
   <scope>test</scope></dependency>   

  <dependency><groupid>org.springframework</groupid>  
   <artifactid>spring</artifactid>  
   <version>2.5.6</version></dependency>   

  <dependency><groupid>cglib</groupid>  
   <artifactid>cglib</artifactid>  
   <version>2.2.2</version></dependency></dependencies></project>  
{% endhighlight %}