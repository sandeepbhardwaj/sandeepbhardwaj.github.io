---
title: Remove Linked List Elements in Java
date: '2019-07-11'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove Linked List Elements in Java (LeetCode 203)
seo_description: Remove nodes matching target value in a linked list using dummy head
  pattern.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the cleanest problems for learning why dummy nodes matter.
The hard part is not deleting a node in the middle.
The hard part is making head deletion, middle deletion, and consecutive deletion all obey the same rule.

That is exactly what the dummy node gives us.

## Quick Summary

| Question | Answer |
| --- | --- |
| Core pattern | dummy node plus pointer rewiring |
| Why it works | every deletion becomes "remove `current.next`" |
| Main invariant | everything before `current` is already finalized and safe |
| Common bug | moving forward immediately after deletion and skipping nodes |

## Problem Statement

Given the head of a linked list and a value `val`, remove every node whose value equals `val`, and return the new head.

The challenge is not the comparison.
It is pointer stability.

If the head itself should disappear, or if several matching nodes appear in a row, code without a dummy node often fractures into special cases.

## Why Dummy Nodes Are So Useful

Without a dummy node, the head has special status.
Deleting it requires different logic from deleting a middle node.

With a dummy node, there is always a stable node before the real list:

```text
dummy -> head -> ...
```

Now the operation is always the same:

- inspect `current.next`
- if it should be removed, bypass it
- otherwise move `current` forward

That one change makes the algorithm easier to reason about and much harder to break.

## Core Invariant

At the start of each loop iteration:

- all nodes before `current` are already finalized in the output list
- `current.next` is the next node to classify

If `current.next.val == val`, we unlink that node.
If not, we keep it and advance `current`.

The important subtlety is that after deletion, `current` stays where it is.
That allows us to inspect the new `current.next`, which might also need to be removed.

## Java Solution

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode current = dummy;

        while (current.next != null) {
            if (current.next.val == val) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        return dummy.next;
    }
}
```

## Why This Works

There are only two cases:

### Case 1: The Next Node Must Be Deleted

```java
current.next = current.next.next;
```

We do not move `current`.
We need to inspect the new next node because multiple target values can appear consecutively.

### Case 2: The Next Node Should Stay

```java
current = current.next;
```

Now that node is part of the finalized output prefix, so moving forward is safe.

This loop never loses the list because we only rewire one `next` reference at a time, and we always keep a stable pointer to the node before the candidate.

## Dry Run

Input:

```text
1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6
val = 6
```

Start:

```text
dummy -> 1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6
current = dummy
```

1. `current.next = 1`, keep it, move to `1`
2. `current.next = 2`, keep it, move to `2`
3. `current.next = 6`, delete it by linking `2 -> 3`
4. stay on `2`, inspect new `current.next = 3`
5. keep `3`, keep `4`, keep `5`
6. final `6` is deleted the same way

Result:

```text
1 -> 2 -> 3 -> 4 -> 5
```

## The Consecutive-Deletion Trap

Consider:

```text
6 -> 6 -> 6 -> 1
```

If you delete one `6` and immediately move `current` forward, you can skip the next `6`.

That is why the rule is:

- after deletion, stay put
- after keeping a node, move forward

This is one of the most common linked-list bugs in interviews.

## Recursive Version

The recursive form is elegant:

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        if (head == null) {
            return null;
        }

        head.next = removeElements(head.next, val);
        return head.val == val ? head.next : head;
    }
}
```

It reads nicely because the recursion cleans the suffix first, then decides whether the current node stays.

Still, for production Java code, the iterative dummy-node solution is usually the safer default:

- no stack-depth risk on long lists
- easier step-by-step debugging
- more obviously aligned with the pointer mechanics

## Common Mistakes

### Forgetting the Dummy Node

You can solve the problem without it, but head-removal logic becomes harder to trust under pressure.

### Moving After Deletion

That can skip consecutive target nodes.
This is the biggest correctness bug in hand-written solutions.

### Inspecting `current` Instead of `current.next`

The whole pattern is built around deciding whether to keep or delete the next node.
Looking at the wrong pointer blurs the invariant.

### Mutating Values Instead of Links

Linked-list problems are almost always about structure, not value shuffling.

## Complexity

- Time: `O(n)`
- Space: `O(1)` for the iterative version

Each node is inspected once, and we use only a constant number of references.

## Where This Pattern Generalizes

This dummy-node technique appears all over linked-list interview problems:

- remove duplicates from a sorted list
- partition a list
- merge sorted lists
- delete nodes by condition
- remove the nth node from the end

The reusable idea is stronger than this one problem:
create a sentinel so head-heavy mutations stop being special.

## Final Takeaway

The real lesson is not "how to remove nodes with value `val`."
It is how to make pointer updates uniform.

Once a dummy node gives you a stable predecessor, deletion becomes a simple and reliable rule: decide whether `current.next` stays, and only advance when it does.
