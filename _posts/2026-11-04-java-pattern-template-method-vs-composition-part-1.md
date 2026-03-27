---
title: Template method vs composition in framework extension points
date: 2026-11-04
categories:
- Java
- Design Patterns
- Architecture
tags:
- java
- design-patterns
- architecture
- backend
- software-design
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Template method vs composition in framework extension points - Advanced
  Guide
seo_description: Advanced practical guide on template method vs composition in framework
  extension points with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Design Patterns with Java
---
Template Method and composition both solve extension problems, but they make very different bets.
Template Method says, "subclasses may customize these steps."
Composition says, "inject collaborators and keep inheritance shallow."

Both can work.
The difference shows up later, when the framework has to evolve without turning every subclass into fragile glass.

## Quick Comparison

| Question | Template Method | Composition |
| --- | --- | --- |
| Is the overall algorithm stable? | strong fit | also possible |
| Do extension points need strict ordering? | strong fit | requires more explicit orchestration |
| Is subclassing already part of the framework contract? | strong fit | mixed |
| Do you expect many orthogonal variations? | weak | strong |
| Is debugging inheritance chains already painful? | weak | stronger choice |

The more variation points you have, the more composition usually wins.

## A Typical Framework Pressure

Suppose a batch job framework always performs:

1. load input
2. validate data
3. transform records
4. write output

If that algorithm skeleton is stable and only a couple of steps vary, Template Method can be a clean fit.

If teams keep asking for different validation rules, different output sinks, optional retries, metrics, tracing, and tenant-specific branching, composition usually ages better.

## Template Method Example

```java
public abstract class CsvImportJob {
    public final void run(Path file) {
        List<String> rows = load(file);
        validate(rows);
        List<Record> records = transform(rows);
        write(records);
    }

    protected List<String> load(Path file) {
        return List.of();
    }

    protected abstract void validate(List<String> rows);
    protected abstract List<Record> transform(List<String> rows);
    protected abstract void write(List<Record> records);
}
```

This is nice when the algorithm really is fixed and the hooks are few and well understood.

## Why Composition Often Overtakes It

The same design can be modeled with collaborators:

```java
public final class CsvImportJob {
    private final Validator validator;
    private final Transformer transformer;
    private final Writer writer;

    public CsvImportJob(Validator validator, Transformer transformer, Writer writer) {
        this.validator = validator;
        this.transformer = transformer;
        this.writer = writer;
    }

    public void run(Path file) {
        List<String> rows = List.of();
        validator.validate(rows);
        List<Record> records = transformer.transform(rows);
        writer.write(records);
    }
}
```

Composition often wins because it keeps variation local:

- swap one collaborator without subclassing the whole job
- test one rule at a time
- mix and match policies more easily
- avoid fragile protected hooks

## The Real Tradeoff

Template Method is strongest when:

- the algorithm order is stable
- the framework owns the lifecycle
- extension points are narrow and intentional

Composition is strongest when:

- variation points keep growing
- different concerns evolve at different speeds
- multiple combinations must coexist
- inheritance would couple unrelated choices together

The mistake is not using Template Method.
The mistake is using it after the hook count has already become a warning sign.

## Where Template Method Goes Wrong

### Too many hooks

Once subclasses override many protected methods, the base class becomes hard to reason about.

### Hidden ordering dependencies

If overriding one hook requires understanding three others, extension is no longer safe.

### Subclass explosion

If the team starts naming classes like `RetryingValidatedTracingCsvImportJob`, inheritance has already become a combinatorial problem.

## Where Composition Goes Wrong

### Over-fragmentation

Splitting trivial behavior into too many tiny interfaces can make the flow harder to follow than a well-designed base class.

### No clear orchestration owner

Composition still needs one place that owns algorithm order.
Without that, the design becomes "everything is injectable, but nobody knows the lifecycle."

## A Practical Decision Rule

Choose Template Method when:

1. the algorithm skeleton is stable
2. the framework should strongly control execution order
3. the allowed extension hooks are few and well defined

Choose composition when:

1. behavior combinations are growing
2. variation points are orthogonal
3. independent testing and replacement matter more than subclass convenience

## Testing and Maintenance Lens

A good framework question is:
"What will be easier to extend six months from now without accidental breakage?"

If the answer depends on developers memorizing which protected methods are safe to override, Template Method may already be overstretched.

If the answer depends on twenty injected collaborators with unclear ownership, composition may be overdone.

## Key Takeaways

- Template Method controls an algorithm through inheritance.
- Composition controls variation through collaborators.
- Stable skeletons favor Template Method.
- Growing combinations and independent change usually favor composition.
