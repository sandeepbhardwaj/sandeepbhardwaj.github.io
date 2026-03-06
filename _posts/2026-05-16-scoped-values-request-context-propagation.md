---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-16
seo_title: Scoped Values Request Context Propagation Guide
seo_description: Propagate immutable request context safely across concurrent Java
  execution paths.
tags:
- java
- scoped-values
- concurrency
- backend
title: Scoped Values for Request Context Propagation in Java
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Immutable Context Propagation Without ThreadLocal Drift
---
Scoped values provide immutable, lexically scoped context propagation.
They are a safer replacement for many `ThreadLocal` use cases in concurrent Java services.

---

## Why Teams Move Away from ThreadLocal

`ThreadLocal` commonly causes:

- context bleed on pooled threads when cleanup is missed
- hidden mutable state across call chains
- fragile behavior in async boundaries

Scoped values solve this by making context lifetime explicit in code.

---

## Basic Pattern

```java
static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();

void handle(Request req) {
    String requestId = req.header("X-Request-Id");
    ScopedValue.where(REQUEST_ID, requestId).run(() -> {
        serviceA();
        serviceB();
    });
}

void serviceA() {
    logger.info("requestId={}", REQUEST_ID.get());
}
```

`REQUEST_ID` is only readable inside the lexical scope.

---

## What Belongs in Scoped Values

Good candidates:

- trace/request correlation ID
- tenant ID
- security principal ID

Avoid putting:

- mutable objects
- large payloads
- domain entities that should be passed explicitly

Use scoped values for cross-cutting metadata, not business data transport.

---

## Virtual Threads + Scoped Values

Scoped values work naturally with virtual-thread request models.
Bind once at request entry and read across nested calls without explicit parameter threading everywhere.

```java
static final ScopedValue<String> TENANT = ScopedValue.newInstance();

try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    exec.submit(() -> ScopedValue.where(TENANT, "tenant-a").run(() -> {
        billingService.charge();
        auditService.record();
    }));
}
```

---

## Dry Run: HTTP Request Lifecycle

1. HTTP filter extracts `X-Request-Id` and `tenant-id`.
2. filter binds scoped values and invokes controller.
3. controller/service/repository logs include scoped context.
4. response returns; lexical scope ends automatically.
5. next request on reused platform thread sees no old context.

This directly prevents cross-request context leakage.

---

## Testing Guidance

- add integration test that sends two requests with different IDs and verifies logs/trace tags do not mix.
- add unit tests for methods that expect scoped context and fail fast when missing.
- keep bindings near protocol entry points (HTTP/gRPC/message listener).

---

## Key Takeaways

- scoped values provide immutable, bounded context propagation.
- they reduce thread-local leakage risk, especially with concurrency.
- use them for observability and security metadata with strict scope boundaries.
