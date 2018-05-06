---
  layout: post
  title: Set Maven Home on Ubuntu
  published: true
  category: Java
  tags: [Ubuntu , Java]
  date: 2016-01-22 12:00:00 +5:30
---

Setting the environment variable in Ubuntu in really easy, just need to edit the <b>/etc/profile</b>. Just add your maven installation directory as below.

Open the /etc/profile file in your favorite editor.

``` bash
sudo gedit /etc/profile
```

Add following lines in end

``` bash
M2_HOME=/data/dev/tools/apache-maven-3.3.9
PATH=$PATH:$M2_HOME/bin
export M2_HOME
export PATH
```

Verify the M2_HOME
``` bash
echo $M2_HOME
```

Check the maven version
``` bash
mvn -v
```

Output
``` bash
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-10T22:11:47+05:30)
Maven home: /data/dev/tools/apache-maven-3.3.9
Java version: 1.8.0_60, vendor: Oracle Corporation
Java home: /usr/local/java/jdk1.8.0_60/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.19.0-47-generic", arch: "amd64", family: "unix"
```
