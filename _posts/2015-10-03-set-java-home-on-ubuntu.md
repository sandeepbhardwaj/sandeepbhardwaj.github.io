---
  layout: post
  title: Set Java Home On Ubuntu
  published: true
  tags: [Linux , Java]
  date: 2015-10-03 19:00:00 +5:30
---

Setting the environment variable in Ubuntu in really easy, just need to edit the <b>/etc/profile</b>. Just add your java installation directory as below.

Open the /etc/profile file in your favorite editor.

{% highlight bash %}
sudo gedit /etc/profile
{% endhighlight %}

Add following lines in end

{% highlight bash %}
JAVA_HOME=/usr/local/java/java/jdk1.8.0_60
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin
export JAVA_HOME
export JRE_HOME
export PATH
{% endhighlight %}

<b>Note:</b>
For Installing Java on Ubuntu follow the [post]({% post_url 2015-10-03-install-oracle-jdk-on-ubuntu %})