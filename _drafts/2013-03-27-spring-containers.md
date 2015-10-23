---
layout: post
title: Spring Containers
date: '2013-03-27T05:47:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.468-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-5494957628639425920
blogger_orig_url: http://refcard.blogspot.com/2013/03/spring-containers.html
---

In a spring application all objects (beans defined by spring) are managed by <b>spring container</b> or our application objects lives within the Spring container. Spring Container performs the all the major roles of managing the java objects like:-  <ul><li>Spring container creates the objects(beans defined by spring).</li><li>Wire theirs dependencies like if an <b>object A</b> has a member of <b>Object B</b> type then spring wire the Object B dependencies to Object A.</li><li>Manage their complete lifecycle from cradle to grave (or new to finalize() as the case may be).</li><li>The container is at the core of the Spring Framework.</li><li>Spring’s container uses dependency injection (DI) to manage the components(beans)</li></ul></br>  Spring comes with several container implementations that can be categorized into <b>two</b> distinct types.</br></br><ol><li><a href="http://static.springsource.org/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html">org.springframework.beans.factory.BeanFactory</a></br>Bean factories defined by the org.springframework.beans.factory.BeanFactory interface are the simplest of containers, providing basic support for DI. </li> <li><a href="http://static.springsource.org/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html">org.springframework.context.ApplicationContext </a></br>org.springframework.context.ApplicationContext is a sub interface of org.springframework.beans.factory.BeanFactory </br> org.springframework.context.ApplicationContext interface provides application framework services like:- <ul><li>Application contexts provides functionality for resolving text messages, including support for internationalization (I18N).</li><li>Application contexts provide a generic way to load file resources.</li><li>Application contexts can publish events to beans that are registered as listeners.</li></ul> </li></ol>