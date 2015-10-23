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

<pre class="brush: java"><br />import org.hibernate.HibernateException;<br />import org.hibernate.SessionFactory;<br />import org.hibernate.cfg.Configuration;<br /><br />public class Hibernate3Util {<br /> private static SessionFactory sessionFactory;<br /><br /> static<br /> {<br />  try<br />  {<br />   Configuration configuration = new Configuration().configure();<br />   sessionFactory = configuration.buildSessionFactory();<br />  }<br />  catch (HibernateException e)<br />  {<br />   System.err.println("Error creating Session: " + e);<br />   throw new ExceptionInInitializerError(e);<br />  }<br /> }<br /><br /> public static SessionFactory getSessionFactory()<br /> {<br />  return sessionFactory;<br /> }<br />}<br /></pre>