---
layout: post
title: Include liferay jsp file on custom portlet
date: '2012-04-27T00:26:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Liferay
modified_time: '2015-07-18T07:53:29.829-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-3603780215418546873
blogger_orig_url: http://refcard.blogspot.com/2012/04/include-liferay-jsp-file-on-custom.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">If you wants to include a custom jsp contains a common functionality to all your portlets then follow the below steps.  

*   Create a Liferay hook >>  Custom Jsps and create a jsp under /htm/common/<your jsp file>.jsp
*   Now simply use the below code for include the jsp on portlet pages.

<pre class="brush: html">  
<%@ taglib uri="http://liferay.com/tld/util" prefix="liferay-util"%>  

<liferay-util:include page="/html/common/common_error.jsp">  
</liferay-util:include></pre>

</div>