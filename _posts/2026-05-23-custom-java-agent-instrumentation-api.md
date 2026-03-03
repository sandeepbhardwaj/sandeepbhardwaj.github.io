---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-23
seo_title: "Custom Java Agent Instrumentation API Guide"
seo_description: "Instrument Java bytecode at load time for telemetry, policy checks, and diagnostics."
tags: [java, javaagent, instrumentation, observability]
canonical_url: "https://sandeepbhardwaj.github.io/java/custom-java-agent-instrumentation-api/"
title: "Building a Custom Java Agent (Instrumentation API)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Load Time Instrumentation and Runtime Introspection"
---

# Building a Custom Java Agent (Instrumentation API)

Java agents let you instrument classes without modifying application source code.
They are powerful for tracing, profiling, and policy enforcement, but they run at platform-critical boundaries.

---

## Entry Modes

- `premain(String, Instrumentation)`: loaded at JVM startup via `-javaagent`
- `agentmain(String, Instrumentation)`: attached to running JVM (dynamic attach)

Use `premain` for predictable startup instrumentation.
Use `agentmain` for diagnostics and emergency attach workflows.

---

## Minimal, Targeted Transformer

```java
public final class Agent {

    public static void premain(String args, Instrumentation inst) {
        ClassFileTransformer transformer = (loader, className, classBeingRedefined, domain, bytes) -> {
            if (className == null || !className.startsWith("com/company/service/")) {
                return null; // no change
            }
            return transformClass(className, bytes);
        };

        inst.addTransformer(transformer, true);
    }

    private static byte[] transformClass(String className, byte[] original) {
        // Apply bytecode transformation with ASM/ByteBuddy and return modified bytes.
        return original;
    }
}
```

Return `null` when no transformation is needed to reduce overhead.

---

## Manifest Requirements

Agent JAR manifest typically includes:

- `Premain-Class: com.company.agent.Agent`
- `Agent-Class: com.company.agent.Agent` (if dynamic attach supported)
- `Can-Redefine-Classes: true` (only if needed)
- `Can-Retransform-Classes: true` (only if needed)

Enable capabilities only when required.

---

## Safe Transformation Rules

- instrument only explicit package/method targets
- avoid transforming JDK/core framework classes unless absolutely necessary
- keep transformation deterministic and idempotent
- fail closed to no-op on transform errors (do not crash app by default)

Agent bugs can break application startup; treat code with platform-level rigor.

---

## Dry Run: Request Timing Instrumentation

1. canary deploy with `-javaagent:agent.jar=mode=observe,packages=com.company.api`.
2. transformer adds timing hooks to controller methods only.
3. measure startup delta, p95 latency delta, and CPU overhead.
4. compare canary vs control cluster.
5. expand scope gradually if overhead stays within budget.

Keep kill switch in agent args to disable instrumentation instantly.

---

## Testing Strategy

- bytecode golden tests for transformed classes
- integration tests on target JDK versions
- startup tests with agent enabled/disabled
- stress tests for retransformation and classloader interactions

Agents must be tested against the same runtime matrix as production.

---

## Common Mistakes

- broad instrumentation patterns (`com/.*`) in first rollout
- mutating method semantics instead of adding orthogonal telemetry
- unbounded logging from transformer path
- ignoring classloader-specific behavior in app servers/plugins

---

## Key Takeaways

- Java agents are best for cross-cutting runtime instrumentation with strict scope.
- prioritize deterministic transforms, feature flags, and rollback safety.
- roll out like an infrastructure change, not a normal library upgrade.
