---
layout: post
title: Saving Objects using Hibernate
date: '2012-11-11T03:34:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- Database
- Java
- ORM
- Hibernate
modified_time: '2015-07-18T07:53:29.649-07:00'
thumbnail: http://4.bp.blogspot.com/-H-jPpThjrQ4/UKdUgKYBWKI/AAAAAAAAAR4/ulGRYcaV-kg/s72-c/project_structure.bmp
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-7378480358997494833
blogger_orig_url: http://refcard.blogspot.com/2012/11/saving-objects-using-hibernate.html
---

<div dir="ltr" style="text-align: left;" trbidi="on">

### Introduction to Hibernate

1.  An ORM tool.
2.  Used in the data layer of application.
3.  Implement JPA.
4.  JPA (Java persistence api):- this is set of standards for and java persistence api.

### The problem with JDBC

1.  Mapping member variables to the column.
2.  Mapping relationships.
3.  Handling data types.  
    Example Boolean most of the databases do not have Boolean datatype.
4.  Managing the state of object.

### Saving with an object with hibernate.

1.  JDBC database configuration **>> Hibernate configuration .cfg.xml file.**
2.  The model object **>> Annotations or Hibernate mapping file .hbm.xml files.**
3.  Service method to create the model object **>> Use the hibernate.**
4.  Database design. **>> No needed.**
5.  DAO method to save the object using sql queries **>> No needed.**

<a name="more"></a>In our first hibernate example .I will save a simple object in database using hibernate. I will explore this tutorial further.  

### Start Coding

#### Project Structure

<div style="clear: both; text-align: center;">[![](http://4.bp.blogspot.com/-H-jPpThjrQ4/UKdUgKYBWKI/AAAAAAAAAR4/ulGRYcaV-kg/s1600/project_structure.bmp)](http://4.bp.blogspot.com/-H-jPpThjrQ4/UKdUgKYBWKI/AAAAAAAAAR4/ulGRYcaV-kg/s1600/project_structure.bmp)</div>

#### Book.java

Now, i am going to create a simple POJO class **Book.java** with some properties and their setters and getters.  

<pre class="brush: java">    
package com.bloggers.model;  

import java.util.Date;  

public class Book  
{  
 /* for primary key in database table */  
 private int bookId;  
 private String bookName;  
 private Date date;  

 public int getBookId()  
 {  
  return bookId;  
 }  

 public void setBookId(int bookId)  
 {  
  this.bookId = bookId;  
 }  

 public String getBookName()  
 {  
  return bookName;  
 }  

 public void setBookName(String bookName)  
 {  
  this.bookName = bookName;  
 }  

 public Date getDate()  
 {  
  return date;  
 }  

 public void setDate(Date date)  
 {  
  this.date = date;  
 }  

}  
</pre>

Few point while creating a model object or JavaBeans (Book.java) class.  

*   bookId property holds a **unique identifier** value for a book object. Provides an identifier property if you want to use the full feature set of Hibernate
*   Application need to distinguish objects by identifier.
*   Hibernate can access public, private, and protected accessor methods, as well as public, private and protected fields directly.
*   no-argument constructor is a requirement for all persistent classes. Hibernate create objects using Java Reflection.

#### Mapping file :-hbm file (Hibernate Mapping file)

Now second step is we have to create a hbm file with extension **.hbm.xml**. HBM file means **Hibernate Mapping File**. Mapping file gives all the information to hibernate about table columns etc which are mapped to object.  
**All persistent entity classes need a mapping to a table in the SQL database.**  
**Basic structor of hbm file**  

<pre class="brush: xml"> <hibernate -mapping="-mapping">  
   [...]  
   </hibernate>  
  </pre>

#### Note:

*   Hibernate not loads the DTD file from the web, it first look it up from the classpath of the application.
*   DTD file is included in hibernate-core.jar

#### Mapping file of Book.java class(Book.hbm.xml)

I will complete this step by step and try to explain all the elements.  

1.  Add a class element between two hibernate-mapping tags.

<pre class="brush: xml">  <?xml version="1.0"?>  
     <!DOCTYPE hibernate-mapping PUBLIC  
      "-//Hibernate/Hibernate Mapping DTD 3.0//EN"  
      "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">  

    <hibernate-mapping>  
     <class name="com.bloggers.model.Book" >  

     </class>  
    </hibernate-mapping>   
    </pre>

**class**

5.  Next, we need to tell Hibernate about the remaining entity class properties. By default, no properties of the class are considered persistent.

<pre class="brush: xml">  <?xml version="1.0"?>  
     <!DOCTYPE hibernate-mapping PUBLIC  
       "-//Hibernate/Hibernate Mapping DTD 3.0//EN"  
       "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">  

     <hibernate-mapping>  
      <class name="com.bloggers.model.Book" >  
       <id name="bookId"/>  
       <property name="date" column="PUBLISH_DATE"/>  
      </class>  
     </hibernate-mapping>  
    </pre>

**name**

**Question :** Why does the date property mapping include the column attribute, but the bookID does not?  
**Answer :** Without the column attribute, Hibernate by default uses the property name as the column name. This works for bookId, however, date is a reserved keyword in most databases so you will need to map it to a different name.  

#### Create a Hibernate Configuration File (hibernate.cfg.xml)

Hibernate required a configuration file for making the connection with database by default the file name is **hibernate.cfg.xml**  
We can do hibernate configuration in **3** different ways and these are :-  

1.  we can use a simple **hibernate.properties** file
2.  a more sophisticated **hibernate.cfg.xml** file
3.  or even complete programmatic setup

I am going to use the 2 option means by using **hibernate.cfg.xml** file.  

<pre class="brush: xml"> <?xml version='1.0' encoding='utf-8'?>  
 <!DOCTYPE hibernate-configuration PUBLIC  
   "-//Hibernate/Hibernate Configuration DTD 3.0//EN"  
   "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">  

 <hibernate-configuration>  

  <session-factory>  

   <!-- Database connection settings -->  
   <property name="connection.driver_class">com.mysql.jdbc.Driver</property>  
   <property name="connection.url">jdbc:mysql://localhost:3306/hibernatedb</property>  
   <property name="connection.username">root</property>  
   <property name="connection.password">root</property>  

   <!-- JDBC connection pool (use the built-in) -->  
   <property name="connection.pool_size">1</property>  

   <!-- SQL dialect -->  
   <property name="dialect">org.hibernate.dialect.MySQL5Dialect</property>  

   <!-- Disable the second-level cache  -->  
   <property name="cache.provider_class">org.hibernate.cache.NoCacheProvider</property>  

   <!-- Echo all executed SQL to stdout -->  
   <property name="show_sql">true</property>  

   <!-- Drop and re-create the database schema on startup -->  
   <property name="hbm2ddl.auto">create</property>  

   <mapping resource="com/bloggers/model/Book.hbm.xml"/>  

  </session-factory>  

 </hibernate-configuration>  
</pre>

1.  SessionFactory is a global factory responsible for a particular database. If you have several databases, for easier startup you should use several <session-factory> configurations in several configuration files.
2.  The first four property elements contain the necessary configuration for the JDBC connection.
3.  The dialect property element specifies the particular SQL variant Hibernate generates.
4.  In most cases, Hibernate is able to properly determine which dialect to use.
5.  The hbm2ddl.auto option turns on automatic generation of database schema directly into the database. This can also be turned off by removing the configuration option, or redirected to a file with the help of the SchemaExport Ant task.
6.  Finally, add the mapping file(s) for persistent classes to the configuration.

#### HibernateUtil.java

Utility class for getting the **sessionFactory.**  

<pre class="brush: java">  package com.bloggers.util;  

  import org.hibernate.SessionFactory;  
  import org.hibernate.cfg.Configuration;  

  public class HibernateUtil  
  {  
   private static final SessionFactory sessionFactory = buildSessionFactory();  

   private static SessionFactory buildSessionFactory()  
   {  
    try  
    {  
     // Create the SessionFactory from hibernate.cfg.xml  
     return new Configuration().configure().buildSessionFactory();  
    }  
    catch (Throwable ex)  
    {  
     // Make sure you log the exception, as it might be swallowed  
     System.err.println("Initial SessionFactory creation failed." + ex);  
     throw new ExceptionInInitializerError(ex);  
    }  
   }  

   public static SessionFactory getSessionFactory()  
   {  
    return sessionFactory;  
   }  
  }  
  </pre>

#### Run the example

Create a simple class for running the example.  

<pre class="brush: java">  package com.bloggers;  

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

    /* creating a new book object */  
    Book book = new Book();  
    book.setBookId(1);  
    book.setDate(new Date());  
    book.setBookName("Hibernate in action");  

    /* saving the book object */  
    hibernateTest.saveBook(book);  

   }  

   public void saveBook(Book book)  
   {  
    SessionFactory sessionFactory = HibernateUtil.getSessionFactory();  
    Session session = sessionFactory.openSession();  
    session.beginTransaction();  

    /* saving the book object here */  
    session.save(book);  
    session.getTransaction().commit();  
   }  

  }  

  </pre>

Before running the **HibernateTest** class make sure you have created a schema named **hibernatedb** in MySQL database .  
**Question** : Why schema named **hibernatedb** ?  
**Answer** : Because in **hibenate.cfg.xml**  
<property name="connection.url">jdbc:mysql://localhost:3306/hibernatedb</property>  
we have specify **hibernatedb**. You are free to change whatever name you want. Create schema using **mysql>create schema hibernate;** command.  

#### Output

*   Output on eclipse console  

    <div style="clear: both; text-align: center;">[![](http://2.bp.blogspot.com/--u8xsQQbFcM/UKdU3BhCFoI/AAAAAAAAASA/bTtflVX6gpc/s1600/eclipse_console_output.bmp)](http://2.bp.blogspot.com/--u8xsQQbFcM/UKdU3BhCFoI/AAAAAAAAASA/bTtflVX6gpc/s1600/eclipse_console_output.bmp)</div>

*   Now see the schema it contains one table name **book**, hibernate creates this table automatically.  

    <div style="clear: both; text-align: center;">[![](http://3.bp.blogspot.com/-KLqODv8S2VY/UJ-LP7rJbyI/AAAAAAAAARo/7q90Q0SmOAM/s1600/mysql_output.bmp)](http://3.bp.blogspot.com/-KLqODv8S2VY/UJ-LP7rJbyI/AAAAAAAAARo/7q90Q0SmOAM/s1600/mysql_output.bmp)</div>

*   When we run the **select * from book;** it display one record in database.

**Question** : Did you see the table it does not contains the column name **bookName**?  
**Answer** : If yes then you can easily found that why we do not have **bookName** in table book and the answer is because we did not map the bookName property in our hbm file so map the property and run the main method again and you will observe that.  

*   Hibernate automatically add a new column in book table.
*   When you run the select query on database again you see that it also contain bookName

### Source Code Download

#### Svn url

Checkout the complete project form the [Svn](https://2bloggers.googlecode.com/svn/branches/hibernate/HibernateExample_001)  

**OR**  

#### HibernateExample_001.zip (7.9 kb)

Download the from here [http://2bloggers.googlecode.com/files/HibernateExample_001.zip](http://2bloggers.googlecode.com/files/HibernateExample_001.zip).  

Please post **comments** with your suggestion if you like this tutorial. I will explore this tutorial with **one-to-one , many-to-one , one-to-many or many-to-many mapping**.  

### References

*   [Hibernate Reference](http://docs.jboss.org/hibernate/orm/3.6/reference/en-US/html_single/#tutorial-firstapp)

</div>