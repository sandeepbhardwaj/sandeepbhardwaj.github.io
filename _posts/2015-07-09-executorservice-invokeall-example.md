---
  layout: post
  title: ExecutorService InvokeAll Example
  published: true
  category: Concurrency
  tags: [Java , Concurrency ]
  date: 2015-07-09 17:44:00 +5:30
---

<b>ExecutorInvokeAllExample.java</b>
<br />

``` java
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ExecutorInvokeAllExample
{

	public static void main(String[] args) throws InterruptedException, ExecutionException
	{
		ExecutorService executorService = Executors.newSingleThreadExecutor();

		Set<Callable<String>> callables = new HashSet<Callable<String>>();

		callables.add(new CallableTask("Hello 1"));
		callables.add(new CallableTask("Hello 2"));
		callables.add(new CallableTask("Hello 3"));

		List<Future<String>> futures = executorService.invokeAll(callables);

		for (Future<String> future : futures)
		{
			System.out.println("future.get = " + future.get());
		}
		executorService.shutdown();
	}
}

class CallableTask implements Callable<String>
{

	String message;

	public CallableTask(String message)
	{
		this.message = message;
	}

	@Override
	public String call() throws Exception
	{
		return message;
	}
}
```
