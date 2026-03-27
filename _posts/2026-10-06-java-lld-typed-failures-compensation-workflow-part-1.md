---
title: Typed failure models and compensation-aware workflow design
date: 2026-10-06
categories:
- Java
- Design
- Architecture
tags:
- java
- lld
- oop
- architecture
- design
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Typed failure models and compensation-aware workflow design - Advanced
  Guide
seo_description: Advanced practical guide on typed failure models and compensation-aware
  workflow design with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
Workflows become dangerous when every failure is flattened into "throw exception and retry later."
That hides the most important question:
what kind of failure just happened, and what is the system now obligated to do about it?

Typed failure models matter because not all failures mean the same thing.
Some should retry.
Some should stop permanently.
Some should trigger compensation because state has already changed elsewhere.

## Quick Summary

| Failure category | Meaning | Typical action |
| --- | --- | --- |
| validation failure | request is invalid under current rules | reject immediately |
| transient failure | dependency may succeed later | retry with policy |
| permanent integration failure | external call will not succeed without intervention | surface and park |
| partial completion | one step succeeded before another failed | compensate or continue recovery |
| stale command | workflow moved on | reject as outdated |

Part 1 is about building a baseline model where failure shape stays explicit instead of disappearing into generic exceptions.

## The Design Smell

Consider a booking workflow:

1. reserve inventory
2. charge payment
3. issue confirmation

The naive code often looks like this:

```java
public void placeOrder(PlaceOrder command) {
    inventoryGateway.reserve(command.items());
    paymentGateway.charge(command.payment());
    confirmationGateway.send(command.customerId());
}
```

If `charge()` fails after inventory was reserved, the system is no longer in a neutral state.
It is in a partial-completion state.

That is exactly where "just retry" becomes ambiguous:

- retrying may double-charge
- skipping may leave inventory locked
- throwing a generic exception loses the recovery contract

## What a Typed Failure Model Buys You

Typed failures force the design to say what happened in domain terms.

For example:

```java
public sealed interface BookingFailure
        permits ValidationFailure, RetryableFailure, CompensationRequired {
}

public record ValidationFailure(String reason) implements BookingFailure {
}

public record RetryableFailure(String operation, String reason) implements BookingFailure {
}

public record CompensationRequired(String completedStep, String reason) implements BookingFailure {
}
```

Now callers can make a real decision instead of pattern-matching exception strings.

The gain is not only nicer code.
It is operational clarity:

- dashboards can group failures meaningfully
- retry logic can stay bounded
- compensations become first-class behavior
- incident response can see whether the system is inconsistent or just temporarily blocked

## Compensation Is About Obligations, Not Rollback Fantasy

Compensation is often described as "undo."
That is too simplistic.

Most real compensations are business repairs, not technical reversals:

- release reserved inventory
- issue a refund instead of reversing an already-settled payment
- mark a shipment for manual cancellation
- emit a follow-up task for operator review

That means workflow design needs to capture which steps succeeded before failure occurred.
If you do not record that, compensation logic becomes guesswork.

## A Better Baseline Model

Separate the workflow into explicit steps and explicit outcomes.

```java
public enum BookingStep {
    VALIDATED,
    INVENTORY_RESERVED,
    PAYMENT_CAPTURED,
    CONFIRMED
}

public record WorkflowResult(
        BookingStep lastCompletedStep,
        BookingFailure failure) {

    public boolean failed() {
        return failure != null;
    }
}

public final class BookingWorkflow {
    public WorkflowResult execute(PlaceOrder command) {
        validate(command);
        reserveInventory(command);

        try {
            capturePayment(command);
        } catch (TimeoutException e) {
            return new WorkflowResult(
                    BookingStep.INVENTORY_RESERVED,
                    new CompensationRequired("inventory-reserved", "payment timed out after reservation"));
        }

        sendConfirmation(command);
        return new WorkflowResult(BookingStep.CONFIRMED, null);
    }
}
```

This is still a simple baseline.
But it does one crucial thing:
it preserves state about what the workflow now owes the system.

## When Exceptions Are Still Fine

Not every failure needs a custom type hierarchy.

Plain exceptions are enough when:

- the operation is local and atomic
- no compensation exists
- the caller only needs success or failure
- the system is not orchestrating multiple side effects

For example, rejecting an invalid command inside an aggregate can still use a domain exception or validation result.

Typed failures start paying off when the workflow crosses boundaries and the next action depends on the failure category.

## The Boundary Between Domain and Orchestration

Keep these concerns separate:

- aggregates enforce local invariants
- workflow orchestration coordinates steps
- failure typing describes outcome categories
- compensation handlers repair or advance the system after partial completion

If the aggregate itself starts owning remote gateway retries and compensation logic, the model becomes hard to test and reason about.

If the orchestration layer treats every problem as the same exception, the system becomes easy to code and hard to operate.

The design sweet spot is explicit workflow outcomes above strong local invariants.

## Failure Modes Worth Making Explicit

### Retryable but not yet compensated

The workflow may choose to retry before compensating, but it should say that explicitly.
Do not let scheduler behavior silently define the business contract.

### Compensation required but unsafe to automate

Some repairs should create a task, not execute automatically.
For example, refunding a payment after fulfillment may require fraud or finance review.

### Duplicate command after partial completion

If a workflow step already succeeded, re-running the whole command may be wrong.
Idempotency keys and durable step records matter here.

### Out-of-order responses

Async callbacks can arrive after the workflow already moved on.
Typed outcomes should include enough state to reject stale completion cleanly.

## A Practical Decision Rule

Use typed failures when all three are true:

1. the workflow crosses system boundaries
2. different failure categories require different next actions
3. partial completion is possible

If not, simpler error handling is often better.

Use compensation when the system has already created an external obligation or visible side effect.
If the failed step did not change anything durable, a retry or rejection may be enough.

## Production Checklist

- failure categories match operationally different next actions
- partial completion is recorded durably
- compensation is modeled as a business repair, not assumed rollback
- retries are bounded and category-aware
- stale or duplicate commands have a defined outcome
- operators can see the last completed step and current recovery obligation

## Key Takeaways

- Typed failures are useful when the workflow must react differently to different failure categories.
- Compensation is about honoring recovery obligations after partial completion, not pretending the world rolled back.
- The baseline design should make failure shape explicit before the workflow becomes too distributed to reason about.
