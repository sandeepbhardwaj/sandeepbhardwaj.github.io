---
layout: post
title: Create file type input using textbox and simple button
published: true
date: 2011-01-30 21:23:00 +5:30
author: Sandeep Bhardwaj
tags: [JavaScript]
---

Some times we have requirement to create a file type input in HTML with using simple textbox and a simple button for browse functionality. I search a lot on Google to achieve this functionality but there is no option available in javascript or in jQuery to open file dialog using a simple button.  

Then i used a simple trick to achieve this.  

``` html   
<input name="browse" style="display: none;" type="file">                                                   
<input name="fileInput" maxlength="255" type="text">  
<input onclick="browse.click();fileInput.value=browse.value;" value="Browse.." type="button">  
```