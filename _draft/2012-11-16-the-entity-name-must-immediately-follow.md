---
layout: post
title: The entity name must immediately follow the '&' in the entity reference. Blogspot
  template
date: '2012-11-16T07:40:00.000-08:00'
author: Sandeep Bhardwaj
tags:
- JavaScript
- Blogspot
modified_time: '2015-07-18T07:53:29.607-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-5512021713131928498
blogger_orig_url: http://refcard.blogspot.com/2012/11/the-entity-name-must-immediately-follow.html
---

<div dir="ltr" style="text-align: left;" trbidi="on"><br />Some times when we write some JavaScript on blogspot template we got this error<br /><b>"The entity name must immediately follow the '&amp;' in the entity reference."</b>This error come if we have some <b>and</b> condition in our JavaScript like  <a name='more'></a><br /><br /><pre class="brush: javascript">if(document.getElementById &amp;&amp; !document.all){<br />// do something here <br /><br />}<br /></pre> Here is the simple solution of this just replace the <b>&amp;</b> with  <b>&amp;amp;</b>.  <br /><pre class="brush: javascript">if(document.getElementById &amp;amp;&amp;amp; !document.all){<br />// do something here <br /><br />}<br /></pre><br />Post you valuable comment if this solution works for you. <br /><br /><br /></div>