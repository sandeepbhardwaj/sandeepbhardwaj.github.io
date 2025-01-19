---
  layout: post
  title: DelayQueueExample Example
  published: true
  category: Concurrency
  tags: [Java , Concurrency ]
  date: 2015-07-09 17:44:00 +5:30
---

<b>DelayQueueExample.java</b>

``` java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.DelayQueue;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class DelayQueueExample
{

	public static void main(String[] args)
	{

		BlockingQueue<DelayedElement> blockingQueue = new DelayQueue<DelayedElement>();

		try
		{
			blockingQueue.put(new DelayedElement(4000, "Message with delay 4s"));
			blockingQueue.put(new DelayedElement(2000, "Message with delay 2s"));
			blockingQueue.put(new DelayedElement(9000, "Message with delay 9s"));
		} catch (InterruptedException ie)
		{
		}

		while (!blockingQueue.isEmpty())
		{
			try
			{
				System.out.println(">>" + blockingQueue.take());
			} catch (InterruptedException ie)
			{
			}
		}
	}
}

class DelayedElement implements Delayed
{

	private long duration = 0;
	private String message;

	public DelayedElement(long duration, String name)
	{
		this.duration = System.currentTimeMillis() + duration;
		this.message = name;
	}

	@Override
	public int compareTo(Delayed o)
	{

		return (int) (this.duration - ((DelayedElement) o).getDuration());
	}

	/*
	 * Expiration occurs when an element's getDelay(TimeUnit unit) method
	 * returns a value less than or equal to zero.
	 */
	@Override
	public long getDelay(TimeUnit unit)
	{
		long diff = duration - System.currentTimeMillis();
		return unit.convert(diff, TimeUnit.MILLISECONDS);
	}

	public long getDuration()
	{
		return duration;
	}

	public void setDuration(long duration)
	{
		this.duration = duration;
	}

	public String getMessage()
	{
		return message;
	}

	public void setMessage(String message)
	{
		this.message = message;
	}

	@Override
	public String toString()
	{
		return "DelayedElement [duration=" + duration + ", message=" + message + "]";
	}
}
```

<b>Output</b>
``` bash
>>DelayedElement [duration=1436431881725, message=Message with delay 2s]
>>DelayedElement [duration=1436431883725, message=Message with delay 4s]
>>DelayedElement [duration=1436431888725, message=Message with delay 9s]
```
