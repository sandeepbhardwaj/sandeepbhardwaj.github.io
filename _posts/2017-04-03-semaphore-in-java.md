---
layout: post
title: Semaphore In Java
author: Sandeep Bhardwaj
published: true
date: 2017-04-03 12:00:00 +5:30
tags: [Java , Concurrency ]
keywords: "Semaphore , Java, Concurrency"
summary: "Semaphore In Java, How Semaphore works in Java"
---

<h3>SemaphoreExample.java</h3>

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj/code-repo/blob/master/java-concurrency/src/com/concurrency/semaphore/SemaphoreExample.java"></script>


<h3>Output</h3>
{% highlight bash %}
Thread-0 acquired
Thread-1 acquired
Thread-1 released
Thread-0 released
Thread-2 acquired
Thread-3 acquired
Thread-2 released
Thread-3 released
{% endhighlight %}