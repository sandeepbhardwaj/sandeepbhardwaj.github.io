---
  layout: post
  title: Execute N number of threads one after another in cyclic way
  published: true
  tags: [Java , Concurrency ]
  date: 2015-07-20 16:44:00 +5:30
---

This is a famous interview question how to execute 3 or n threads one after another and performing a job like :- 

Thread T1 prints then Threads T2 print and then .... Thread Tn<br />
then again
Thread T1 prints then Threads T2 print and then .... Thread Tn and so on....<br />

T1 -> T2 -> ... -> Tn; and then again T1 -> T2 -> ... -> Tn
<br />

<u><b>CyclicExecutionOfThreads.java</b></u><br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj/code-repo/blob/master/java-concurrency/src/com/concurrency/CyclicExecutionOfThreads.java"></script>

<u><b>Output</b></u>

{% highlight bash %}
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
{% endhighlight %}
