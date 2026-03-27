---
title: Java Module System (JPMS) for Large Codebases
date: 2026-05-19
categories:
- Java
- Backend
tags:
- java
- jpms
- modules
- architecture
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Java Module System JPMS Guide for Large Codebases
seo_description: Use JPMS for dependency boundaries, stronger encapsulation, and modular
  runtime images.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Strong Encapsulation and Dependency Boundaries
---
JPMS is most valuable when a codebase already knows it has architecture boundary problems and wants the compiler and runtime to help enforce the rules.

That is the right way to think about it. JPMS is not mainly a packaging feature. It is a boundary-enforcement tool. In large codebases, that can be extremely useful, but only when the migration is grounded in real ownership and dependency cleanup.

---

## What JPMS Actually Gives You

The useful promises are concrete:

- explicit dependencies through `requires`
- explicit public surface through `exports`
- strong encapsulation of internal packages
- targeted reflective access through `opens`

That is stronger than naming conventions, architecture docs, or hoping people do not import the wrong package.

---

## Why Large Codebases Struggle With It

The friction usually comes from history, not from module syntax.

Common blockers:

- split packages
- unclear subsystem ownership
- reflection-heavy frameworks
- old assumptions that everything lives happily on the classpath

That is why JPMS migrations fail when treated as a one-step modernization task. The module descriptor only works well when the architecture underneath it is already becoming clearer.

---

## A Small `module-info.java` Is Enough to Show the Point

```java
module com.company.billing {
    requires com.company.common;
    requires java.sql;

    exports com.company.billing.api;
    exports com.company.billing.dto;

    opens com.company.billing.persistence to org.hibernate.orm.core;
}
```

The important distinction is deliberate exposure:

- `exports` says what other modules may compile against
- `opens` says what reflective frameworks may inspect

That difference is where a lot of the design value sits.

---

## Start With a Boundary That Is Already Mostly Clean

The most practical migration strategy is incremental:

1. choose a leaf or library module with relatively clean package ownership
2. remove split packages first
3. identify the real API packages
4. modularize that slice
5. use the feedback to guide the next module

This is much more effective than trying to modularize the whole monolith while still discovering its dependency problems.

---

## Reflection Is the Most Honest Part of the Migration

JPMS often exposes things teams were already doing implicitly:

- frameworks reaching into internals
- deep reflective access without clear policy
- accidental coupling to non-public details

When `InaccessibleObjectException` shows up, that is not merely JPMS being annoying. It is often architecture feedback.

The right reaction is not usually "open everything." It is to ask:

- should this package really be reflective framework surface?
- should the design expose a narrower API instead?
- if `opens` is necessary, can it be targeted rather than global?

> [!TIP]
> Every `opens` should have a reason. If it does not, the migration is probably weakening the very boundary JPMS was meant to strengthen.

---

## `open module` Is a Big Escape Hatch

Sometimes teams fall back to `open module ...` to get moving again.

That can be useful as a temporary bridge, but it should be treated as migration debt, not as the end state. Otherwise the codebase keeps module syntax without getting much of the encapsulation benefit.

The better long-term pattern is:

- use narrow `opens` where reflection is required
- keep `exports` small
- document why each exception exists

---

## Good CI Guardrails Matter More Than the First Descriptor

Once a few modules exist, the bigger risk is drift.

Useful guardrails include:

- `jdeps` checks for unexpected dependencies
- failing builds on new split packages
- tracking module graph changes over time
- running integration tests on the module path early

```bash
jdeps --recursive --multi-release 21 build/libs/app.jar
```

JPMS pays off when the boundary rules keep holding after the initial migration.

---

## A Better Rollout Story

Imagine a 40-module monolith.

A realistic path is:

1. modularize one reporting or utility leaf
2. fix the reflective and packaging issues it exposes
3. add CI checks so those issues do not return
4. continue with the next cleanest slice
5. modularize the top-level app later, once dependency direction is healthier

That gives the team repeated feedback loops instead of one massive migration cliff.

---

## When JPMS Is Not Yet the Right Move

If the codebase still has:

- blurred ownership
- widespread split packages
- deep runtime reflection with no discipline
- build tooling that is already fragile

then the first step may be architecture cleanup rather than module descriptors.

JPMS helps enforce boundaries. It does not invent good ones out of chaos.

---

## Key Takeaways

- JPMS is strongest as an architectural enforcement tool, not a packaging exercise.
- Large-codebase success depends on incremental migration and honest dependency cleanup.
- `exports` and `opens` should be deliberate and narrow.
- The best migrations use compiler and CI feedback to keep boundaries from sliding backward.
