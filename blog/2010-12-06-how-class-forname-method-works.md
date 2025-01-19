---
  layout: post
  title: How Class.forName() method works ?
  published: true
  tags: [Java]
  date: 2010-12-06 13:30:00 +5:30
---
<h2>Class.forName()</h2>
1. Class.forName("XYZ") method dynamically loads the class XYZ (at runtime).
2. Class.forName("XYZ") initialized class named XYZ (i.e., JVM executes all its static block after class loading).
3. Class.forName("XYZ") returns the Class object associated with the XYZ class. The returned Class object is not an instance of the XYZ class itself.

Class.forName("XYZ")loads the class if it not already loaded. The JVM keeps track of all the classes that have been previously loaded. The XYZ is the fully qualified name of the desired class.

<b>For example</b>

``` java
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
```

Example that use returned Class to create an instance of LoadClass:

``` java
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
```


<b>Output</b>

``` bash
first time calls forName method
************LoadClass static block************
*************LoadClass Constructor************

second time calls forName method
```

Class already loaded when Class.forName() execute first time so at second time when Class.forName() execute not loads the class again.