---
layout: post
title: Retrieving Objects using session.get(Class entityClass, Serializable id) method
date: '2012-11-17T02:54:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- Database
- Java
- ORM
- Hibernate
modified_time: '2015-07-18T07:53:29.595-07:00'
thumbnail: http://1.bp.blogspot.com/-eMa57dmShZI/UKdrNyacgGI/AAAAAAAAASQ/JpbcQrtOZ70/s72-c/eclipse_console_output.bmp
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-5537400251254914631
blogger_orig_url: http://refcard.blogspot.com/2012/11/retrieving-objects-using.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">  
In previous tutorial [Saving object using hibernate](http://www.2bloggers.com/2012/11/part-i-first-hibernate-application.html) we have created a Book object and save that object in database using the session.save() method.  
Now in this tutorial we will fetch this object form the database using the session.get method.  

### get(Class entityClass, Serializable id) throws HibernateException

<pre class="brush: java">Object get(String entityName,  
           Serializable id)  
           throws HibernateException  
</pre>

Return the persistent instance of the given named entity with the given identifier, or null if there is no such persistent instance. (If the instance is already associated with the session, return that instance. This method never returns an uninitialized instance.)  
<a name="more"></a>  
**Parameters:**  
**                entityName -** the entity name.  
**                id -** an identifier.  
**Returns:**  
           a persistent **instance** or **null**  
**Throws:**  
            HibernateException  

### Usage

Add a new method **getBook** in HibernateTest class for retrieving the object from the database.  

### getBook method

**Parameters:****bookId-** an identifier  
**Returns:**a persistent **instance** of Book class or **null**  

<pre class="brush: java">public Book getBook(int bookId)  
 {  
  SessionFactory sessionFactory = HibernateUtil.getSessionFactory();  
  Session session = sessionFactory.openSession();  
  session.beginTransaction();  

  // retrieving the book object from database  
  Book book = (Book) session.get(Book.class, bookId);  
  session.getTransaction().commit();  

  return book;  
 }  

</pre>

#### Complete class

<pre class="brush: java">package com.bloggers;  

import java.util.Date;  

import org.hibernate.Session;  
import org.hibernate.SessionFactory;  

import com.bloggers.model.Book;  
import com.bloggers.util.HibernateUtil;  

public class HibernateTest  
{  

 public static void main(String[] args)  
 {  
  HibernateTest hibernateTest = new HibernateTest();  

  // creating a new book object  
  Book book = new Book();  
  book.setBookId(1);  
  book.setDate(new Date());  
  book.setBookName("Hibernate in action");  

  // saving the book object  
  hibernateTest.saveBook(book);  

  /*  
   * below line is not required this is just for demonstrate. setting book  
   * to null to make sure that the object returns by the getBook method is  
   * from database  
   */  
  book = null;  

  book = hibernateTest.getBook(1);  

  System.out.println("Book [bookId=" + book.getBookId() + ", bookName="  
    + book.getBookName() + ", publishDate=" + book.getDate() + "]");  

 }  

 public void saveBook(Book book)  
 {  
  SessionFactory sessionFactory = HibernateUtil.getSessionFactory();  
  Session session = sessionFactory.openSession();  
  session.beginTransaction();  

  // saving the book object here  
  session.save(book);  
  session.getTransaction().commit();  
 }  

 public Book getBook(int bookId)  
 {  
  SessionFactory sessionFactory = HibernateUtil.getSessionFactory();  
  Session session = sessionFactory.openSession();  
  session.beginTransaction();  

  // retrieving  the book object from database   
  Book book = (Book) session.get(Book.class, bookId);  
  session.getTransaction().commit();  

  return book;  
 }  

}  
</pre>

#### Output

Output on eclipse console  

<div style="clear: both; text-align: center;">[![](http://1.bp.blogspot.com/-eMa57dmShZI/UKdrNyacgGI/AAAAAAAAASQ/JpbcQrtOZ70/s1600/eclipse_console_output.bmp)](http://1.bp.blogspot.com/-eMa57dmShZI/UKdrNyacgGI/AAAAAAAAASQ/JpbcQrtOZ70/s1600/eclipse_console_output.bmp)</div>

In above pic you can easily see there are two queries run .  

1.  First query is a insert query which is run by **session.save** method and inset the data in book table.
2.  And second query a select query with a where condition run by **session.get** method and retrieves the book object from the book table.

### Source Code Download

#### HibernateExample_001.zip (8.0 kb)

Download the from here [http://2bloggers.googlecode.com/files/HibernateExample_002.zip](http://2bloggers.googlecode.com/files/HibernateExample_002.zip).  

Please post **comments** with your suggestion if you like this tutorial.  

### References

*   [Session (Hibernate JavaDocs)](http://docs.jboss.org/hibernate/orm/3.5/api/org/hibernate/Session.html#get%28java.lang.Class,%20java.io.Serializable%29)

</div>