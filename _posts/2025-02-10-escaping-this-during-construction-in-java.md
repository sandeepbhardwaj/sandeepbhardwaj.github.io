---
title: Escaping this During Construction in Java
date: 2025-02-10
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- this-escape
- construction
- unsafe-publication
- java-memory-model
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Escaping this During Construction in Java
seo_description: Learn why letting this escape during construction is dangerous
  in Java, how partially initialized objects leak, and how to design safely.
header:
  overlay_image: "/assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 4
  show_overlay_excerpt: false
---
One of the most subtle forms of unsafe publication happens when an object exposes itself before construction is complete.

In Java concurrency discussions, this is usually called letting `this` escape during construction.

It is a real production bug pattern, not an academic edge case.

---

## Problem Statement

Suppose a service object registers itself as a callback listener inside its constructor.

That means another thread, scheduler, or registry may call back into that object before construction has fully finished.

Now code outside the constructor can observe an object that is not yet safely ready for use.

---

## Naive Version

```java
class OrderEventHandler {
    private final PaymentClient paymentClient;
    private final AuditClient auditClient;

    OrderEventHandler(EventBus eventBus,
                      PaymentClient paymentClient,
                      AuditClient auditClient) {
        eventBus.register(this);
        this.paymentClient = paymentClient;
        this.auditClient = auditClient;
    }
}
```

This constructor leaks `this` before all fields are set.

If `eventBus` dispatches quickly, another thread may invoke handler methods on an object whose state is still incomplete.

---

## Why This Is Dangerous

Construction is supposed to establish the object invariant.

For example:

- required dependencies are assigned
- configuration is validated
- internal collections are initialized
- status fields are put into a valid starting state

If `this` escapes before that work finishes, another thread can observe:

- `null` fields that were supposed to be initialized
- inconsistent combinations of values
- methods running against half-built state
- startup failures that appear random and timing-dependent

This is both a publication problem and a design problem.

---

## Runnable Example

```java
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

public class ThisEscapeDemo {

    public static void main(String[] args) throws Exception {
        EventBus eventBus = new EventBus();

        Thread dispatcher = new Thread(() -> {
            sleep(10);
            eventBus.publish("order-created");
        }, "event-dispatcher");

        dispatcher.start();

        try {
            new OrderEventHandler(eventBus);
        } catch (Exception e) {
            System.out.println("Construction failed: " + e.getMessage());
        }

        dispatcher.join();
    }

    static final class EventBus {
        private final List<EventListener> listeners = new CopyOnWriteArrayList<>();

        void register(EventListener listener) {
            listeners.add(listener);
        }

        void publish(String event) {
            for (EventListener listener : listeners) {
                listener.onEvent(event);
            }
        }
    }

    interface EventListener {
        void onEvent(String event);
    }

    static final class OrderEventHandler implements EventListener {
        private String downstreamName;

        OrderEventHandler(EventBus eventBus) {
            eventBus.register(this);
            sleep(50);
            this.downstreamName = "payments-service";
        }

        @Override
        public void onEvent(String event) {
            System.out.println("event = " + event);
            System.out.println("downstream = " + downstreamName.toUpperCase());
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

This example intentionally widens the window, but the bug is structural:

- constructor starts
- `this` gets registered
- another thread publishes an event
- callback executes before initialization finishes

That is exactly the kind of timing-dependent failure that makes startup bugs painful to reproduce.

---

## Production-Style Scenarios

Escaping `this` happens in systems like:

- event listeners registered inside constructors
- executors submitted with `this::method` before the object is ready
- background threads started from a constructor
- framework callbacks attached during construction
- inner classes or lambdas capturing `this` and being handed to another thread too early

Common symptoms include:

- intermittent `NullPointerException`
- startup races that vanish under debugging
- handlers receiving traffic before warm-up completes
- objects appearing healthy in logs but failing under real load

---

## Broken Thread Start Example

```java
class PollingService {
    private final Thread worker;
    private String endpoint;

    PollingService() {
        worker = new Thread(this::pollLoop, "poller");
        worker.start();
        endpoint = "https://inventory.internal";
    }

    void pollLoop() {
        System.out.println(endpoint.length());
    }
}
```

Starting a thread from the constructor can expose the same problem.

The worker may observe object state before the constructor establishes it fully.

---

## Correct Fix: Do Not Publish from the Constructor

The cleanest rule is simple:

- constructors build objects
- explicit startup methods publish them

For example:

```java
class SafeOrderEventHandler implements EventListener {
    private final String downstreamName;

    SafeOrderEventHandler(String downstreamName) {
        this.downstreamName = downstreamName;
    }

    void start(EventBus eventBus) {
        eventBus.register(this);
    }

    @Override
    public void onEvent(String event) {
        System.out.println("event = " + event);
        System.out.println("downstream = " + downstreamName.toUpperCase());
    }
}
```

Now construction and publication are separate phases.
The object becomes externally visible only after the constructor has finished.

---

## Better Construction Pattern

For production code, a safer lifecycle often looks like:

1. create fully initialized immutable state
2. assemble the service object
3. validate dependencies
4. publish or register the object
5. begin background processing

This pattern makes object readiness explicit.

It also improves testing because construction no longer causes hidden side effects like registration or thread startup.

---

## Common Mistakes

- registering listeners from constructors
- starting threads from constructors
- submitting `this` to an executor during construction
- calling overridable methods from constructors
- publishing a partially initialized object into a shared registry

Several of these mistakes are really the same root bug: external code can touch the object before its invariant is established.

---

## Design Guidance

Good alternatives include:

- static factory methods that create and then start the object
- builders that assemble immutable configuration before publication
- dependency injection plus explicit lifecycle methods
- startup orchestrators that wire all components first and publish them after readiness

These patterns are boring in a good way.
They reduce timing-dependent behavior.

---

## Key Takeaways

- Letting `this` escape during construction is a form of unsafe publication.
- Another thread can observe the object before its fields and invariants are fully established.
- Listener registration, thread startup, and executor submission from constructors are common real-world sources.
- The safest pattern is to finish construction first and publish later through an explicit startup step.

Next post: [Deadlock in Java Reproduction Detection and Prevention](/2025/02/11/deadlock-in-java-reproduction-detection-and-prevention/)
