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

# Set SelectBox value using jQuery

It is pretty easy to set the selectbox value using the jQuery. We can do this with a single line of code.  
Suppose i have a edit page and wants to show the already selected value in select box. You can use the below code for setting the value.

<pre class="brush: javascript">  
$(document).ready(function()  
  {  
       $("#countyId option[value='India']").attr("selected", "selected");  

     });  
</pre>

The above code sets the selectbox having id countyId with value India.  
In a jsp page you can modify the code if you are getting the value from request etc.  

<pre class="brush: javascript">  
$(document).ready(function()  
  {  
       $("#countyId option[value='<%=request.getParameter("country")%>']").attr("selected", "selected");  

     });  
</pre>

# Get SelectBox value using jQuery

We can get the value of select box using the val() method of jQuery.

<pre class="brush: javascript">  
function getValue()  
  {  
   var val= $("#countyId").val();  
   alert(val);  
  }  
</pre>

<u>**Complete Example**</u>  

<pre class="brush: html">  

   <meta charset="utf-8">  
   <title>jQuery demo</title>  

   <script><br />     $(document).ready(function()<br />  {<br />       $("#countyId option[value='India']").attr("selected", "selected");<br /><br />     });<br /><br />  function getValue()<br />  {<br />   var val= $("#countyId").val();<br />   alert(val);<br />  }<br /></script>   

<select id="countyId"><option value="America">America</option><option value="India">India</option><option value="Japan">Japan</option></select>  

<input type="button" value="GetValue" onclick="javascript:getValue();">  

</pre>