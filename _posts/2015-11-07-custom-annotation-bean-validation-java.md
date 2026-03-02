---
title: Custom Annotation for Validating a Bean in Java
date: '2015-11-07'
categories:
- Java
tags:
- java
- annotations
- validation
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Custom Annotation for Bean Validation in Java
seo_description: Build a custom annotation-based validator using Java reflection.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Custom Annotation for Validating a Bean in Java

This example validates that bean fields are not `null` using a custom class-level annotation.

## Step 1: Define Annotation

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotNullAndNotEmpty {
}
```

## Step 2: Validator Using Reflection

```java
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class NotNullAndNotEmptyValidator {

    public static List<String> validate(Object obj) {
        List<String> errors = new ArrayList<>();

        if (obj.getClass().getAnnotation(NotNullAndNotEmpty.class) == null) {
            return errors;
        }

        for (Field field : obj.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                if (field.get(obj) == null) {
                    errors.add(field.getName() + " is null or empty");
                }
            } catch (IllegalAccessException e) {
                errors.add("Cannot access field " + field.getName());
            }
        }

        return errors;
    }
}
```

## Step 3: Use on Model

```java
@NotNullAndNotEmpty
public class Employee {
    private String name;
    private String address;

    public Employee(String name, String address) {
        this.name = name;
        this.address = address;
    }
}
```

## Step 4: Run

```java
Employee emp = new Employee("Sandeep", null);
System.out.println(NotNullAndNotEmptyValidator.validate(emp));
```

Output:

```text
[address is null or empty]
```

For production, prefer Jakarta Bean Validation (`@NotNull`, `@NotBlank`) unless custom behavior is required.

## Production API Equivalent (Jakarta Bean Validation)

```java
import jakarta.validation.constraints.NotBlank;

public class EmployeeRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String address;

    // getters/setters
}
```

Spring Boot controller usage:

```java
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
class EmployeeController {
    @PostMapping("/employees")
    public String create(@Valid @RequestBody EmployeeRequest request) {
        return "created";
    }
}
```

This gives standard validation error handling and integrates cleanly with modern Java 21+ service stacks.

## JDK 11 and Java 17 Notes

- JDK 11 projects often use `javax.validation` namespace.
- Java 17 era projects (especially Spring Boot 3+) commonly use `jakarta.validation`.
- Validation concepts are the same; package namespace is the key migration point.

## Key Takeaways

- Prefer simple APIs and explicit behavior.
- Document edge cases and failure modes early.
- Keep examples small, testable, and production-oriented.
