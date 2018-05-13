---
  layout: post
  title: Varargs:- Variable argument method in Java 5
  published: true
  category: Java
  tags: [Java]
  date: 2011-02-16 13:30:00 +5:30
---
Varargs enables to write methods which can takes variable length of arguments.Varargs was added in Java 5 and the syntax includes three dots … provides the functionality to pass any number of arguments to a method.

<h3>Syntax</h3>

``` java
public void showDepartmentEmp(int deptCode, String... deptEmp){}
```

<b>Example</b>

``` java
public class Department {

    public static void main(String args[]) {
     showDepartmentEmp(100, "Sandeep", "Gaurav");
     showDepartmentEmp(111, "Meenakshi", "Aditya", "Saurabh");
    }

    public static void showDepartmentEmp(int deptCode, String... deptEmp) {
        System.out.print("\n"+deptCode);
        for(String emp: deptEmp) {
            System.out.print(", " + emp);
        }
    }
}
```
