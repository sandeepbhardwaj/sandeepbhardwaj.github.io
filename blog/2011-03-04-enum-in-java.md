---
layout: post
title: Enum in java
published: true
date: 2011-03-04 15:41:00 +5:30
author: Sandeep Bhardwaj
category: Java
tags: [Java]
---

<h2>Enum: Get value using enum</h2>

``` javascript
enum Day {  
    SUNDAY(1), MONDAY(2), TUESDAY(3), WEDNESDAY(4), THURSDAY(5), FRIDAY(6), SATURDAY(7);  
    private final int dayCode;  
    private Day(int dayCode)  
    {  
     this.dayCode = dayCode;  
    }  
    public int getCode() { return dayCode; }  
}  

public class EnumValueOfDay {  
    public static void main(String[] args) {  

        Day day =    Day.SUNDAY;  
        System.out.println("Day = " + day.getCode());            
    }  
}  
```

also you can use enum in this way to get the value of enum . Here is one more example to print the names by using toString method.  

``` javascript
enum Name {  
 S("Sandeep"),   
 A("Aditya") ,   
 R("Rambrij"),  
 M("Meenakshi");  

 private final String name;  

 private Name(String name) {  
  this.name = name;  
 }  

 public String toString() {  
  return name;  
 }  
}  

public class NameDisplay {  
 public static void main(String[] args) {  

  Name name = Name.A;  
  System.out.println("Name = " + name);  
 }  
}  
```
