---
  layout: post
  title: Anatomy of Class.forName() method
  published: false
  tags: [Ant]
  date: 
---
Class.forName()

    Class.forName("XYZ") method dynamically loads the class XYZ (at runtime).
    Class.forName("XYZ") initialized class named XYZ (i.e., JVM executes all its static block after class loading).
    Class.forName("XYZ") returns the Class object associated with the XYZ class. The returned Class object is not an instance of the XYZ class itself.

Class.forName("XYZ")loads the class if it not already loaded. The JVM keeps track of all the classes that have been previously loaded. The XYZ is the fully qualified name of the desired class.

For example,


package com.usebrain.util;

public class LoadClass {
 static {
  System.out.println("************LoadClass static block************");
 }
}


package com.usebrain.action;

public class Test {

 public static void main(String[] args) {
  try {
   Class c = Class.forName("com.usebrain.util.LoadClass");
  } catch (ClassNotFoundException e) {
   e.printStackTrace();
  }
 }
}

Example that use returned Class to create an instance of LoadClass:


package com.usebrain.util;

public class LoadClass {
 static {
  System.out.println("************LoadClass static block************");
 }
 
 public LoadClass() {
     System.out.println("*************LoadClass Constructor************");
   }
}


package com.usebrain.action;

import com.usebrain.util.LoadClass;

public class Test {

 public static void main(String[] args) {

  try {
   System.out.println("first time calls forName method");

   Class loadObj = Class.forName("com.usebrain.util.LoadClass");
   LoadClass loadClass = (LoadClass) loadObj.newInstance();

   System.out.println("\nsecond time calls forName method");
   Class.forName("com.usebrain.util.LoadClass");

  } catch (InstantiationException e) {
   e.printStackTrace();
  } catch (IllegalAccessException e) {
   e.printStackTrace();
  } catch (ClassNotFoundException e) {
   e.printStackTrace();
  }
 }
}

Output


first time calls forName method
************LoadClass static block************
*************LoadClass Constructor************

second time calls forName method

Class already loaded when Class.forName() execute first time so at second time when Class.forName() execute not loads the class again.