---
layout: post
title: Create SessionFactory in Hibernate
author: Sandeep Bhardwaj
published: true
date: 2015-11-14 23:00:00 +5:30
tags: [Hibernate]
keywords: "Hibernate, ORM"
summary: "How to create SessionFactory in Hibernate 4.x, How to create SessionFactory in Hibernate 3.x, Create SessionFactory in Hibernate"
---

<h3>Hibernate SessionFactory in 4.x</h3>

``` java  
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

public class Hibernate4Util {
  private static SessionFactory sessionFactory;
  private static ServiceRegistry serviceRegistry;

  static {
    try {
      Configuration configuration = new Configuration().configure();

      serviceRegistry = new ServiceRegistryBuilder().applySettings(configuration.getProperties())
          .buildServiceRegistry();

      // pass ServiceRegistry in buildSessionFactory method.
      // buildSessionFactory() method without any argument is deprecated
      sessionFactory = configuration.buildSessionFactory(serviceRegistry);
    } catch (HibernateException e) {
      System.err.println("Error creating Session: " + e);
      throw new ExceptionInInitializerError(e);
    }
  }

  public static SessionFactory getSessionFactory() {
    return sessionFactory;
  }
}
```

<h3>Hibernate SessionFactory in 3.x</h3>

``` java 
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class Hibernate3Util {
  private static SessionFactory sessionFactory;

  static {
    try {
      Configuration configuration = new Configuration().configure();
      sessionFactory = configuration.buildSessionFactory();
    } catch (HibernateException e) {
      System.err.println("Error creating Session: " + e);
      throw new ExceptionInInitializerError(e);
    }
  }

  public static SessionFactory getSessionFactory() {
    return sessionFactory;
  }
}
```