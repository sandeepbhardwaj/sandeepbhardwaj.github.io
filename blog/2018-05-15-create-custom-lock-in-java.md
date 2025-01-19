---
layout: post
title: Create Custom Lock In Java
author: Sandeep Bhardwaj
published: true
date: 2018-05-15 12:00:00 +5:30
category: Concurrency
tags: [Java, Concurrency]
keywords: [lock , unlock]
summary: [How to create custom lock in java]
---

<h3>Lock.java</h3>

``` java
public class Lock {

	private boolean isLocked = false;

	public synchronized void lock() throws InterruptedException {
		while (isLocked) {
			wait();
		}
		isLocked = true;
	}

	public synchronized void unlock() {
		isLocked = false;
		notify();
	}
}
```
<h3>Usage</h3>
``` java
lock.lock();
try {
  // ... method body
} finally {
  lock.unlock();
}
```
