---
  layout: post
  title: Main method in java
  published: true
  date: 2010-12-06 21:59:00 +5:30
  author: Sandeep Bhardwaj
  category: Java
  tags: [Java]
---
<h2>public static void main(String arg[])</h2>

In Java we write public static void main (String args[]) instead of just main because:  

``` java
public static void main(String arg[])   
      {  

      }  
```

<h3>public</h3>  
The main method must be public because it is call from outside the class. It is called by jvm.

<h3>static</h3>  
The main method must be static because without creating an instance jvm can call it.  
If the main method is non static then it is must to create an instance of the class.

<h3>void</h3>  
Main method doesn't return anything therefore it is void also.

<h3>Strings args[]</h3>  
It is used for receiving any arbitrary number of arguments and save it in the array.
