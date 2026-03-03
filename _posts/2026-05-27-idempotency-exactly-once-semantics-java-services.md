---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-27
seo_title: "Idempotency and Exactly-Once Semantics Java Guide"
seo_description: "Design retry-safe write paths in Java APIs with deterministic deduplication behavior."
tags: [java, idempotency, distributed-systems, backend]
canonical_url: "https://sandeepbhardwaj.github.io/java/idempotency-exactly-once-semantics-java-services/"
title: "Idempotency and Exactly-Once Semantics in Java Services"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Retry-Safe Write Semantics and Deduplication"
---

# Idempotency and Exactly-Once Semantics in Java Services

In distributed systems, retries are unavoidable.
Correctness comes from making operations idempotent and designing deduplication boundaries carefully.

---

## Exactly-Once: Practical Meaning

True global exactly-once delivery across networks is usually not achievable end-to-end.
What we implement in production is:

- at-least-once delivery
- idempotent processing
- deterministic deduplication at state boundaries

This yields effectively-once business outcomes.

---

## HTTP Idempotency Pattern

For create/payment-like endpoints:

- client sends `Idempotency-Key`
- server stores `(key, request_hash, final_response)`
- repeated request with same key and same payload returns original response
- same key with different payload is rejected

```java
public Response createPayment(String idemKey, PaymentCommand cmd) {
    String payloadHash = hash(cmd);

    IdempotencyRecord existing = idemRepository.find(idemKey);
    if (existing != null) {
        if (!existing.payloadHash().equals(payloadHash)) {
            return Response.status(409).body("Idempotency key reused with different payload");
        }
        return Response.fromStored(existing.responseCode(), existing.responseBody());
    }

    PaymentResult result = paymentService.process(cmd);
    idemRepository.insert(idemKey, payloadHash, result.statusCode(), result.body());
    return Response.status(result.statusCode()).body(result.body());
}
```

---

## Persistence Model

```sql
create table idempotency_record (
  idem_key varchar(128) primary key,
  payload_hash char(64) not null,
  status_code int not null,
  response_body text not null,
  created_at timestamp not null
);
```

Add TTL/archival policy based on realistic client retry window.

---

## Message Consumer Idempotency Pattern

For Kafka/queue consumers:

- include stable event ID
- keep processed-event table keyed by event ID
- process in one transaction with business write when possible

If duplicate event arrives, no-op safely.

---

## Dry Run: Duplicate Payment Submission

Scenario: client times out after submitting payment and retries twice.

1. first request reaches server, payment is created, response lost in network.
2. retry #1 arrives with same key and same payload.
3. server finds stored idempotency record and returns original response.
4. retry #2 behaves same; no second charge is created.

This is the core business guarantee users care about.

---

## Design Rules

- define idempotency scope (`endpoint + tenant + key`).
- hash canonicalized request payload, not raw JSON string formatting.
- store final response, not only "seen" marker.
- guard side effects (email, webhook, ledger writes) under same dedupe boundary.
- use unique constraints as final safety net.

---

## Common Mistakes

- accepting idempotency key but not validating payload consistency
- deduping in memory only (fails on restart/multi-instance)
- using very short retention window causing replay duplicates later
- calling downstream side effects before idempotency record is committed

---

## Key Takeaways

- idempotency is the practical path to effectively-once outcomes.
- correctness depends on key scope, payload validation, and durable dedupe storage.
- design retries and deduplication together, not as separate concerns.
