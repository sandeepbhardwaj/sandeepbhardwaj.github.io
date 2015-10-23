---
layout: post
title: 
date: '2012-07-14T00:24:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- JavaScript
- Java
modified_time: '2015-07-18T07:53:29.684-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-1655663264840615940
blogger_orig_url: http://refcard.blogspot.com/2012/07/set-selectbox-value-using-jquery-it-is.html
---

<H1>Set SelectBox value using jQuery </H1><br/>It is pretty easy to set the selectbox value using the jQuery. We can do this with a single line of code.</br>Suppose i have a edit page and wants to show the already selected value in select box. You can use the below code for setting the value.    <pre class="brush: javascript"><br />$(document).ready(function()<br />  {<br />       $("#countyId option[value='India']").attr("selected", "selected");<br /><br />     });<br /></pre>The above code sets the selectbox having id countyId with value India.<br/> In a jsp page you can modify the code if you are getting the value from request etc.<br/> <pre class="brush: javascript"><br />$(document).ready(function()<br />  {<br />       $("#countyId option[value='<%=request.getParameter("country")%>']").attr("selected", "selected");<br /><br />     });<br /></pre> <br/> <H1>Get SelectBox value using jQuery</H1>We can get the value of select box using the val() method of jQuery.  <pre class="brush: javascript"><br />function getValue()<br />  {<br />   var val= $("#countyId").val();<br />   alert(val);<br />  }<br /></pre> <u><b>Complete Example</b></u><br/> <pre class="brush: html"><br /><!DOCTYPE html><br /> <html lang="en"><br /> <head><br />   <meta charset="utf-8"><br />   <title>jQuery demo</title><br />   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script><br />   <script><br />     $(document).ready(function()<br />  {<br />       $("#countyId option[value='India']").attr("selected", "selected");<br /><br />     });<br /><br />  function getValue()<br />  {<br />   var val= $("#countyId").val();<br />   alert(val);<br />  }<br />   </script><br /> </head><br /><body><br /><br /><select id="countyId"><br /><option value="America">America</option><br /><option value="India">India</option><br /><option value="Japan">Japan</option><br /></select><br /><br /><input type="button" value="GetValue" onclick="javascript:getValue();"><br /></body><br /></html><br /></pre>