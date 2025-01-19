---
layout: post
title: Trim method in JavaScript
date: 2010-12-28 22:41:00 +5:30
author: Sandeep Bhardwaj
tags: [JavaScript]
---
We can use String.replace method to trim a string in javascript.  

``` javascript  
//method for trim a complete string like "  Hello World   "  
function trim(str) {  
 return str.replace(/^\s+|\s+$/g,"");  
}  

//method for left trim a string like "   Hello World"  
function leftTrim(str) {  
 return str.replace(/^\s+/,"");  
}  

//method for right trim a string like "Hello World   "  
function rightTrim(str) {  
 return str.replace(/\s+$/,"");  
}  
```