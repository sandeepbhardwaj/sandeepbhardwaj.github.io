---
layout: post
title: Install Gradle on Ubuntu
author: Sandeep Bhardwaj
published: true
date: 2016-01-30 17:00:00 +5:30
tags: [Ubuntu , Java]
keywords: [Ubuntu, Gradle , GRADLE_HOME, GRADLE_USER_HOME]
summary: "Install Gradle on Ubuntu, How to set GRADLE_HOME on Ubuntu, How to set GRADLE_USER_HOME on Ubuntu, Change default location of Gradle repository on Ubuntu"
---

1) Download the latest Gradle version from [Gradle Download page](http://gradle.org/gradle-download/).

2) Extract the binaries to the desired location.

3) Set the <code>GRADLE_HOME</code> environment variable.

Setting the environment variable in Ubuntu in really easy, just need to edit the <code>/etc/profile</code>. Just add your gradle installation directory as below.

Open the /etc/profile file in your favorite editor.

``` bash
sudo gedit /etc/profile
```

Add below lines in end.

``` bash
GRADLE_HOME=/data/dev/tools/gradle-2.10
PATH=$PATH:$GRADLE_HOME/bin
export GRADLE_HOME
export PATH
```

<b>Verify the GRADLE_HOME</b> 
``` bash
echo $GRADLE_HOME
```

<b>Verify the Gradle version</b>
``` bash
gradle -v
```

<b>Output</b>
``` bash
------------------------------------------------------------
Gradle 2.10
------------------------------------------------------------

Build time:   2015-12-21 21:15:04 UTC
Build number: none
Revision:     276bdcded730f53aa8c11b479986aafa58e124a6

Groovy:       2.4.4
Ant:          Apache Ant(TM) version 1.9.3 compiled on December 23 2013
JVM:          1.8.0_60 (Oracle Corporation 25.60-b23)
OS:           Linux 3.19.0-47-generic amd64
```

<h2>Set <code>GRADLE_USER_HOME</code> on Ubuntu</h2>
Next if you wants to override the default location of gradle local repository.

Again edit the  <b>/etc/profile</b> like we did it above and add below line in the end.

``` bash
export GRADLE_USER_HOME=/data/dev/repository/gradle
```
