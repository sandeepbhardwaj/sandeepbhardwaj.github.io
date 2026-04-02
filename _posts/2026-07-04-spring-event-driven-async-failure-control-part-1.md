---
title: Event-driven Spring architecture with async failure control
date: 2026-07-04
categories:
- Java
- Spring Boot
- Backend
permalink: /java/spring-boot/backend/spring-event-driven-async-failure-control-part-1/
tags:
- java
- spring-boot
- backend
- architecture
- production
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Event-driven Spring architecture with async failure control - Advanced
  Guide
seo_description: Advanced practical guide on event-driven spring architecture with
  async failure control with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Spring Boot Runtime Engineering
---
Spring makes event-driven application code look deceptively simple.
Publish an event, add a listener, maybe annotate it with `@Async`, and the code feels decoupled immediately.
The real questions begin after that: what is the delivery contract, where does failure go, and what business state is allowed to commit before listeners finish.

---

## Start With the Right Mental Model

Spring application events are not a broker.
They are in-process notifications inside one application runtime.

That means:

- they are great for local decoupling
- they are not durable by default
- they do not create cross-service reliability guarantees
- async listeners change timing and failure behavior immediately

A lot of architecture confusion disappears once that model is stated plainly.

---

## When Spring Events Are a Good Fit

They work well when you want to separate concerns inside one service:

- order creation triggers audit logging
- user registration triggers welcome-email preparation
- domain state changes trigger cache invalidation or projections

In those cases, events reduce direct coupling between components without forcing every side effect into one service method.

They are a bad fit when the system actually needs:

- durable retries
- cross-service delivery guarantees
- backpressure between independent systems
- replay or historical event recovery

That is where messaging infrastructure belongs, not just `ApplicationEventPublisher`.

---

## The First Boundary: Before or After Commit

One of the most important design choices is whether the listener should run:

- inside the transaction
- after transaction commit
- asynchronously after commit

Those are very different business semantics.

If a listener updates another table inside the same transaction, failure may correctly roll everything back.
If a listener sends email or triggers a webhook, tying that side effect directly to the transaction may be the wrong durability model.

This is why `@TransactionalEventListener` matters more than most teams realize.

---

## A Concrete Example

Suppose checkout should persist the order first, then notify other internal components.

```java
@Service
class CheckoutService {

    private final ApplicationEventPublisher publisher;
    private final OrderRepository orderRepository;

    CheckoutService(ApplicationEventPublisher publisher, OrderRepository orderRepository) {
        this.publisher = publisher;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public void checkout(Order order) {
        orderRepository.save(order);
        publisher.publishEvent(new OrderPlacedEvent(order.id(), order.customerId()));
    }
}
```

Now the important question is not whether the event gets published.
The important question is what downstream listeners are allowed to assume about transaction state.

---

## Listener Choices Change the Contract

A listener like this:

```java
@Component
class AuditListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void onOrderPlaced(OrderPlacedEvent event) {
        // write audit trail, send notification, update projection
    }
}
```

means the listener runs only after the surrounding transaction commits successfully.
That is often the cleanest default for side effects that should not happen when the main write rolls back.

If you add `@Async`, you are changing the model again:

- the caller no longer waits
- failures no longer travel back through the original request path
- observability around dropped work becomes mandatory

Async is not just faster. It is a reliability decision.

---

## Where Teams Get Burned

The common failure modes are predictable:

- assuming in-process events are durable
- using async listeners without explicit failure handling
- publishing events before commit and treating them as committed truth
- mixing business-critical work with "nice to have" side effects in one listener path

The biggest mistake is thinking "event-driven" automatically means resilient.
It often just means the failure moved somewhere less visible.

---

## Failure Control Must Be Designed

For async listeners, decide explicitly:

- what happens when the listener throws
- how retries are handled
- whether failures are logged, metered, or dead-lettered somewhere
- which side effects are allowed to be lost and which are not

If the side effect cannot be lost, a plain async Spring event may be the wrong abstraction.

That usually points toward an outbox pattern or broker-backed workflow instead.

---

## Failure Drill

A strong drill for this topic is simple:

1. publish an event from a transactional service method
2. handle it with an async listener
3. force the listener to fail after the main transaction commits
4. verify the team can answer what happened, how it was observed, and whether the business state is still acceptable

That drill exposes the real delivery contract faster than a design diagram will.

---

## Debug Steps

- verify whether listeners run inside the transaction, after commit, or asynchronously
- log and measure listener failures explicitly instead of assuming they surface naturally
- separate critical state changes from optional notifications
- inspect executor configuration when using `@Async`
- escalate to an outbox or broker when the side effect needs durability or replay

---

## Production Checklist

- listener timing relative to transaction commit is explicit
- async execution uses a named executor, not an accidental default
- listener failures are visible in logs, metrics, and alerts
- critical side effects are not relying on in-memory delivery guarantees
- the team can explain which events are best-effort and which require durable delivery

---

## Key Takeaways

- Spring events are excellent for in-process decoupling, not for pretending a broker exists where one does not.
- `@TransactionalEventListener` changes business semantics in important ways and should be chosen deliberately.
- `@Async` changes the failure model as much as it changes latency.
- If the side effect must survive crashes and retries, move beyond plain in-process events.
