---
  layout: post
  title: Set Maven Home on Ubuntu
  published: true
  tags: [Ubuntu , Java]
  date: 2016-01-22 12:00:00 +5:30
---

Setting the environment variable in Ubuntu in really easy, just need to edit the <b>/etc/profile</b>. Just add your maven installation directory as below.

Open the /etc/profile file in your favorite editor.

{% highlight bash %}
sudo gedit /etc/profile
{% endhighlight %}

Add following lines in end

{% highlight bash %}
M2_HOME=/data/dev/tools/apache-maven-3.3.9
PATH=$PATH:$M2_HOME/bin
export M2_HOME
export PATH
{% endhighlight %}

Verify the M2_HOME 
{% highlight bash %}
echo $M2_HOME
{% endhighlight %}

Check the maven version
{% highlight bash %}
mvn -v
{% endhighlight %}

Output
{% highlight bash %}
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-10T22:11:47+05:30)
Maven home: /data/dev/tools/apache-maven-3.3.9
Java version: 1.8.0_60, vendor: Oracle Corporation
Java home: /usr/local/java/jdk1.8.0_60/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.19.0-47-generic", arch: "amd64", family: "unix"
{% endhighlight %}

