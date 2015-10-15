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

<pre class="brush: java"><br />import org.hibernate.HibernateException;<br />import org.hibernate.SessionFactory;<br />import org.hibernate.cfg.Configuration;<br />import org.hibernate.service.ServiceRegistry;<br />import org.hibernate.service.ServiceRegistryBuilder;<br /><br />public class Hibernate4Util {<br /> private static SessionFactory sessionFactory;<br /> private static ServiceRegistry serviceRegistry;<br /><br /> static<br /> {<br />  try<br />  {<br />   Configuration configuration = new Configuration().configure();<br /><br />   serviceRegistry = new ServiceRegistryBuilder().applySettings(<br />     configuration.getProperties()).buildServiceRegistry();<br />   <br />   //pass ServiceRegistry in buildSessionFactory method.<br />   //buildSessionFactory() method without any argument is deprecated<br />   sessionFactory = configuration.buildSessionFactory(serviceRegistry);<br />  }<br />  catch (HibernateException e)<br />  {<br />   System.err.println("Error creating Session: " + e);<br />   throw new ExceptionInInitializerError(e);<br />  }<br /> }<br /><br /> public static SessionFactory getSessionFactory()<br /> {<br />  return sessionFactory;<br /> }<br />}<br /></pre>