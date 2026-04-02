---
title: 'Advanced transactional boundaries: propagation and isolation'
date: 2026-07-03
categories:
- Java
- Spring Boot
- Backend
permalink: /java/spring-boot/backend/spring-transaction-propagation-isolation-advanced-part-1/
tags:
- java
- spring-boot
- backend
- architecture
- production
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: 'Advanced transactional boundaries: propagation and isolation - Advanced
  Guide'
seo_description: 'Advanced practical guide on advanced transactional boundaries: propagation
  and isolation with architecture decisions, trade-offs, and production patterns.'
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Spring Boot Runtime Engineering
---
Transaction bugs in Spring rarely come from not knowing `@Transactional` exists.
They come from not being explicit about transaction boundaries, not understanding propagation, and assuming isolation means more than the database is actually guaranteeing.

---

## The Two Questions You Must Separate

Spring transaction design becomes much clearer once you separate these two questions:

- **Propagation**: should this method join an existing transaction, start a new one, or run outside one
- **Isolation**: what anomalies are acceptable while multiple transactions are reading and writing at the same time

Those are different decisions.
Teams often mix them together and then debug the wrong layer.

---

## What Propagation Is Really About

Propagation controls how nested service calls behave when transactions already exist.

The modes that matter most in real applications are:

- `REQUIRED`: join the current transaction if one exists, otherwise create one
- `REQUIRES_NEW`: suspend the outer transaction and start a separate one
- `NOT_SUPPORTED`: run without a transaction
- `MANDATORY`: fail if no transaction exists

Most business services should start from `REQUIRED`.
The dangerous mode is `REQUIRES_NEW`, because it looks like a small annotation choice but changes rollback semantics immediately.

---

## What Isolation Is Really About

Isolation is about correctness under concurrent access.
It answers questions like:

- can I see uncommitted changes
- can the same query return different results inside one transaction
- can rows appear or disappear between reads

The exact behavior depends on the database, not only on Spring.
That is why transaction design must be discussed together with the actual persistence engine and workload pattern.

---

## A Concrete Service Example

Consider an order flow:

```java
@Service
class CheckoutService {

    private final OrderRepository orderRepository;
    private final AuditService auditService;

    @Transactional
    public void checkout(Order order) {
        orderRepository.save(order);
        auditService.recordCheckout(order);
    }
}
```

At first glance this looks simple.
But the behavior changes dramatically depending on how `recordCheckout` is annotated.

If `AuditService.recordCheckout()` also uses `REQUIRED`, it participates in the same transaction.
If it uses `REQUIRES_NEW`, the audit write may commit even when the outer checkout later rolls back.

That can be exactly right or exactly wrong depending on the business rule.

---

## When `REQUIRES_NEW` Is Legitimate

`REQUIRES_NEW` is useful when the inner work is intentionally independent:

- audit trails that must survive business rollback
- idempotency or dedup markers
- failure reporting that should commit even when the main workflow aborts

It is a bad default for "just to be safe" transaction design.
Once you introduce it casually, you can no longer assume one business operation maps to one atomic persistence boundary.

---

## Isolation Decisions Need Real Workload Thinking

Isolation is not an abstract purity setting.
It should be driven by what the workload cannot tolerate.

Examples:

- inventory reservation may care about lost updates or write skew
- reporting queries may tolerate slightly stale reads
- ledger or balance operations usually need much stricter guarantees

The right question is not "what is the strongest isolation level?"
The better question is "what anomaly would break the business rule here?"

---

## Spring-Specific Trap: Proxy Boundaries

One of the most common misunderstandings is self-invocation.
Spring usually applies `@Transactional` through proxies, which means this can mislead you:

```java
@Service
class BillingService {

    public void runBilling() {
        recalculateInvoices(); // direct self-call
    }

    @Transactional
    public void recalculateInvoices() {
        // transactional work
    }
}
```

The direct call may bypass the transactional proxy entirely.
That is why transaction boundaries should be placed on service entry points with clear invocation paths, not sprinkled casually across internal helper methods.

---

## Failure Drill

A strong drill for this topic is intentional rollback mismatch:

1. create an outer `@Transactional` method
2. call an inner service using `REQUIRES_NEW`
3. force the outer transaction to fail after the inner one commits
4. verify the final database state matches the actual business rule, not just developer expectation

This drill catches a large class of "we thought everything rolled back together" bugs.

---

## Debug Steps

- log transaction entry and exit around the service boundaries that matter
- verify whether the call path crosses a Spring proxy or stays inside the same bean
- inspect actual database isolation behavior, not only annotation values
- test rollback cases explicitly, especially when `REQUIRES_NEW` is present
- treat transaction design as part of business correctness, not just persistence wiring

---

## Production Checklist

- each transactional boundary maps to a clear business operation
- any use of `REQUIRES_NEW` is intentional and documented
- isolation choices are tied to concrete anomalies the system cannot tolerate
- proxy boundaries are understood, especially for internal method calls
- rollback behavior has been tested, not inferred

---

## Key Takeaways

- Propagation and isolation solve different problems and should be reasoned about separately.
- `REQUIRED` is the safe baseline; `REQUIRES_NEW` should be a deliberate business decision.
- Isolation levels only matter when tied to actual concurrency anomalies in the database you run.
- In Spring, transaction behavior depends on proxy boundaries as much as on annotations.
