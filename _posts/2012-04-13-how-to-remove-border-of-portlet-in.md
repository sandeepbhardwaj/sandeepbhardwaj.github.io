---
layout: post
title: How to remove border of portlet in Liferay 6.0.
date: 2012-04-12 23:40:00 +5:30
author: Sandeep Bhardwaj
tags: [Liferay]
---

There are many ways of doing below are the two solutions:  
Solution 1 : Add the <code><portlet-prefrences></code> tag  in portlet.xml  

``` xml  
<portlet-info>
  <title>xyz</title>
  <short-title>xyz</short-title>
  <keywords>xyz</keywords>
</portlet-info>
<portlet-preferences>
  <preference>
    <name>portlet-setup-show-borders</name>
    <value>false</value>
  </preference>
</portlet-preferences>
<security-role-ref>
  <role-name>administrator</role-name>
</security-role-ref>     
``` 

Solution 2 : Second solution add the <use-default-template/> with false value in liferay-portlet.xml  

``` xml   
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
``` 

Hope this solution will help you.