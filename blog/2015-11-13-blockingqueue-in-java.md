---
layout: post
title: BlockingQueue In Java
author: Sandeep Bhardwaj
published: true
date: 2015-11-13 10:00:00 +5:30
category: Concurrency
tags: [Concurrency]
keywords: [BlockingQueue, Concurrency]
summary: "BlockingQueue in java"
---

``` java  
public interface BlockingQueue extends Queue
```

A BlockingQueue provides additionally functionality

*   wait for the queue to become non-empty when retrieving an element.
*   wait for space to become available in the queue when storing an element.

### Implementing Classes:

There are **7** implemented classed of BlockingQueue

1.  ArrayBlockingQueue
2.  DelayQueue
3.  ArrayBlockingQueue
4.  LinkedBlockingDeque
5.  LinkedTransferQueue
6.  PriorityBlockingQueue
7.  SynchronousQueue
