---
  layout: post
  title: Installing Apache Ant
  published: false
  tags: [Ant]
  date: 
---
Apache Ant is a Java-based build tool.


Download Ant

Download Apache ANT from this URL. http://ant.apache.org/bindownload.cgi


Installing Ant

The binary distribution of Ant consists of the following directory layout:

ant

   +--- bin  // contains launcher scripts

   |

   +--- lib  // contains Ant jars plus necessary dependencies

   |

   +--- Extra directories


Only the bin and lib directories are required to run Ant.

To install Ant, choose a directory and copy the distribution files and extract there. This directory will be known as ANT_HOME.


Setup

The ant.bat script makes use of three environment variables –

    ANT_HOME,
    CLASSPATH (optional not required )and
    JAVA_HOME.


Assume Ant is installed in c:\ apache-ant-1.8.1\. The following sets up the environment:

set ANT_HOME=c:\apache-ant-1.8.1

set JAVA_HOME=C:\jdk1.6.0_20

set PATH=%PATH%;%ANT_HOME%\bin


Check Installation

You can check the basic installation with opening a command prompt and typing


C:\>ant -version
Apache Ant version 1.8.1 compiled on April  30 2010