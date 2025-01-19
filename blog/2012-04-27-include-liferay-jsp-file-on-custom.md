---
layout: post
title: Include liferay jsp file on custom portlet
date: 2012-04-27 22:30:00 +5:30
author: Sandeep Bhardwaj
tags: [Liferay]
---

If you wants to include a custom jsp contains a common functionality to all your portlets then follow the below steps.  

*   Create a Liferay hook >>  Custom Jsps and create a jsp under /htm/common/<your jsp file>.jsp
*   Now simply use the below code for include the jsp on portlet pages.

``` bash
<%@ taglib uri="http://liferay.com/tld/util" prefix="liferay-util"%>  

<liferay-util:include page="/html/common/common_error.jsp">  
</liferay-util:include>

``` 
