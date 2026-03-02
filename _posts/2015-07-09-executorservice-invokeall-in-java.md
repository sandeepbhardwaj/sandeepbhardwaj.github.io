---
title: ExecutorService invokeAll Example in Java
date: '2015-07-09'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- executorservice
- callable
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ExecutorService invokeAll Example in Java
seo_description: Understand how invokeAll runs multiple callables and returns ordered
  Future results.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# ExecutorService `invokeAll` in Java

`invokeAll` submits a collection of `Callable` tasks and waits until all complete.

## Real-World Use Cases

- fan-out calls to multiple downstream services
- parallel enrichment of API responses
- independent report section generation

## Java 8 Example

```java
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.*;

public class InvokeAllExample {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        List<Callable<String>> tasks = Arrays.asList(
                () -> "profile-ok",
                () -> "orders-ok",
                () -> "recommendations-ok"
        );

        List<Future<String>> futures = pool.invokeAll(tasks);
        for (Future<String> future : futures) {
            System.out.println(future.get());
        }

        pool.shutdown();
    }
}
```

## JDK 11 and Java 17 Notes

For `invokeAll`, there is no major behavioral API shift in JDK 11 or Java 17. Main improvements in those versions are around the broader platform and JVM internals.

## Java 21+ Alternative

For request-scoped orchestration and cancellation, prefer structured concurrency style (`StructuredTaskScope`) where available.

## Java 25 Note

`invokeAll` remains valid and stable. Use timeout variants for resilience in production.

## Key Takeaways

- `invokeAll` is a simple all-or-nothing wait pattern.
- Combine with timeout to avoid indefinite waiting.
- Handle partial failures explicitly when aggregating results.
