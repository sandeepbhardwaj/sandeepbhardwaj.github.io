---
layout: post
title: How to create SessionFactory in Hibernate 3.x
date: '2013-04-19T04:52:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- ORM
- Hibernate
modified_time: '2015-07-18T07:53:29.421-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-6912305933607813800
blogger_orig_url: http://refcard.blogspot.com/2013/04/how-to-create-sessionfactory-in_19.html
---

<pre class="brush: java">  
import org.hibernate.HibernateException;  
import org.hibernate.SessionFactory;  
import org.hibernate.cfg.Configuration;  

public class Hibernate3Util {  
 private static SessionFactory sessionFactory;  

 static  
 {  
  try  
  {  
   Configuration configuration = new Configuration().configure();  
   sessionFactory = configuration.buildSessionFactory();  
  }  
  catch (HibernateException e)  
  {  
   System.err.println("Error creating Session: " + e);  
   throw new ExceptionInInitializerError(e);  
  }  
 }  

 public static SessionFactory getSessionFactory()  
 {  
  return sessionFactory;  
 }  
}  
</pre>