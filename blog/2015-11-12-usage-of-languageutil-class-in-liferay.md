---
layout: post
title: Usage of LanguageUtil class in Liferay
author: Sandeep Bhardwaj
published: true
date: 2015-11-12 13:00:00 +5:30
tags: [Liferay]
keywords: [LanguageUtil, Liferay]
summary: "How to read property file in Liferay, Usage of LanguageUtil class in Liferay"
---

For fetching properties based on locale from <code>properties</code> file in liferay is easy. Use <code>get()</code> method of <code>com.liferay.portal.kernel.language.LanguageUtil</code> class of liferay. It will automatically pick the correct locale file and return the property value.  

There are 6 overloaded get methods in **LanguageUtil** class.  

``` java
get(Locale locale, String key): String – LanguageUtil  
get(Locale locale, String key, String defaultValue) String – LanguageUtil  
get(PageContext pageContext, String key) String – LanguageUtil  
get(PageContext pageContext, String key, String defaultValue) String – LanguageUtil  
get(PortletConfig portletConfig, Locale locale, String key) String – LanguageUtil  
get(PortletConfig portletConfig, Locale locale, String key, String defaultValue) String – LanguageUtil
```

<h3>Usage</h3> 

``` html  
<%@page import="com.liferay.portal.kernel.language.LanguageUtil"%>  
<%  
String propertyValue=LanguageUtil.get(pageContext, "property_name", new String("NOT_FOUND"));  
%>  
```

Argument of get method :- 

1<sup>st</sup>: page context.  
2<sup>nd</sup>: property name whose value to be fetched.  
3<sup>rd</sup>: default value return by get method, if property not found.  
