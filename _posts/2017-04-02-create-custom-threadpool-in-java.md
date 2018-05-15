---
layout: post
title: Create Custom ThreadPool In Java
author: Sandeep Bhardwaj
published: true
date: 2017-04-02 12:15:00 +5:30
category: Concurrency
tags: [Java , Concurrency ]
keywords: "ThreadPool , CustomThreadPool, Java, Concurrency"
summary: "How to create Custom ThreadPool In Java, How ThreadPool works in Java"
---

<h3>ThreadPool.java</h3>
Custom ThreadPool class with using the <code>LinkedBlockingQueue</code> for holding the incoming threads.

``` java
import java.util.concurrent.LinkedBlockingQueue;

public class ThreadPool
{
	volatile boolean isRunning;
	private LinkedBlockingQueue<Runnable> blockingQueue;
	private WorkerThread[] workerThreads;

	public ThreadPool(int poolSize)
	{
		blockingQueue = new LinkedBlockingQueue<>(4);
		workerThreads = new WorkerThread[poolSize];

		// create worker threads
		for (int i = 0; i < poolSize; i++)
		{
			workerThreads[i] = new WorkerThread(i + "", blockingQueue);
		}

		// start all threads
		for (WorkerThread workerThread : workerThreads)
		{
			workerThread.start();
		}
	}

	public void execute(Runnable task)
	{
		synchronized (blockingQueue)
		{

			while (blockingQueue.size() == 4)
			{
				try
				{
					blockingQueue.wait();
				} catch (InterruptedException e)
				{
					System.out.println("An error occurred while queue is waiting: " + e.getMessage());
				}
			}

			blockingQueue.add(task);

			// notify all worker threads waiting for new task
			blockingQueue.notifyAll();
		}
	}
}
```


<h3>WorkerThread.java</h3>
``` java
import java.util.concurrent.LinkedBlockingQueue;

public class WorkerThread extends Thread
{
	private LinkedBlockingQueue<Runnable> queue;

	public WorkerThread(String name, LinkedBlockingQueue<Runnable> queue)
	{
		super(name);
		this.queue = queue;
	}

	@Override
	public void run()
	{

		while (true)
		{
			synchronized (queue)
			{
				while (queue.isEmpty())
				{
					try
					{
						queue.wait();
					} catch (InterruptedException e)
					{
						System.out.println("An error occurred while queue is waiting: " + e.getMessage());
					}
				}

				try
				{
					Runnable runnable = this.queue.poll();
					System.out.println(
							"worker " + Thread.currentThread().getName() + " executing thread " + runnable.toString());
					runnable.run();
					Thread.sleep(1000);

					// notify threads waiting to put task in queue
					queue.notifyAll();
				} catch (InterruptedException e)
				{
					e.printStackTrace();
				}
			}
		}
	}

}
```


<h3>ThreadPoolTester.java</h3>
``` java
public class ThreadPoolTester
{

	public static void main(String[] args)
	{
		ThreadPool pool = new ThreadPool(2);

		for (int i = 0; i < 10; i++)
		{
			pool.execute(new Task(i + ""));
		}
	}

}

class Task implements Runnable
{
	String name;

	public Task(String name)
	{
		this.name = name;
	}

	@Override
	public void run()
	{
		System.out.println("Task " + this.name + " is running");
	}

	@Override
	public String toString()
	{
		return this.name;
	}
}
```

<h3>Output</h3>
``` bash
worker 1 executing thread 0
Task 0 is running
worker 1 executing thread 1
Task 1 is running
worker 0 executing thread 2
Task 2 is running
worker 0 executing thread 3
Task 3 is running
worker 0 executing thread 4
Task 4 is running
worker 1 executing thread 5
Task 5 is running
worker 0 executing thread 6
Task 6 is running
worker 0 executing thread 7
Task 7 is running
worker 1 executing thread 8
Task 8 is running
worker 1 executing thread 9
Task 9 is running
```
