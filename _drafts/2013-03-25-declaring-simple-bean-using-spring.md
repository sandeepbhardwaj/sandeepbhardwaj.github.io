---
layout: post
title: Declaring a simple bean using spring
date: '2013-03-25T07:37:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.502-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-1410218379789293530
blogger_orig_url: http://refcard.blogspot.com/2013/03/declaring-simple-bean-using-spring.html
---
Spring configuration consists of at least one and typically more than one bean definition that the container must manage. XML-based configuration metadata shows these beans configured as **<bean></bean>**elements inside a top-level **<beans></beans>**element.  

Basic structure of XML-based configuration metadata:

<pre class="brush: java">  

 <beans xmlns="http://www.springframework.org/schema/beans" <br="">xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans  
           http://www.springframework.org/schema/beans/spring-beans.xsd">  

<bean id="..." class="...">  

</bean>  
<bean id="..." class="...">  

</bean></beans>  
</pre>

Within the **<beans>** tag we can place all of our Spring configuration, including **<bean></bean>**declarations.  

**Note :-** beans namespace isn’t the only Spring namespace.The core Spring Framework comes with **ten** configuration namespaces.  

### Example of Declaring a simple bean using spring.

Suppose, i wants to create a vehicle application contains all the information of diffrent-2 types of vehicle. The primary role of a vehicle is to move or carry passengers if vehicle is of type bus and vehicle can carry goods if its of type truck etc. Same a vehicle can have 2 to 14 ...18 etc type depending of its type.  

#### <u>Maven dependencies</u>

<pre class="brush: java">  
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">  
 <modelversion>4.0.0</modelversion>  

 <groupid>vehicle-app</groupid>  
 <artifactid>vehicle-app</artifactid>  
 <version>0.0.1-SNAPSHOT</version>  
 <packaging>jar</packaging>  

 <name>vehicle-app</name>  
 <url>http://maven.apache.org</url>  

 <properties><javac.version>1.6</javac.version>  
  <spring.version>3.2.0.RELEASE</spring.version>  
  <project.build.sourceencoding>UTF-8</project.build.sourceencoding></properties>   

 <dependencies><dependency><groupid>org.springframework</groupid>  
   <artifactid>spring-core</artifactid>  
   <version>${spring.version}</version></dependency>   
  <dependency><groupid>org.springframework</groupid>  
   <artifactid>spring-context</artifactid>  
   <version>${spring.version}</version></dependency>   
  <dependency><groupid>junit</groupid>  
   <artifactid>junit</artifactid>  
   <version>3.8.1</version>  
   <scope>test</scope></dependency></dependencies>   
</project>  

</pre>

#### <u>Vehicle Interface</u>

<pre class="brush: java">  
package com.blogger.vehicle.beans;  

public interface Vehicle {  

 public void run();  
}  

</pre>

#### <u>Car class implementation of vehicle interface</u>

<pre class="brush: java">  
package com.blogger.vehicle.beans.impl;  

import com.blogger.vehicle.beans.Vehicle;  

public class Car implements Vehicle {  

 private int speed = 20;  

 public void run()  
 {  
  System.out.println("Car is running with the speed of : " + speed  
    + " km/h");  

 }  

}  
</pre>

#### <u>vehicle.xml contacting the beans defined in spring container</u>

<pre class="brush: java">  

 <beans xmlns="http://www.springframework.org/schema/beans" <br="">xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
 xsi:schemaLocation="http://www.springframework.org/schema/beans   
 http://www.springframework.org/schema/beans/spring-beans.xsd">  

 <bean id="car" class="com.blogger.vehicle.beans.impl.Car"></bean></beans>  

</pre>

#### <u>Test class for running the vehicle application</u>

<pre class="brush: java">  
package com.blogger.vehicle;  

import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  

import com.blogger.vehicle.beans.Vehicle;  

public class TestVehicle {  

 public static void main(String[] args)  
 {  

  // ApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"services.xml",  
  // "daos.xml"});  

  ApplicationContext context = new ClassPathXmlApplicationContext(  
    "vehicle.xml");  

                //getBean() to retrieve instances of car bean  
  Vehicle car=(Vehicle) context.getBean("car");  
  car.run();  
 }  
}  

</pre>

**Note :** getBean() is used to retrieve instances of car bean.  
In this example you can see that it's pretty simple to declare a simple bean using the spring but here we did not use the full power of spring DI because we have only one bean we will explore this example later.

#### Source Code Download

Check out the complete code from the [Vehicle Application](https://2bloggers.googlecode.com/svn/branches/spring_repo/vehicle_app/vehicle_app_E01)