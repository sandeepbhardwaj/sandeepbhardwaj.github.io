---
  layout: post
  title: Set Java Home on Ubuntu
  published: true
  category: Java
  tags: [Ubuntu , Java]
  date: 2015-10-03 19:00:00 +5:30
---

Setting the environment variable in Ubuntu in really easy, just need to edit the <b>/etc/profile</b>. Just add your java installation directory as below.

Open the /etc/profile file in your favorite editor.

``` bash
sudo gedit /etc/profile
```

Add following lines in end

``` bash
JAVA_HOME=/usr/local/java/jdk1.8.0_60
PATH=$PATH:$JAVA_HOME/bin
export JAVA_HOME
export JRE_HOME
export PATH
```

<b>Note:</b>
For Installing Java on Ubuntu follow the 
