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
  show_overlay_excerpt: false
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

This class-level annotation is fine for demos, but production validators usually need configurability.

Example: allow specific fields to be ignored.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotNullAndNotEmpty {
    String[] ignoreFields() default {};
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

## Improve the Validator: Null + Blank + Empty Collection

Many real payloads need more than null checks.

```java
private static boolean isInvalid(Object value) {
    if (value == null) return true;
    if (value instanceof String s) return s.isBlank();
    if (value instanceof Collection<?> c) return c.isEmpty();
    if (value instanceof Map<?, ?> m) return m.isEmpty();
    return false;
}
```

Use this inside your field loop to generate precise messages.

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

## Performance and Safety Notes

Reflection-based validation is convenient but has runtime overhead.

Practical guidance:

1. cache `Field[]` metadata per class if validation is frequent
2. avoid `setAccessible(true)` where strong encapsulation policies disallow it
3. include field path in errors for nested objects
4. keep custom validators deterministic (no I/O, no database checks)

## Example: Metadata Cache

```java
private static final ConcurrentHashMap<Class<?>, Field[]> FIELD_CACHE = new ConcurrentHashMap<>();

private static Field[] fieldsOf(Class<?> type) {
    return FIELD_CACHE.computeIfAbsent(type, Class::getDeclaredFields);
}
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

## When Custom Annotation Is Still Useful

Use custom validation when:

- rule spans multiple fields (cross-field constraints)
- validation depends on domain-specific semantics
- you need custom error code mapping for clients

In these cases, prefer implementing a standard Bean Validation `ConstraintValidator` so it still integrates with framework error handling.

## JDK 11 and Java 17 Notes

- JDK 11 projects often use `javax.validation` namespace.
- Java 17 era projects (especially Spring Boot 3+) commonly use `jakarta.validation`.
- Validation concepts are the same; package namespace is the key migration point.

## Key Takeaways

- Prefer simple APIs and explicit behavior.
- Document edge cases and failure modes early.
- Keep examples small, testable, and production-oriented.
- Use custom annotations selectively; default to standard Bean Validation first.
