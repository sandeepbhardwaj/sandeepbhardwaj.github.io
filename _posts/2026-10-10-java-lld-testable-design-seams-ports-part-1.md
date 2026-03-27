---
title: Testable design using seams, ports, and deterministic adapters
date: 2026-10-10
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
seo_title: Testable design using seams, ports, and deterministic adapters - Advanced
  Guide
seo_description: Advanced practical guide on testable design using seams, ports, and
  deterministic adapters with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
Code becomes hard to test when business rules are welded directly to time, randomness, network calls, and framework entry points.
The problem is rarely that unit tests are "not being written."
The problem is that the design leaves no clean place to write them.

That is what seams and ports are really for:
they give important decisions a boundary that can be exercised without booting the whole application.

## Quick Summary

| Design question | Better for testability | Worse for testability |
| --- | --- | --- |
| who provides time? | `Clock` port | `Instant.now()` inside domain logic |
| who generates IDs? | `IdGenerator` port | random UUID calls in business methods |
| who talks to payment/email/search? | interface port with adapter | concrete client called directly everywhere |
| what do tests swap? | narrow dependency seams | framework-heavy singletons |

Part 1 is about the baseline habit:
push nondeterministic and infrastructural behavior to the edges, then keep core decisions deterministic.

## What a Seam Actually Is

A seam is just a place where behavior can vary without rewriting the core logic.
In backend systems, the most valuable seams are usually around:

- time
- randomness
- external gateways
- persistence
- event publishing

If the domain logic depends directly on those things, tests become slow, brittle, or full of mocking noise.

## A Practical Example

Suppose a billing use case needs to:

1. read an invoice
2. charge a gateway
3. stamp the payment time
4. publish an event

A seam-friendly design looks like this:

```java
public interface InvoiceRepository {
    Invoice findById(InvoiceId id);
    void save(Invoice invoice);
}

public interface PaymentGateway {
    ChargeResult charge(Invoice invoice);
}

public interface DomainEventPublisher {
    void publish(Object event);
}

public final class BillingService {
    private final InvoiceRepository invoiceRepository;
    private final PaymentGateway paymentGateway;
    private final DomainEventPublisher eventPublisher;
    private final Clock clock;

    public BillingService(
            InvoiceRepository invoiceRepository,
            PaymentGateway paymentGateway,
            DomainEventPublisher eventPublisher,
            Clock clock) {
        this.invoiceRepository = invoiceRepository;
        this.paymentGateway = paymentGateway;
        this.eventPublisher = eventPublisher;
        this.clock = clock;
    }

    public void collectPayment(InvoiceId invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId);
        ChargeResult result = paymentGateway.charge(invoice);
        invoice.markPaid(result.reference(), Instant.now(clock));
        invoiceRepository.save(invoice);
        eventPublisher.publish(new InvoicePaid(invoice.id(), result.reference()));
    }
}
```

The key gain is not "more interfaces."
It is that the business flow can now be tested with deterministic collaborators.

## Why Deterministic Adapters Matter

The adapter layer should hide infrastructure behavior, not leak it.
For tests, that means you can replace:

- a real payment SDK with an in-memory fake
- system time with a fixed clock
- async publisher with a capturing fake

That makes the core test ask useful questions like:

- was the invoice marked paid?
- was the timestamp correct?
- was the event emitted?

instead of fighting the mechanics of external systems.

## A Good Rule for Ports

Create a port when:

1. the dependency is outside your control
2. the behavior is nondeterministic or expensive
3. the core logic still makes sense without the concrete implementation

Do not create ports for every internal helper method.
That turns testability into abstraction theater.

## Common Ways Teams Overdo This

### Interface for everything

If a class is simple, local, and deterministic, adding a port may only increase indirection.

### Mock-heavy tests that mirror implementation steps

That often means the seam is too low-level and the service has no stable behavioral boundary.

### Domain objects calling gateways directly

That makes core rules harder to test and harder to reason about during failures.

### Adapters returning framework-specific types

A good adapter hides those details instead of re-exporting them.

## Testing Strategy

Test design seams at the level they are meant to protect.

Useful tests:

- fixed clock yields stable payment timestamp
- fake gateway decline leaves invoice unpaid
- event publisher receives one `InvoicePaid` event after success
- repository save happens only after domain transition succeeds

These tests are valuable because they verify business behavior under deterministic conditions.

## When Simpler Design Wins

Not every use case needs a full ports-and-adapters setup.
For very small internal tools, direct composition may be fine.

But once code depends on:

- network calls
- retries
- current time
- generated IDs
- async side effects

test seams stop being ceremony and start being operational safety.

## Key Takeaways

- Testability improves when nondeterministic behavior is pushed behind narrow seams.
- Ports are most valuable around external systems, time, randomness, and side effects.
- Deterministic adapters make business tests clearer and less brittle.
- If every test needs heavy mocking, the design boundary is probably still in the wrong place.
