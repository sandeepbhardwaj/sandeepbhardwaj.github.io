---
  layout: post
  title: Hello World using Apache ANT
  published: false
  tags: [Ant]
  date: 
---
Old way of compile a project, making jar and running the jar


Project Structure

Make project structure using command prompt like


H:\>md DemoProject
H:\>md DemoProject\src\hello
H:\>md DemoProject\build\classes


Make a java class

Now make a simple java class HelloWorld


package hello;

public class HelloWorld {

    public static void main(String[] args) {

        System.out.println("Hello World");

    }

}

Compile the code

Compile the java cod using the command below


H:\>javac -sourcepath DemoProject\src -d DemoProject\build\classes DemoProject\src\hello\HelloWorld.java

Make the jar

To make the jar file we need to create manifest file containing the information of class with contain main method.


H:\>cd DemoProject
H:\DemoProject>md build\jar
H:\DemoProject>jar cfm build\jar\HelloWorld.jar myManifest -C build\classes .

Run the code

Now we can run our HelloWorld jar file using the command below.


H:\DemoProject>java -jar build\jar\HelloWorld.jar Hello World


Now doing with Smarter way using Ant


By using ant we just need to execute 4 steps.

Create only source (src) directory and place HelloWorld.java in to hello folder and manifest file parallel to src folder do not need to create build directory, it will created by ant.


H:\>md DemoProject
H:\>md DemoProject\src\hello

Step 1:

Create a build.xml file (By default Ant uses build.xml) in to DemoProject directory (parallel to the src directory)




      
            
      

      
            
            
      

      
            
            
                  
                        
                  
            
      

      
            
      


Step 2:

Compile the code (move to the DemoProject directory before running the commands)


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

Step 3

Make the jar (pack the code)


H:\DemoProject>ant jar
Buildfile: H:\DemoProject\build.xml

jar:
    [mkdir] Created dir: H:\DemoProject\build\jar
      [jar] Building jar: H:\DemoProject\build\jar\HelloWorld.jar

BUILD SUCCESSFUL
Total time: 4 seconds

Step 4:

Run the code


H:\DemoProject>ant run
Buildfile: H:\DemoProject\build.xml

run:
     [java] Hello World

BUILD SUCCESSFUL
Total time: 4 seconds

Now you can see that using ANT makes our work easy and simpler than old technique. We can also execute all these commands in one line like this


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

Hope you like this post.

I used apache reference manual for this blog its good and simple. Use Apache manual for depth knowledge.