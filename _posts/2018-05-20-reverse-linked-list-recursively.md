---
title: Reverse Linked List Recursively in Java
date: '2018-05-20'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- recursion
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Reverse Linked List Recursively in Java
seo_description: Recursive linked-list reversal in Java with base case, call stack
  behavior, and complexity.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Recursive linked-list reversal looks magical the first time you see it because the code is tiny and the pointer changes happen "somewhere inside recursion."

The real trick is much simpler:
the recursive call reverses the tail, and each stack frame fixes exactly one link while the call stack unwinds.

## Quick Summary

| Question | Answer |
| --- | --- |
| What does the recursive call return? | the head of the already-reversed suffix |
| What does the current frame do? | attach `head` to the end of that reversed suffix |
| What line matters most? | `head.next.next = head` |
| What bug appears most often? | forgetting `head.next = null` and creating a cycle |

The invariant is:
after `reverseList(head.next)` returns, the sublist starting at `head.next` is already reversed correctly, and `newHead` points to the final answer.

## Problem Statement

Given the head of a singly linked list, reverse the list and return the new head using recursion.

Example:

- input: `1 -> 2 -> 3 -> 4`
- output: `4 -> 3 -> 2 -> 1`

## The Recursive Contract

Before writing code, define what the recursive call means.

`reverseList(node)` should mean:

- reverse the list starting at `node`
- return the head of that reversed list

That contract is the whole solution.
Once you trust it, the current stack frame only has to reconnect one node.

## Java Solution

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;

        return newHead;
    }
}
```

## Why It Works

Suppose the list is:

```text
1 -> 2 -> 3 -> 4
```

At node `2`, the recursive call handles:

```text
3 -> 4
```

and returns:

```text
4 -> 3
```

At that point:

- `newHead` is `4`
- `head` is `2`
- `head.next` is `3`

So we do:

```java
head.next.next = head;
```

which means:

```text
3.next = 2
```

Now `2` is appended after the reversed suffix.

Then we do:

```java
head.next = null;
```

to break the old forward link.
Without that line, the old `2 -> 3` link remains and creates a cycle.

## Dry Run

Take:

```text
1 -> 2 -> 3 -> 4
```

Call stack growth:

1. `reverse(1)` calls `reverse(2)`
2. `reverse(2)` calls `reverse(3)`
3. `reverse(3)` calls `reverse(4)`
4. `reverse(4)` returns `4` because it is the base case

Now unwind:

### Frame for node `3`

- `newHead = 4`
- set `4.next = 3`
- set `3.next = null`

List shape:

```text
4 -> 3
```

### Frame for node `2`

- `newHead = 4`
- set `3.next = 2`
- set `2.next = null`

List shape:

```text
4 -> 3 -> 2
```

### Frame for node `1`

- `newHead = 4`
- set `2.next = 1`
- set `1.next = null`

Final result:

```text
4 -> 3 -> 2 -> 1
```

## Visual Intuition

The recursive version is easiest to understand like this:

1. go to the tail
2. let the tail become the new head
3. reconnect each earlier node behind the reversed tail

So recursion is not reversing pointers on the way down.
It is fixing links on the way back up.

## Common Mistakes

### Returning `head` instead of `newHead`

The deepest node becomes the head of the reversed list.
Every stack frame must return that same node upward.

### Forgetting `head.next = null`

This is the classic bug.
The list appears almost correct, but the old forward link survives and creates a cycle.

### Missing the base case

For `null` or a one-node list, the answer is already correct.
Trying to recurse further breaks the logic.

### Treating recursion like value swapping

Nothing about this algorithm swaps data.
It is entirely about pointer rewiring.

## Recursive vs Iterative

The recursive version is elegant and interview-friendly because the contract is clean.
The iterative version is usually the production default because it uses constant extra space.

Use recursion when:

- the interviewer asks for it
- list size is modest
- you want to show clean recursive reasoning

Prefer iteration when:

- input can be very large
- stack depth matters
- production safety is more important than elegance

## Complexity

- Time: `O(n)`
- Space: `O(n)` because each node adds one stack frame

That extra space is why the recursive solution is not the best practical default even though it is a great teaching solution.

## What This Pattern Generalizes To

This same recursive thinking helps with:

- reversing a linked-list suffix
- swapping pairs recursively
- reversing nodes in `k`-groups with recursive decomposition
- tree problems where children are solved first and the parent fixes one relation afterward

The broader lesson is:
define what the recursive call guarantees, then do only the local repair work in the current frame.

## Key Takeaways

- The recursive call returns the head of the reversed suffix.
- `head.next.next = head` attaches the current node behind that suffix.
- `head.next = null` is required to break the old link.
- The solution is elegant for interviews, but iterative reversal is usually safer for large production inputs.
