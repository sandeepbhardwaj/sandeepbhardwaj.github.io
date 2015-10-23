---
layout: post
title: Usage of LanguageUtil class in liferay
date: '2012-04-27T00:59:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Liferay
modified_time: '2015-07-18T07:53:29.818-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-1102382265379990235
blogger_orig_url: http://refcard.blogspot.com/2012/04/usage-of-languageutil-class-in-liferay.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">For fetching a property from .properties file depending upon locale in liferay use the <b>get()</b> method of <b>com.liferay.portal.kernel.language.LanguageUtil</b> class of liferay .It will automatically pick the correct locate file and return the value from that property file.</br> There are 6 overloaded get methods in <b>LanguageUtil</b> class. <br /> <pre class="brush: java"><br />get(Locale locale, String key): String – LanguageUtil<br /><br />get(Locale locale, String key, String defaultValue) String – LanguageUtil<br /><br />get(PageContext pageContext, String key) String – LanguageUtil<br /><br />get(PageContext pageContext, String key, String defaultValue) String – LanguageUtil<br /><br />get(PortletConfig portletConfig, Locale locale, String key) String – LanguageUtil<br /><br />get(PortletConfig portletConfig, Locale locale, String key, String defaultValue) String – LanguageUtil<br /></pre> <u><b>Usage</b></u><br/><pre class="brush: html"><br /><%@page import="com.liferay.portal.kernel.language.LanguageUtil"%><br /><%<br />String propertyValue=LanguageUtil.get(pageContext, "property_name", new String("NOT_FOUND"));<br />%><br /></pre>  Argument of get method<br/>1<sup>st</sup>: page context.<br/>2<sup>nd</sup>: property name whose value to be fetched.<br/>3<sup>rd</sup>: default value return by get method, if property not found.<br/> </div>