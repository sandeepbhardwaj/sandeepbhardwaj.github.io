---
layout: post
title: List of locale codes supported in java
date: '2012-07-01T22:54:00.000-07:00'
author: Sandeep Bhardwaj
tags:
- Java
modified_time: '2015-07-18T07:53:29.695-07:00'
blogger_id: tag:blogger.com,1999:blog-5017545194807719960.post-5376333387233534970
blogger_orig_url: http://refcard.blogspot.com/2012/07/list-of-locale-codes-supported-in-java.html
---

There are 152 locales are supported in java (jdk1.6.0_20).  
Code for getting the list of locale codes and list of countries.

<pre class="brush: java">  
public class LocaleCodes  
{  
 public static void main(String[] args)  
 {    
  Locale[] localeCodes= Locale.getAvailableLocales();  
  for(Locale locale:localeCodes)  
  {  
   System.out.println(locale.getLanguage() +"          "+locale.getDisplayLanguage());  
  }  
 }  
}  
</pre>

<u>**Output**</u>

<pre class="brush: java">  
ja          Japanese  
es          Spanish  
en          English  
ja          Japanese  
es          Spanish  
sr          Serbian  
mk          Macedonian  
es          Spanish  
ar          Arabic  
no          Norwegian  
sq          Albanian  
bg          Bulgarian  
ar          Arabic  
ar          Arabic  
hu          Hungarian  
pt          Portuguese  
el          Greek  
ar          Arabic  
mk          Macedonian  
sv          Swedish  
de          German  
en          English  
fi          Finnish  
is          Icelandic  
cs          Czech  
en          English  
sl          Slovenian  
sk          Slovak  
it          Italian  
tr          Turkish  
zh          Chinese  
th          Thai  
ar          Arabic  
no          Norwegian  
en          English  
sr          Serbian  
lt          Lithuanian  
ro          Romanian  
en          English  
no          Norwegian  
lt          Lithuanian  
es          Spanish  
nl          Dutch  
ga          Irish  
fr          French  
es          Spanish  
ar          Arabic  
ko          Korean  
fr          French  
et          Estonian  
ar          Arabic  
sr          Serbian  
es          Spanish  
es          Spanish  
ar          Arabic  
in          Indonesian  
ru          Russian  
lv          Latvian  
es          Spanish  
lv          Latvian  
iw          Hebrew  
pt          Portuguese  
ar          Arabic  
hr          Croatian  
et          Estonian  
es          Spanish  
fr          French  
hi          Hindi  
es          Spanish  
ar          Arabic  
en          English  
ar          Arabic  
fi          Finnish  
de          German  
es          Spanish  
nl          Dutch  
es          Spanish  
zh          Chinese  
ar          Arabic  
be          Belarusian  
is          Icelandic  
es          Spanish  
es          Spanish  
es          Spanish  
ar          Arabic  
en          English  
th          Thai  
el          Greek  
it          Italian  
ca          Catalan  
hu          Hungarian  
fr          French  
en          English  
uk          Ukrainian  
pl          Polish  
fr          French  
nl          Dutch  
en          English  
ca          Catalan  
ar          Arabic  
es          Spanish  
en          English  
sr          Serbian  
zh          Chinese  
pt          Portuguese  
uk          Ukrainian  
es          Spanish  
ru          Russian  
ko          Korean  
vi          Vietnamese  
ar          Arabic  
vi          Vietnamese  
sr          Serbian  
sq          Albanian  
ar          Arabic  
ar          Arabic  
zh          Chinese  
be          Belarusian  
zh          Chinese  
ja          Japanese  
iw          Hebrew  
bg          Bulgarian  
in          Indonesian  
mt          Maltese  
es          Spanish  
sl          Slovenian  
fr          French  
cs          Czech  
it          Italian  
ro          Romanian  
es          Spanish  
en          English  
de          German  
ga          Irish  
de          German  
de          German  
es          Spanish  
sk          Slovak  
ms          Malay  
hr          Croatian  
en          English  
da          Danish  
mt          Maltese  
pl          Polish  
ar          Arabic  
tr          Turkish  
th          Thai  
el          Greek  
ms          Malay  
sv          Swedish  
da          Danish  
es          Spanish  
</pre>