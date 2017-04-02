---
layout: post
title: Create Custom ThreadPool In Java
author: Sandeep Bhardwaj
published: true
date: 2017-04-02 12:15:00 +5:30
tags: [Java , Concurrency ]
keywords: "ThreadPool , CustomThreadPool, Java, Concurrency"
summary: "How to create Custom ThreadPool In Java, How ThreadPool works in Java"
---

<h3>ThreadPool.java</h3>
Custom ThreadPool class with using the <code>LinkedBlockingQueue</code> for holding the incoming threads.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj/code-repo/blob/master/java-concurrency/src/com/concurrency/threadpool/ThreadPool.java"></script>


<h3>WorkerThread.java</h3>
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj/code-repo/blob/master/java-concurrency/src/com/concurrency/threadpool/WorkerThread.java"></script>


<h3>ThreadPoolTester.java</h3>
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj/code-repo/blob/master/java-concurrency/src/com/concurrency/threadpool/ThreadPoolTester.java"></script>

<h3>Output</h3>
{% highlight bash %}
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
{% endhighlight %}