---
layout: post
title: Create Custom CountDownLatch In Java
author: Sandeep Bhardwaj
published: true
date: 2017-03-26 17:50:00 +5:30
category: Concurrency
tags: [Java , Concurrency ]
keywords: "CountDownLatch , CustomCountDownLatch, Java, Concurrency"
summary: "How to create Custom CountDownLatch In Java, How CountDownLatch works in Java"
---

<b>CustomCountDownLatch.java</b>
<br />

``` java
/**
 * Custom CoundDownLach implementation
 * @author sandeep
 *
 */
public class CustomCountDownLatch
{
	int counter;

	public CustomCountDownLatch(int counter)
	{
		this.counter = counter;
	}

	public synchronized void await() throws InterruptedException
	{
		if (counter > 0)
		{
			wait();
		}
	}

	/**
	 * method will decrement the counter by 1 each time
	 */
	public synchronized void countDown()
	{
		counter--;
		if (counter == 0)
		{
			notifyAll();
		}
	}
}

```
