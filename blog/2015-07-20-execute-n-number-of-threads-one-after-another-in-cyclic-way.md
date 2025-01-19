---
  layout: post
  title: Execute N number of threads one after another in cyclic way
  published: true
  category: Concurrency
  tags: [Java , Concurrency ]
  date: 2015-07-20 16:44:00 +5:30
---

This is a famous interview question how to execute 3 or n threads one after another and performing a job like :-

Thread T1 prints then Threads T2 print and then .... Thread Tn<br />
then again
Thread T1 prints then Threads T2 print and then .... Thread Tn and so on....<br />

T1 -> T2 -> ... -> Tn; and then again T1 -> T2 -> ... -> Tn
<br />

<h3>CyclicExecutionOfThreads.java</h3>
``` java
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CyclicExecutionOfThreads
{

	public static void main(String args[])
	{

		int totalNumOfThreads = 10;
		PrintJob printJob = new PrintJob(totalNumOfThreads);

		/*
		 * MyRunnable runnable = new MyRunnable(printJob, 1); Thread t1 = new
		 * Thread(runnable);
		 *
		 * MyRunnable runnable2 = new MyRunnable(printJob, 2); Thread t2 = new
		 * Thread(runnable2);
		 *
		 * MyRunnable runnable3 = new MyRunnable(printJob, 3); Thread t3 = new
		 * Thread(runnable3);
		 *
		 * t1.start(); t2.start(); t3.start();
		 */

		// OR
		ExecutorService executorService = Executors.newFixedThreadPool(totalNumOfThreads);
		Set<Runnable> runnables = new HashSet<Runnable>();

		for (int i = 1; i <= totalNumOfThreads; i++)
		{
			MyRunnable command = new MyRunnable(printJob, i);
			runnables.add(command);
			executorService.execute(command);
		}

		executorService.shutdown();
	}
}

class MyRunnable implements Runnable
{

	PrintJob printJob;
	int threadNum;

	public MyRunnable(PrintJob job, int threadNum)
	{
		this.printJob = job;
		this.threadNum = threadNum;
	}

	@Override
	public void run()
	{
		while (true)
		{
			synchronized (printJob)
			{
				if (threadNum == printJob.counter)
				{
					printJob.printStuff();

					if (printJob.counter != printJob.totalNumOfThreads)
					{
						printJob.counter++;
					} else
					{

						System.out.println();
						// reset the counter
						printJob.resetCounter();
					}

					printJob.notifyAll();

				} else
				{
					try
					{
						printJob.wait();
					} catch (InterruptedException e)
					{
						e.printStackTrace();
					}
				}
			}

		}
	}
}

class PrintJob
{
	int counter = 1;
	int totalNumOfThreads;

	PrintJob(int totalNumOfThreads)
	{
		this.totalNumOfThreads = totalNumOfThreads;
	}

	public void printStuff()
	{
		System.out.println("Thread " + Thread.currentThread().getName() + " is printing");

		try
		{
			Thread.sleep(1000);
		} catch (InterruptedException e)
		{
			e.printStackTrace();
		}
	}

	public void resetCounter()
	{
		this.counter = 1;
	}
}
```

<u><b>Output</b></u>

``` bash
Thread pool-1-thread-1 is printing
Thread pool-1-thread-2 is printing
Thread pool-1-thread-3 is printing

Thread pool-1-thread-1 is printing
Thread pool-1-thread-2 is printing
Thread pool-1-thread-3 is printing

Thread pool-1-thread-1 is printing
Thread pool-1-thread-2 is printing
Thread pool-1-thread-3 is printing

Thread pool-1-thread-1 is printing
Thread pool-1-thread-2 is printing
Thread pool-1-thread-3 is printing
```
