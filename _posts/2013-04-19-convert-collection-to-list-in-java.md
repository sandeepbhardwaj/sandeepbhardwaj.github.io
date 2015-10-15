---
layout: post
title: Convert java.util.Collection to java.util.List
date: 2013-04-19 03:15:00 +5:30
author: Sandeep Bhardwaj
tags: [Java, Collection]
---

{% highlight java %}  
List list;  
if (collection instanceof List)  
{  
  list = (List)collection;  
}  
else  
{  
  list = new ArrayList(collection);  
}  
{% endhighlight %}

<h3>Generic way (java 1.5<=)</h3>

{% highlight java %}
public <E> List<E> collectionToList(Collection<E> collection)  
 {  
  List<E> list;  
  if (collection instanceof List)  
  {  
   list = (List<E>) collection;  
  }  
  else  
  {  
   list = new ArrayList<E>(collection);  
  }  
  return list;  
 }  
{% endhighlight %}

<h3>Without Generics (java 1.4>=)</h3>

{% highlight java %}  
public List collectionToList(Collection collection)  
 {  
  List list;  
  if (collection instanceof List)  
  {  
   list = (List) collection;  
  }  
  else  
  {  
   list = new ArrayList(collection);  
  }  
  return list;  
 }  
{% endhighlight %}