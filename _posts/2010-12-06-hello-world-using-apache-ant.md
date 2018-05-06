---
layout: post
title: Hello World using Apache ANT
date: 2010-12-05 22:45:00 +5:30
author: Sandeep Bhardwaj
tags: [Ant]
---

<h2>Old way of compile a project, making jar and running the jar</h2>

<h3>Project Structure</h3>  
Make project structure using command prompt like  

``` bash
H:\>md DemoProject  
H:\>md DemoProject\src\hello  
H:\>md DemoProject\build\classes  
``` 

<h3>Make a java class</h3>  
Now make a simple java class HelloWorld  

``` java  
package hello;  

public class HelloWorld {  

    public static void main(String[] args) {  
        System.out.println("Hello World");  
    }  

}  
``` 

<h3>Compile the code</h3>  
Compile the java cod using the command below  

``` bash 
H:\>javac -sourcepath DemoProject\src -d DemoProject\build\classes DemoProject\src\hello\HelloWorld.java  
``` 

<h3>Make the jar</h3>  
To make the jar file we need to create manifest file containing the information of class with contain main method.  

``` bash
H:\>cd DemoProject  
H:\DemoProject>md build\jar  
H:\DemoProject>jar cfm build\jar\HelloWorld.jar myManifest -C build\classes .  
``` 

<h3>Run the code</h3>  
Now we can run our HelloWorld jar file using the command below.

``` bash 
H:\DemoProject>java -jar build\jar\HelloWorld.jar Hello World  
``` 

<h2>Now doing with Smarter way using Ant</h2>

By using ant we just need to execute 4 steps.  
Create only source (src) directory and place HelloWorld.java in to hello folder and manifest file parallel to src folder do not need to create build directory, it will created by ant.  

``` bash
H:\>md DemoProject  
H:\>md DemoProject\src\hello  
``` 

<h3>Step 1:</h3>  
Create a build.xml file (By default Ant uses build.xml) in to DemoProject directory (parallel to the src directory)  

``` xml  
<project>
  <target name="clean">
  </target>

  <target name="compile">
    <mkdir dir="build/classes">
      <javac srcdir="src" destdir="build/classes"></javac>
    </mkdir>
  </target>

  <target name="jar">
    <mkdir dir="build/jar">
      <jar destfile="build/jar/HelloWorld.jar" basedir="build/classes">
        <manifest>
          <attribute name="Main-Class" value="hello.HelloWorld"></attribute>
        </manifest>
      </jar>
    </mkdir>
  </target>

  <target name="run">
    <java jar="build/jar/HelloWorld.jar" fork="true"></java>
  </target>
</project> 
``` 

<h3>Step 2:</h3>  
Compile the code (move to the DemoProject directory before running the commands)  

``` bash 
H:\>cd DemoProject  

H:\DemoProject>ant compile  
Buildfile: H:\DemoProject\build.xml  

compile:  
    [mkdir] Created dir: H:\DemoProject\build\classes  
    [javac] H:\DemoProject\build.xml:9: warning: 'includeantruntime' was not set  
, defaulting to build.sysclasspath=last; set to false for repeatable builds  
    [javac] Compiling 1 source file to H:\DemoProject\build\classes  

BUILD SUCCESSFUL  
Total time: 8 seconds  
``` 

<h3>Step 3</h3>  
Make the jar (pack the code)  

``` bash
H:\DemoProject>ant jar  
Buildfile: H:\DemoProject\build.xml  

jar:  
    [mkdir] Created dir: H:\DemoProject\build\jar  
      [jar] Building jar: H:\DemoProject\build\jar\HelloWorld.jar  

BUILD SUCCESSFUL  
Total time: 4 seconds  
``` 

<h3>Step 4:</h3>  
Run the code  

``` bash 
H:\DemoProject>ant run  
Buildfile: H:\DemoProject\build.xml  

run:  
     [java] Hello World  

BUILD SUCCESSFUL  
Total time: 4 seconds  
``` 

Now you can see that using ANT makes our work easy and simpler than old technique. We can also execute all these commands in one line like this  

``` bash
H:\DemoProject>ant compile jar run  
Buildfile: H:\DemoProject\build.xml  

compile:  
    [mkdir] Created dir: H:\DemoProject\build\classes  
    [javac] H:\DemoProject\build.xml:9: warning: 'includeantruntime' was not set  
, defaulting to build.sysclasspath=last; set to false for repeatable builds  
    [javac] Compiling 1 source file to H:\DemoProject\build\classes  

jar:  
    [mkdir] Created dir: H:\DemoProject\build\jar  
      [jar] Building jar: H:\DemoProject\build\jar\HelloWorld.jar  

run:  
     [java] Hello World  

BUILD SUCCESSFUL  
Total time: 11 seconds  
``` 

Hope you like this post.  
I used apache reference manual for this blog its good and simple. Use Apache manual for depth knowledge.