---
  layout: post
  author: Sandeep Bhardwaj
  title: Jekyll with environment variable and multiple _config.yml files
  published: true
  tags: [Jekyll]
  date: 2015-10-17 22:05:00 +5:30
  keywords: "jekyll , _config.yml, environment variable"
  summary: "How to use jekyll environment variable, How to use multiple _config.yml files"
---

When we write a new post in jekyll we usually made changes in <code>_config.yml</code> for our local/development environment like :-

<h3>Development environment</h3>
``` bash
#url: http://sandeepbhardwaj.github.io
url: http://localhost:4000

google_analytics: #UA-68409070-1
disqus_user: #sandeepbhardwaj
```

<h3>Production environment</h3>
``` bash
url: http://sandeepbhardwaj.github.io
#url: http://localhost:4000

google_analytics: UA-68409070-1
disqus_user: sandeepbhardwaj
```

But doing this every time is pain. Sometimes we forgot to revert the changes when push our changes to github. So i Google it and find out that there is <code>jekyll.environment</code> variable that we can use.

``` bash
<% if jekyll.environment == "production" %>
   <% include disqus.html %>
<% endif %>
```

so it means i have to made changes in <code>_layout</code> and <code>_include</code> file. I personally don't like this approach because i dont want to change my existing code. 

Below are the two approaches which i liked most.

<h2>Approach 1</h2>
<h3>Creating environment specific <code>_config.yml</code> files</h3>
Finally, i find out a best way of doing this and just copy paste the existing <code>_config.yml</code> and rename it to <code>_config-dev.yml</code> and made changes for local environment.

Jekyll provide a best way of providing the config file explicitly using the command line like:-

``` bash
jekyll serve -w --config _config-dev.yml
```

<h2>Approach 2</h2>
<h3>Overridding the default values</h3>
There is also a alternative approach for overriding the exiting properties with default one if you do not want to add unnecessary config in new _config-dev.yml

``` bash
jekyll serve -w --config _config.yml,_config-dev.yml
```

<b>Note</b> :-Make sure in that case just add those config those need to be override only.
Example:-
``` bash
url: http://localhost:4000

google_analytics: #UA-68409070-1
disqus_user: #sandeepbhardwaj
```

and when i push my site to github it automatically pick the default config file <code>_config.yml</code> and build the site using default one.
