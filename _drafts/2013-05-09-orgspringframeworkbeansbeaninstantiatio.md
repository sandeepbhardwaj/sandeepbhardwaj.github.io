---
layout: post
title: ! 'org.springframework.beans.BeanInstantiationException: Could not instantiate
  bean class'
date: '2013-05-09T09:48:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Spring
modified_time: '2015-07-18T07:53:29.288-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-3651559425200169901
blogger_orig_url: http://refcard.blogspot.com/2013/05/orgspringframeworkbeansbeaninstantiatio.html
---

If we do not have default constructor in our class in spring and we are trying to create a bean using spring container then we will get the below exception. <br/> <pre><br />Caused by: org.springframework.beans.BeanInstantiationException: Could not instantiate bean class [com.myPkg.MyBean]: No default constructor found; nested exception is java.lang.NoSuchMethodException: com.myPkg.MyBean.<init>()<br /> at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:83)<br /> at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:1004)<br /> ... 13 more<br />Caused by: java.lang.NoSuchMethodException: com.myPkg.MyBean.<init>()<br /> at java.lang.Class.getConstructor0(Class.java:2706)<br /> at java.lang.Class.getDeclaredConstructor(Class.java:1985)<br /> at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:78)<br /> ... 14 more<br /><br /></pre>