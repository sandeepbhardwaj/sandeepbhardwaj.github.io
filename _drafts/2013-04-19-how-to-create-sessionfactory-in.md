---
layout: post
title: How to create SessionFactory in Hibernate 4.x
date: '2013-04-19T04:53:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- ORM
- Hibernate
modified_time: '2015-07-18T07:53:29.410-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-8922419544194094763
blogger_orig_url: http://refcard.blogspot.com/2013/04/how-to-create-sessionfactory-in.html
---

<pre class="brush: java">  
import org.hibernate.HibernateException;  
import org.hibernate.SessionFactory;  
import org.hibernate.cfg.Configuration;  
import org.hibernate.service.ServiceRegistry;  
import org.hibernate.service.ServiceRegistryBuilder;  

public class Hibernate4Util {  
 private static SessionFactory sessionFactory;  
 private static ServiceRegistry serviceRegistry;  

 static  
 {  
  try  
  {  
   Configuration configuration = new Configuration().configure();  

   serviceRegistry = new ServiceRegistryBuilder().applySettings(  
     configuration.getProperties()).buildServiceRegistry();  

   //pass ServiceRegistry in buildSessionFactory method.  
   //buildSessionFactory() method without any argument is deprecated  
   sessionFactory = configuration.buildSessionFactory(serviceRegistry);  
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