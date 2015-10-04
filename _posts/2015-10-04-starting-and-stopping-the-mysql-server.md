---
  layout: post
  title: Starting and Stopping the MySQL Server
  published: true
  tags: [Linux , MySql]
  date: 2015-10-04 13:30:00 +5:30
---

The MySQL server is started automatically after installation. You can check/verify the status of the MySQL server with the following command:

{% highlight bash %}
sudo service mysql status
{% endhighlight %}

Stop the MySQL server with the following command:
{% highlight bash %}
sudo service mysql stop
{% endhighlight %}

To restart the MySQL server, use the following command:

{% highlight bash %}
sudo service mysql start
{% endhighlight %}