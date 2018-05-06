---
layout: post
title: Un Deploy Ext plugin in liferay
date: 2011-11-28 20:35:00 +5:30
author: Sandeep Bhardwaj
tags: [Liferay]
---

<h3>Un Deploy Ext Plugin in Lifeay 6.0</h3>

Un deployment of ext plugin in liferay is a tricky task, so i found a simple solution for doing this instead of deleting all the ext files from tomcat. I made a bat file for this this bat file remove all the ext plugin related files from your tomcat directory.  

``` bash
@echo off  
set app_name=%1  
if "%app_name%" == "" goto end   
set tomcat_home=<Your tomcat home direcory>  

rmdir /S /Q %tomcat_home%\temp   
rmdir /S /Q %tomcat_home%\webapps\%app_name%-ext   
rmdir /S /Q %tomcat_home%\webapps\ROOT\html\portlet\ext   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\classes\portal-ext.properties   
del /S /Q %tomcat_home%\lib\ext\ext-%app_name%-ext-service.jar   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\lib\ext-%app_name%-ext-util-bridges.jar   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\lib\ext-%app_name%-ext-util-taglib.jar   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\lib\ext-%app_name%-ext-util-java.jar   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\lib\ext-%app_name%-ext-impl.jar   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\ext-%app_name%-ext.xml   
del /S /Q %tomcat_home%\webapps\ROOT\WEB-INF\tiles-defs-ext.xml   

:end   
``` 

just change the tomcat_home with your tomcat home directory and paste the code in a notepad and save as undeployment.bat .  
For running the bat pass your ext application name (with our ext) as command line argument.  

``` bash
C:/>undeployment.bat <application name>  
```
