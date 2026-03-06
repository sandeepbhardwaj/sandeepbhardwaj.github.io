---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-19
seo_title: Java Module System JPMS Guide for Large Codebases
seo_description: Use JPMS for dependency boundaries, stronger encapsulation, and modular
  runtime images.
tags:
- java
- jpms
- modules
- architecture
title: Java Module System (JPMS) for Large Codebases
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Strong Encapsulation and Dependency Boundaries
---
JPMS gives compile-time and runtime enforcement of architecture boundaries.
In large codebases, this helps stop dependency sprawl and accidental internal API usage.

---

## What JPMS Actually Enforces

- explicit module dependencies via `requires`
- explicit public surface via `exports`
- strong encapsulation of non-exported packages
- controlled reflection via `opens`

This is stronger than package naming conventions alone.

---

## Practical `module-info.java` Example

```java
module com.company.billing {
    requires com.company.common;
    requires java.sql;

    exports com.company.billing.api;
    exports com.company.billing.dto;

    opens com.company.billing.persistence to org.hibernate.orm.core;
}
```

Use `opens` only for frameworks that need reflection.
Avoid global `open module ...` unless absolutely required.

---

## Migration Strategy for Existing Monoliths

1. map current package dependency graph (`jdeps` + build graph).
2. identify stable API packages per subsystem.
3. eliminate split packages before modularization.
4. modularize leaf libraries first.
5. modularize core/shared modules after boundaries stabilize.

Trying to modularize everything at once usually stalls.

---

## Reflection and Framework Pitfalls

Common runtime errors during migration:

- `InaccessibleObjectException` from reflection into non-open packages
- libraries expecting classpath behavior on module path
- hidden dependencies on internal JDK packages

Fix by explicit `opens`/`exports` policy, not blanket weakening.

---

## Dry Run: Incremental Rollout

Scenario: 40-module monolith without JPMS.

1. choose one leaf module (`reporting-core`) and add `module-info.java`.
2. compile on module path; fix illegal accesses.
3. add CI check to prevent new split packages.
4. repeat for other leaf modules.
5. finally modularize top-level app module.

Validation after each step:

- app still boots in staging
- integration tests pass
- dependency graph remains acyclic

---

## CI Guardrails

- run `jdeps` to detect unexpected dependencies.
- fail build if internal package is used from another module.
- track module graph drift over time.

Example:

```bash
jdeps --recursive --multi-release 21 build/libs/app.jar
```

---

## Key Takeaways

- JPMS is an architectural enforcement tool, not just packaging syntax.
- success depends on disciplined `exports`/`opens` boundaries.
- migrate incrementally, starting from leaf modules with strong CI checks.
