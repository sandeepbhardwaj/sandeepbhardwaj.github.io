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

---

        ## Problem 1: Use JPMS to Clarify Boundaries, Not to Create Packaging Drama

        Problem description:
        Large codebases want stronger encapsulation, but JPMS adoption often stalls because reflection, split packages, and build tooling are not mapped before the first migration step.

        What we are solving actually:
        We are solving architectural boundaries in a codebase that already has history. JPMS is useful when it exposes ownership and dependencies incrementally, not when it is introduced as a big-bang purity project.

        What we are doing actually:

        1. start with one boundary where package ownership is already relatively clean
2. remove split packages before introducing module descriptors
3. catalog reflection and deep framework access that will need `opens` or redesign
4. migrate in slices so tests and builds keep giving feedback after each step

        ```mermaid
flowchart LR
    A[module orders.api] --> B[module orders.core]
    B --> C[module orders.persistence]
    C --> D[explicit exports / opens]
```

        This section is worth making concrete because architecture advice around java module system jpms large codebases often stays too abstract.
        In real services, the improvement only counts when the team can point to one measured risk that became easier to reason about after the change.

        ## Production Example

        ```java
        module com.example.orders.core {
    exports com.example.orders.api;
    requires com.example.orders.persistence;
}
        ```

        The code above is intentionally small.
        The important part is not the syntax itself; it is the boundary it makes explicit so code review and incident review get easier.

        ## Failure Drill

        Try to modularize a package graph with reflection-heavy frameworks and split packages in one step. The result is usually confusion, not encapsulation, and that is precisely why incremental migration matters.

        ## Debug Steps

        Debug steps:

        - scan for reflective access before locking packages down
- avoid using `open module` as a blanket escape hatch without documenting why
- fix package ownership first so module boundaries reflect real architecture
- run integration tests with the module path early in the migration, not at the end

        ## Review Checklist

        - Start where package ownership is already clean.
- Document every `opens` with a reason.
- Treat JPMS as boundary work, not syntax work.
