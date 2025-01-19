---
layout: post
title: How to convert java.util.List to java.util.Set
date: 2012-05-11 04:31:00 +5:30
author: Sandeep Bhardwaj
category: Java
tags: [Java, Collection]
---


Removing duplicate items from a list is pretty simple in java just convert the list to java.util.Set it will automatically remove the duplicate items and create a set for you.  

<h3>Syntax</h3>  

``` java
Set<E> alphaSet  = new HashSet<E>(<your List>);  
```

<h3>Example</h3>  

``` java
import java.util.ArrayList;  
import java.util.HashSet;  
import java.util.List;  
import java.util.Set;  

public class ListToSet  
{  
 public static void main(String[] args)  
 {  
  List<String> alphaList = new ArrayList<String>();  
  alphaList.add("A");  
  alphaList.add("B");  
  alphaList.add("C");  
  alphaList.add("A");  
  alphaList.add("B");  
  System.out.println("List values .....");  
  for (String alpha : alphaList)  
  {  
   System.out.println(alpha);  
  }  
  Set<String> alphaSet = new HashSet<String>(alphaList);  
  System.out.println("\nSet values .....");  
  for (String alpha : alphaSet)  
  {  
   System.out.println(alpha);  
  }  
 }  
}  
```
