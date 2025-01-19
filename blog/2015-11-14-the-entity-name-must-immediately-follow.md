---
layout: post
title: The entity name must immediately follow the '&amp;' in the entity reference. Blogspot
  template
author: Sandeep Bhardwaj
published: true
date: 2015-11-14 23:00:00 +5:30
tags: [JavaScript]
keywords: [Javadcript, Blogger , Blogspot, Blogspot Template]
summary: "The entity name must immediately follow the '&amp;' in the entity reference. Blogspot
  template"
---
 
Some times when we write some JavaScript on blogspot template we got this error  
**"The entity name must immediately follow the '&' in the entity reference."**This error come if we have some **and** condition in our JavaScript like

``` javascript
if(document.getElementById && !document.all){  
// do something here   

}  
```

Here is the simple solution of this just replace the **&** with **&amp;**.  

``` javascript
if(document.getElementById &amp;&amp; !document.all){  
// do something here   

}  
```

Post you valuable comment if this solution works for you.