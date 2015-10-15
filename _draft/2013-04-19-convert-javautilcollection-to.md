---
layout: post
title: Convert java.util.Collection to java.util.List
date: '2013-04-19T03:15:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Java
- Collection
modified_time: '2015-07-18T07:53:29.455-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-6214193821757838146
blogger_orig_url: http://refcard.blogspot.com/2013/04/convert-javautilcollection-to.html
---

 <pre class="brush: java"><br />List list;<br />if (collection instanceof List)<br />{<br />  list = (List)collection;<br />}<br />else<br />{<br />  list = new ArrayList(collection);<br />}<br /></pre> <h4>Generic way (java 1.5<=)</h4><pre class="brush: java"><br />public &lt;E> List&lt;E> collectionToList(Collection&lt;E> collection)<br /> {<br />  List&lt;E> list;<br />  if (collection instanceof List)<br />  {<br />   list = (List&lt;E>) collection;<br />  }<br />  else<br />  {<br />   list = new ArrayList&lt;E>(collection);<br />  }<br />  return list;<br /> }<br /></pre>  <h4>Without Generics (java 1.4>=)</h4> <pre class="brush: java"><br />public List collectionToList(Collection collection)<br /> {<br />  List list;<br />  if (collection instanceof List)<br />  {<br />   list = (List) collection;<br />  }<br />  else<br />  {<br />   list = new ArrayList(collection);<br />  }<br />  return list;<br /> }<br /></pre>        