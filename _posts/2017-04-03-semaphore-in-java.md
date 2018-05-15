---
layout: post
title: Semaphore In Java
author: Sandeep Bhardwaj
published: true
date: 2017-04-03 12:00:00 +5:30
category: Concurrency
tags: [Java , Concurrency ]
keywords: "Semaphore , Java, Concurrency"
summary: "Semaphore In Java, How Semaphore works in Java"
---

<h3>SemaphoreExample.java</h3>

``` java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {

	public static void main(String[] args) {
		Semaphore semaphore = new Semaphore(2);

		new Thread(new Task(semaphore)).start();
		new Thread(new Task(semaphore)).start();
		new Thread(new Task(semaphore)).start();
		new Thread(new Task(semaphore)).start();
	}

}

class Task implements Runnable {

	Semaphore semaphore;

	public Task(Semaphore semaphore) {
		this.semaphore = semaphore;
	}

	@Override
	public void run() {
		try {
			semaphore.acquire();
			System.out.println(Thread.currentThread().getName() + " acquired");

			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			semaphore.release();
			System.out.println(Thread.currentThread().getName() + " released");
		}
	}
}
```

<h3>Output</h3>
``` bash
Thread-0 acquired
Thread-1 acquired
Thread-1 released
Thread-0 released
Thread-2 acquired
Thread-3 acquired
Thread-2 released
Thread-3 released
```
