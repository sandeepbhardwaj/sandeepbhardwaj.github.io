---
layout: post
title: Double Checked Locking - Singleton Pattern
author: Sandeep Bhardwaj
published: true
date: 2018-05-13 12:00:00 +5:30
category: Java
tags: [Java]
keywords: "Singleton, Double Checked Locking"
summary: "How to create thread safe Singleton class, Double Checked Locking, Singleton in java"
---

<h3>Singleton.java</h3>

``` java
public class Singleton {
	private static volatile Singleton _instance; // volatile variable
	private Singleton(){} //private constructor

	public static Singleton getInstance() {
		if (_instance == null) {
			synchronized (Singleton.class) {
				if (_instance == null)
					_instance = new Singleton();
			}
		}
		return _instance;
	}
}
```
