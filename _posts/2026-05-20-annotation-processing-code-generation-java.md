---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-20
seo_title: "Annotation Processing and Code Generation in Java Guide"
seo_description: "Generate compile-time Java code for safer contracts and faster runtime behavior."
tags: [java, annotation-processing, codegen, compiler]
canonical_url: "https://sandeepbhardwaj.github.io/java/annotation-processing-code-generation-java/"
title: "Annotation Processing and Code Generation in Java"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Compile Time Generation for Safer APIs"
---

# Annotation Processing and Code Generation in Java

Annotation processing lets you generate code and validate contracts at compile time.
This reduces runtime reflection, catches errors earlier, and removes repetitive boilerplate.

---

## Good Use Cases

- mapper/adapter generation
- REST client stubs from annotated interfaces
- compile-time validation of framework annotations
- metadata registries for startup performance

Avoid generating business logic that becomes hard to debug.

---

## Minimal Annotation + Processor Shape

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface AutoFactory {}
```

```java
@SupportedSourceVersion(SourceVersion.RELEASE_21)
@SupportedAnnotationTypes("com.example.AutoFactory")
public final class AutoFactoryProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (Element element : roundEnv.getElementsAnnotatedWith(AutoFactory.class)) {
            if (element.getKind() != ElementKind.CLASS) {
                processingEnv.getMessager().printMessage(
                    Diagnostic.Kind.ERROR,
                    "@AutoFactory can only target classes",
                    element
                );
                continue;
            }
            generateFactory((TypeElement) element);
        }
        return true;
    }

    private void generateFactory(TypeElement type) {
        // Use Filer to create source file and write deterministic code.
    }
}
```

Important: always emit actionable diagnostics with exact element location.

---

## Deterministic Codegen Rules

Generated output should be stable across machines and build runs.

- sort members and elements before generation
- avoid timestamps/random IDs in generated files
- keep formatting consistent to reduce diff noise

Deterministic output is mandatory for trustworthy CI and reviews.

---

## Incremental Build Considerations

Processors that read unrelated files/classpath resources can break incremental compilation.
Keep processing local to annotated elements where possible.

If processor is aggregating (global index generation), document that cost and test build impact.

---

## Dry Run: Introducing Codegen in Existing Service

1. add annotation and processor in dedicated `processor` module.
2. generate code for one simple target (for example `UserMapper`).
3. compare generated output with handwritten baseline.
4. enforce compile failure on invalid annotation usage.
5. add snapshot tests for generated source.
6. migrate remaining boilerplate gradually.

This keeps adoption safe and reviewable.

---

## CI and Quality Checklist

- fail build on processor errors.
- include generated sources in test compilation.
- add golden-file tests for key generated classes.
- run clean builds in CI to detect missing generation dependencies.
- verify IDE and CI produce identical generated output.

---

## Common Mistakes

- silently skipping invalid annotations instead of failing compilation
- generating unreadable code no one can troubleshoot
- mixing runtime dependencies into processor module
- non-deterministic generation order causing flaky diffs

---

## Key Takeaways

- annotation processing is powerful for compile-time safety and boilerplate removal.
- processor quality depends on diagnostics, determinism, and build behavior.
- treat generated code as production code with tests and review discipline.
