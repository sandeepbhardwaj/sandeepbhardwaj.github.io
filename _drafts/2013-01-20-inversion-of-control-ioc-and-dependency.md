---
layout: post
title: Inversion of Control (IoC) and Dependency Injection in Spring
date: '2013-01-20T00:56:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.548-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-4405172952401113914
blogger_orig_url: http://refcard.blogspot.com/2013/01/inversion-of-control-ioc-and-dependency.html
---

Originally, Dependency Injection(DI) was known by another name : **Inversion Of Control(IOC)**. In **2004 Martin Fowler** suggest a new phrase Dependency Injection as better term than IOC.

#### <u>Definition</u>

**Dependency Injection :-** Dependecy injection invloves giving or providing an object all its dependencies.Object does not need to acquire all its dependencies by its own.  

#### <u>Problem without DI</u>

Traditionally, each object in an application is responsible for obtaining all its dependencies by its own. This can lead to highly coupled and hard-to-test code.  

#### <u>Benefit of DI</u>

The key benefit of DI is loose coupling. If an object only knows about its dependencies by their interface (not their implementation or how they were instantiated) then the dependency can be swapped out with a different implementation without the depending object knowing the difference.  

### Dependency Injection/IOC in Spring

Spring Framework implementation of the Inversion of Control (IoC) principle. IoC is also known as dependency injection (DI).

The IOC container manages java objects – from instantiation to destruction – through its BeanFactory.  

*   Java components that are instantiated by the IoC container are called beans.
*   IoC container manages a bean's scope
    *   lifecycle events
    *   and any AOP features for which it has been configured and coded.

**Dependency Injection :-** A process where object define their dependencies/relationship with other objects. Through

*   Constructor argument
*   arguments to a factory method
*   properties that are set on the object instance after it is constructed or returned from a factory method

is known as Inversion of Control (IoC).**IOC** is also known as **dependency injection (DI)**.

DI exists in **two** major variants

*   Constructor-based dependency injection
*   and Setter-based dependency injection.

**org.springframework.beans** and **org.springframework.context** packages are the basis for Spring Framework's IoC container.  

[BeanFactory](http://static.springsource.org/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html) interface provides the configuration framework and basic functionality.  
[ApplicationContext](http://static.springsource.org/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html) is a sub-interface of BeanFactory.  
It adds easier integration with Spring's AOP features; message resource handling (for use in internationalization), event publication; and application-layer specific contexts such as the WebApplicationContext for use in web applications.

**References:-**

*   [Spring Reference](http://static.springsource.org/spring/docs/3.2.x/spring-framework-reference/html/beans.html)