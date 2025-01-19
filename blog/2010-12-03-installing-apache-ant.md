---
  layout: post
  title: Installing Apache Ant
  published: true
  date: 2010-12-03 22:00:00 +5:30
  author: Sandeep Bhardwaj
  tags: [Ant]
  keywords: [Ant, ANT_HOME, JAVA_HOME, CLASSPATH, PATH]
  summary: "How to install apache ant, How to set java home, install apache ant"
---

Apache Ant is a Java-based build tool.  

<h3>Download Ant</h3>  
Download Apache ANT from this URL. [http://ant.apache.org/bindownload.cgi](http://ant.apache.org/bindownload.cgi)  

<h3>Installing Ant</h3> 
The binary distribution of Ant consists of the following directory layout:  
ant  

``` bash
   +--- bin  // contains launcher scripts  
   |  
   +--- lib  // contains Ant jars plus necessary dependencies  
   |  
   +--- Extra directories  
``` 

Only the bin and lib directories are required to run Ant.  
To install Ant, choose a directory and copy the distribution files and extract there. This directory will be known as ANT_HOME.  

<h3>Setup</h3>  
The ant.bat script makes use of three environment variables –

1.  ANT_HOME,
2.  CLASSPATH (optional not required )and
3.  JAVA_HOME.

Assume Ant is installed in c:\ apache-ant-1.8.1\. The following sets up the environment:  

``` bash
set ANT_HOME=c:\apache-ant-1.8.1  
set JAVA_HOME=C:\jdk1.6.0_20  
set PATH=%PATH%;%ANT_HOME%\bin 
``` 

<h3>Check Installation</h3>  
You can check the basic installation with opening a command prompt and typing  

``` bash 
C:\>ant -version  
Apache Ant version 1.8.1 compiled on April  30 2010  
``` 