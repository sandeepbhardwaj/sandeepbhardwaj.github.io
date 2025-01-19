---
  layout: post
  title: Install Oracle JDK on Ubuntu
  published: true
  category: Java
  tags: [Ubuntu , Java]
  date: 2015-10-03 18:08:00 +5:30
---


1) Download the jdk-8u60-linux-x64.tar.gz from the [Oracle site](http://www.oracle.com/technetwork/java/javase/downloads/index.html) (Download 64bit or 32bit based on your linux environment).

2) If you have root access then install java system-wide inside <b>/usr/local</b> directory.

First create a directory named java inside <b>/usr/local</b>
``` bash
sandeep@vivan:~$ sudo mkdir /usr/local/java/
```

after that change directory

``` bash
sandeep@vivan:~$ cd /usr/local/java/
```


<b>Note:</b> If you do not have access to root then install java inside your home directory.


3) Unpack the tarball and install Java
``` bash
sandeep@vivan:/usr/local/java$ sudo tar zxvf ~download/jdk-8u60-linux-x64.tar.gz
```

The Java files are installed in a directory /usr/local/java/jdk1.8.0_60/

4) Install the new Java source in system:

``` bash
sudo update-alternatives --install /usr/bin/javac javac /usr/local/java/jdk1.8.0_60/bin/javac 1
sudo update-alternatives --install /usr/bin/java java /usr/local/java/jdk1.8.0_60/bin/java 1
sudo update-alternatives --install /usr/bin/javaws javaws /usr/local/java/jdk1.8.0_60/bin/javaws 1
```

5) Choose default Java:
``` bash
sudo update-alternatives --config javac
sudo update-alternatives --config java
sudo update-alternatives --config javaws
```

6) Check the Java version:
``` bash
java -version
```

<b>Output</b>
``` bash
java version "1.8.0_60"
Java(TM) SE Runtime Environment (build 1.8.0_60-b27)
Java HotSpot(TM) 64-Bit Server VM (build 25.60-b23, mixed mode)
```

7) Verify the symlinks all point to the new Java location:
``` bash
ls -la /etc/alternatives/java*
```

<b>Output</b>
``` bash
lrwxrwxrwx 1 root root 36 Sep 24 19:27 /etc/alternatives/java -> /usr/local/java/jdk1.8.0_60/bin/java
lrwxrwxrwx 1 root root 37 Sep 24 15:00 /etc/alternatives/javac -> /usr/local/java/jdk1.8.0_60/bin/javac
lrwxrwxrwx 1 root root 38 Sep 24 15:06 /etc/alternatives/javaws -> /usr/local/java/jdk1.8.0_60/bin/javaws
```


<b>Note:</b>
For Setting Java HOME on Ubuntu follow the [post]({2015-10-03-set-java-home-on-ubuntu})
