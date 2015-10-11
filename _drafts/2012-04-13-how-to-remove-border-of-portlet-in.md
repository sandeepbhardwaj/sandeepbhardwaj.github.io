---
layout: post
title: How to remove border of portlet in Liferay 6.0.
date: '2012-04-12T23:40:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Liferay
modified_time: '2015-07-18T07:53:29.864-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-7692590526389179117
blogger_orig_url: http://refcard.blogspot.com/2012/04/how-to-remove-border-of-portlet-in.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">There are many ways of doing below are the two solutions:  
Solution 1 : Add the <portlet-prefrences> tag  in portlet.xml  

<pre class="brush: xml">  
  <portlet-info><title>xyz</title>  
           <short-title>xyz</short-title>  
           <keywords>xyz</keywords></portlet-info>   
  <portlet-preferences><preference><name>portlet-setup-show-borders</name>  
           <value>false</value></preference></portlet-preferences>   
  <security-role-ref><role-name>administrator</role-name></security-role-ref>   
</pre>

Solution 2 : Second solution add the <use-default-template/> with false value in liferay-portlet.xml  

<pre class="brush: xml">  
<portlet>  
       <portlet-name>xyz</portlet-name>  
       <icon>/icon.png</icon>  
       <use-default-template>false</use-default-template>  
       <instanceable>false</instanceable>  
       <header-portlet-css>/css/main.css</header-portlet-css>  
       <footer-portlet-javascript>/js/main.js</footer-portlet-javascript>  
       <css-class-wrapper>xyz-portlet</css-class-wrapper>  
       <add-default-resource>true</add-default-resource>  
</portlet>  
</pre>

Hope this solution will help you.  
</div>