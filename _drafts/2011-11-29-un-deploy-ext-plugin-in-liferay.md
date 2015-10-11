---
layout: post
title: Un Deploy Ext plugin in liferay
date: '2011-11-28T21:56:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- Liferay
modified_time: '2015-07-18T07:53:29.965-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-7166529642694002825
blogger_orig_url: http://refcard.blogspot.com/2011/11/un-deploy-ext-plugin-in-liferay.html
---

<div dir="ltr" style="text-align: left;" trbidi="on"><u><span style="color: #003300; font-family: &quot;Comic Sans MS&quot;;"><span style="font-size: large;">Un Deploy Ext Plugin in Lifeay 6.0  
</span></span></u>  

Un deployment of ext plugin in liferay is a tricky task, so i found a simple solution for doing this instead of deleting all the ext files from tomcat. I made a bat file for this this bat file remove all the ext plugin related files from your tomcat directory.  

<pre class="cpp" name="code">@echo off  
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
</pre>

just change the tomcat_home with your tomcat home directory and paste the code in a notepad and save as undeployment.bat .  
For running the bat pass your ext application name (with our ext) as command line argument.  

C:/>undeployment.bat <application name>  

</div>