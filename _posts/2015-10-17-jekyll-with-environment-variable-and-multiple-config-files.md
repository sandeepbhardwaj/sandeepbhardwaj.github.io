---
  layout: post
  author: Sandeep Bhardwaj
  title: Jekyll with environment variable and multiple _config.yml files
  published: true
  tags: [Jekyll]
  date: 2015-10-17 22:05:00 +5:30
---

Before writing a new post, i first made changes in <code>_config.yml</code> for my local/development environment like :-

<h3>Development environment</h3>
{% highlight bash %}
#url: http://sandeepbhardwaj.github.io
url: http://localhost:4000

google_analytics: #UA-68409070-1
disqus_user: #sandeepbhardwaj
{% endhighlight %}

<h3>Production environment</h3>
{% highlight bash %}
url: http://sandeepbhardwaj.github.io
#url: http://localhost:4000

google_analytics: UA-68409070-1
disqus_user: sandeepbhardwaj
{% endhighlight %}

But doing this every time is pain. Sometimes i forgot to revert the changes when push my changes to github. So i Google it and find out that there is <code>jekyll.environment</code> variable that we can use.

{% highlight bash %}
<% if jekyll.environment == "production" %>
   <% include disqus.html %>
<% endif %>
{% endhighlight %}

so it means i have to made changes in <code>_layout</code> and <code>_include</code> file. I personally don't like this approach.

<h2>Approach 1</h2>
<h3>Creating environment specific <code>_config.yml</code> files</h3>
Finally, i find out a best way of doing this and just copy paste the existing <code>_config.yml</code> and rename it to <code>_config-dev.yml</code> and made changes for local environment.

Jekyll provide a best way of providing the config file explicitly using the command line like:-

{% highlight bash %}
jekyll serve -w --config _config-dev.yml
{% endhighlight %}

<h2>Approach 2</h2>
<h3>Overridding the default values</h3>
There is also a alternative approach for overriding the exiting properties with default one if you do not want to add unnecessary config in new _config-dev.yml

{% highlight bash %}
jekyll serve -w --config _config.yml,_config-dev.yml
{% endhighlight %}

<b>Note</b> :-Make sure in that case just add those config those need to be override only.
Example:-
{% highlight bash %}
url: http://localhost:4000

google_analytics: #UA-68409070-1
disqus_user: #sandeepbhardwaj
{% endhighlight %}

and when i push my site to github it automatically pick the default config file <code>_config.yml</code> and build the site using default one.