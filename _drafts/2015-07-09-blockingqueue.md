---
layout: post
title: BlockingQueue
date: '2015-07-08T23:49:00.001-07:00'
author: Sandeep Bhardwaj
tags:
- concurrency
modified_time: '2015-07-09T20:51:59.192-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-1602645969397053163
blogger_orig_url: http://refcard.blogspot.com/2015/07/blockingqueue.html
---

<div dir="ltr" style="text-align: left;" trbidi="on"> <pre class="prettyprint"><br />public interface BlockingQueue<E> extends Queue<E><br /></pre> A BlockingQueue provides additionally functionality  <ul><li>wait for the queue to become non-empty when retrieving an element.</li><li>wait for space to become available in the queue when storing an element. </li></ul>  <h3>Implementing Classes:</h3>There are <b>7</b> implemented classed of BlockingQueue <ol><li>ArrayBlockingQueue</li><li>DelayQueue</li><li>ArrayBlockingQueue</li><li>LinkedBlockingDeque</li><li>LinkedTransferQueue</li><li>PriorityBlockingQueue</li><li>SynchronousQueue</li></ol>      </div>