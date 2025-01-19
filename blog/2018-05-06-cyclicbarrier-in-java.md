---
layout: post
title: CyclicBarrier In Java
author: Sandeep Bhardwaj
published: true
date: 2018-05-06 12:00:00 +5:30
category: Concurrency
tags: [Java, Concurrency]
keywords: "CyclicBarrier , Java, Concurrency, BarrierAction, BrokenBarrierException"
summary: "CyclicBarrier In Java, How CyclicBarrier works in Java, Reset CyclicBarrier"
---

<h3>CyclicBarrierExample.java</h3>

``` java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {

	public static void main(String[] args) {
		CyclicBarrier barrier = new CyclicBarrier(3, new BarrierAction());

		new Thread(new Party(barrier)).start();
		new Thread(new Party(barrier)).start();
		new Thread(new Party(barrier)).start();

		try {
			// sleep to avoid BrokenBarrierException
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		System.out.println("\nReset the barrier....\n");
		// reset the barrier
		barrier.reset();

		new Thread(new Party(barrier)).start();
		new Thread(new Party(barrier)).start();
		new Thread(new Party(barrier)).start();
	}

}
```

<h3>BarrierAction.java</h3>
``` java
public class BarrierAction implements Runnable {

	@Override
	public void run() {
		System.out.println("Barrier Action Executes !!!");
	}

}
```

<h3>Party.java</h3>
``` java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class Party implements Runnable {
	CyclicBarrier barrier;

	public Party(CyclicBarrier barrier) {
		this.barrier = barrier;
	}

	@Override
	public void run() {
		try {
			System.out.println(Thread.currentThread().getName() + " waiting at barrier.");
			this.barrier.await();
		} catch (InterruptedException | BrokenBarrierException e) {
			e.printStackTrace();
		}
	}

}
```
<h3>Output</h3>
``` bash
Thread-2 waiting at barrier.
Thread-1 waiting at barrier.
Thread-0 waiting at barrier.
Barrier Action Executes !!!

Reset the barrier....

Thread-3 waiting at barrier.
Thread-4 waiting at barrier.
Thread-5 waiting at barrier.
Barrier Action Executes !!!
```
