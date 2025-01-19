---
  layout: post
  title: Custom Annotation for validating a Bean
  author: Sandeep Bhardwaj
  published: true
  date: 2015-11-07 14:00:00 +5:30
  category: Java
  tags: [Java]
  keywords: [Annotation, Validation]
  summary: "How to create custom annotation for validation, Create custom annotation for validating a bean/pojo"
---
Custom annotation for validating all the field of a class. If fields are null then display a message containing field name with error message.  

<h3>Annotation</h3>

``` java  
package com;  

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotNullAndNotEmpty {

}
```

<h3>Validator class</h3>

``` java  
package com;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class NotNullAndNotEmptyValidator {
  public static List<String> validate(Object obj) {
    List<String> errors = new ArrayList<String>();

    NotNullAndNotEmpty annotations = (NotNullAndNotEmpty) obj.getClass().getAnnotation(NotNullAndNotEmpty.class);

    // if annotation not found on class then return empty list
    if (annotations != null) {

      Field[] fields = obj.getClass().getDeclaredFields();
      for (Field field : fields) {
        field.setAccessible(true);
        try {
          if (field.get(obj) == null) {
            errors.add(field.getName() + " is null or empty");
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    return errors;
  }
}  
```

<h3>Usage :- Model</h3>

``` java  
package com;

@NotNullAndNotEmpty
public class Employee {
  private String name;
  private String address;

  public Employee() {

  }

  public Employee(String name, String address) {
    super();
    this.name = name;
    this.address = address;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

}
```

<h3>Run the test</h3>

``` java  
package com;

import java.util.List;

public class Test {

  public static void main(String[] args) {
    Employee emp = new Employee("Sandeep", null);

    List<String> errors = NotNullAndNotEmptyValidator.validate(emp);

    for (String error : errors) {
      System.out.println(error);
    }

  }
}
```

<h3>Output</h3>

``` java  
address is null or empty  
```
