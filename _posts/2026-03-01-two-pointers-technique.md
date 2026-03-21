---
categories:
- DSA
- Java
date: 2026-03-01
seo_title: Two Pointers Technique in Java - Interview Preparation Guide
seo_description: Master two pointer patterns in Java for arrays, strings, and linked lists with recognition signals, diagrams, mental models, and interview-ready solutions.
tags:
- dsa
- java
- two-pointers
- sliding-window
- linked-list
- algorithms
- interview-preparation
title: Two Pointers Technique in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/two-pointers-banner.svg"
  overlay_filter: 0.35
  caption: Interview Pattern Recognition and Pointer Discipline
  show_overlay_excerpt: false
---
Two pointers is one of the highest-ROI interview patterns because it turns brute-force comparison and mutation problems into linear scans with very little extra memory.

Strong candidates do not just remember `left` and `right`.
They recognize the pattern early, define the invariant clearly, and explain why each pointer move is safe.

If you build backend systems, this technique matters outside interviews too:
it encourages in-place processing, precise state transitions, and predictable `O(n)` scans instead of nested-loop guesswork.

> [!NOTE] Interview lens
> A strong two-pointer explanation usually has four parts:
> 1. why this pattern fits the problem,
> 2. what invariant is maintained,
> 3. how pointer movement guarantees progress,
> 4. why the final complexity is optimal.

---

## Pattern Summary Table

Use this as a quick revision sheet before interviews.

| Pattern | When to use | Key idea | Example problems |
| --- | --- | --- | --- |
| Opposite-direction pointers | sorted arrays, palindromes, pair/triplet search | start from both ends and discard impossible states after each comparison | Two Sum II, Container With Most Water, Valid Palindrome |
| Fast/slow compaction | remove, deduplicate, or rewrite data in place | `fast` scans input, `slow` marks the finalized prefix | Remove Duplicates from Sorted Array, Move Zeroes |
| Sliding window | longest/shortest contiguous subarray or substring under a constraint | expand right to gain information, shrink left to restore validity | Minimum Size Subarray Sum, Longest Substring Without Repeating Characters |
| Fast/slow linked-list pointers | midpoint, split, cycle detection, reorder prep | move two pointers at different speeds to infer structure without counting | Middle of the Linked List, Linked List Cycle |
| Fixed gap or lead-lag | nth/kth from end, one-pass distance constraints | create a gap, then move both pointers together | Remove Nth Node From End of List |
| In-place reversal | reverse a full list or a sublist with `O(1)` extra space | preserve `next`, then rewire links one node at a time | Reverse Linked List, Reverse Linked List II |
| Dummy node and merge builder | head-heavy linked-list mutation, merge operations | a sentinel removes head special cases and `tail` builds a finalized result | Merge Two Sorted Lists, Remove Linked List Elements |

---

## Core Idea

Two pointers works when the problem state can be represented by positions, boundaries, or relative distance.

Every pointer move should do one of three things:

- discard impossible candidates
- finalize part of the answer
- restore a required invariant

That is the real pattern.
The pointer names change, but the reasoning stays the same.

---

## Quick Recognition Checklist

Before coding, ask these questions:

1. Is the input sorted, or can I sort it without breaking the problem?
2. Am I searching over a contiguous region such as a subarray or substring?
3. Do I need an in-place answer with `O(1)` extra space?
4. Is this a linked-list shape question such as middle, cycle, or nth from end?
5. Can I explain exactly why moving one pointer cannot miss the optimal answer?

If you can answer "yes" to any of these, two pointers should be one of your first thoughts.

---

## Mental Models That Make This Pattern Easier

- Two pointers is not "just traversal." It is controlled state reduction.
- Opposite-direction pointers eliminate search space after each comparison.
- Fast/slow compaction means `slow` marks the write boundary of the answer built so far.
- Sliding window is about maintaining a valid subarray while expanding and shrinking dynamically.
- Linked lists are pointer-rewiring problems, not indexing problems.
- Before modifying a link in a linked list, preserve the reference you still need.
- If a loop iteration does not move at least one pointer, the algorithm is probably wrong.

> [!IMPORTANT] Senior-engineer habit
> Say the invariant out loud before coding.
> It prevents most off-by-one errors and makes your explanation sound much more interview-ready.

---

## Pattern 1: Opposite-Direction Pointers

This is the classic "one pointer from the left, one from the right" pattern.

### How to Recognize This Pattern

- Signals in the problem statement:
  sorted input, pair sum, palindrome, triplets, maximize area, compare from both ends.
- Keywords that hint at it:
  sorted, pair, target sum, closest, inward, palindrome, left/right.
- Constraints that guide the approach:
  expected `O(n)` or `O(n log n)` solution, low extra space, and monotonic behavior after comparison.

### Problem-Solving Approach

**Brute force idea**

Check every pair with nested loops.
This is usually `O(n^2)`.

**Optimization insight**

If the input is sorted, comparing the current smallest and largest candidate tells you which side must move.
You are not exploring all pairs.
You are ruling out whole groups of pairs at once.

**Final optimal approach**

Start `left` at the beginning and `right` at the end.
If the sum is too small, increase it by moving `left`.
If the sum is too large, decrease it by moving `right`.

**Why this approach works**

Sorted order creates monotonic behavior:

- moving `left` rightward can only increase the sum
- moving `right` leftward can only decrease the sum

That is why each move safely discards impossible candidates.

### Visual Intuition

```text
nums = [1, 2, 4, 6, 10, 14], target = 12

left                           right
  v                              v
[ 1, 2, 4, 6, 10, 14 ]

1 + 14 = 15, too large
Move `right` left because every pair with 14 and any index >= left is also too large.

left                    right
  v                       v
[ 1, 2, 4, 6, 10, 14 ]

1 + 10 = 11, too small
Move `left` right because every pair with 1 and any index <= right is also too small.
```

### Example Problem: Two Sum II

```java
public int[] twoSumSorted(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];

        if (sum == target) {
            return new int[]{left, right};
        }
        if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return new int[]{-1, -1};
}
```

**Invariant**

At every step, the answer, if it exists, is still inside the range `[left, right]`.
Everything outside that range has already been ruled out.

### Pattern Variations

- `3Sum`: sort first, fix one element, then run opposite-direction pointers on the remaining suffix.
- `Container With Most Water`: move the shorter wall, because the taller wall is not the bottleneck.
- `Valid Palindrome`: move inward from both ends while skipping non-alphanumeric characters.

### Common Mistakes

- forgetting that the array must be sorted
- using `left <= right` when the logic requires two distinct positions
- moving both pointers without proving why that is safe
- ignoring duplicates in problems like `3Sum`

---

## Pattern 2: Fast/Slow Compaction

Use this pattern when the problem asks you to rewrite an array in place.

### How to Recognize This Pattern

- Signals in the problem statement:
  remove duplicates, remove elements, compact in place, return new length, stable rewrite.
- Keywords that hint at it:
  in-place, overwrite, compact, deduplicate, keep relative order.
- Constraints that guide the approach:
  expected `O(n)` time, `O(1)` extra space, and mutation of the input is allowed.

### Problem-Solving Approach

**Brute force idea**

Build a new array or list containing only the kept values.
This is easy but uses extra memory.

**Optimization insight**

You do not need a second array.
You only need to know where the next valid value should be written.

**Final optimal approach**

Let `fast` scan the input.
Let `slow` mark the end of the finalized prefix.
When `fast` finds a value worth keeping, write it at `slow` and advance `slow`.

**Why this approach works**

The subarray before `slow` is always valid and finalized.
Everything from `slow` onward is either unprocessed or disposable.

### Visual Intuition

```text
nums = [1, 1, 2, 2, 3]

After processing fast = 2:

[1, 2, 2, 2, 3]
    ^
   slow
          ^
         fast

Meaning:
- `nums[0..slow]` is already the compacted answer
- `fast` keeps exploring the remaining input
```

### Example Problem: Remove Duplicates from Sorted Array

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int slow = 0;

    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;
}
```

**Invariant**

`nums[0..slow]` is always the unique compacted prefix.

### Pattern Variations

- `Remove Element`: keep only values that do not match a target.
- `Move Zeroes`: compact non-zero values first, then fill the suffix with zeroes.
- `Sort Colors`: pointer-based partitioning is a close relative of this idea.

### Common Mistakes

- returning `slow` instead of `slow + 1`
- starting `fast` at the wrong index
- forgetting that sorted input makes duplicate detection trivial here
- writing to the array before deciding whether the current value should be kept

---

## Pattern 3: Sliding Window

Sliding window is a same-direction two-pointer pattern for contiguous ranges.

### How to Recognize This Pattern

- Signals in the problem statement:
  longest subarray, shortest subarray, substring, contiguous range, at most, at least, no repeats.
- Keywords that hint at it:
  window, substring, subarray, longest, shortest, expand, shrink.
- Constraints that guide the approach:
  the window validity should be restorable by moving `left` forward only.

### Problem-Solving Approach

**Brute force idea**

Enumerate every subarray or substring and check whether it satisfies the condition.
This is usually `O(n^2)` or worse.

**Optimization insight**

When the problem is about a contiguous region, you do not need to restart from every index.
You can maintain one moving window and update its state incrementally.

**Final optimal approach**

Expand `right` to include more elements.
When the window becomes valid or invalid, move `left` just enough to restore the needed condition.

**Why this approach works**

Both pointers only move forward.
That makes the total number of pointer moves linear.

### Visual Intuition

```text
target = 7
nums = [2, 3, 1, 2, 4, 3]

Expand right:
[2, 3, 1, 2] -> sum = 8, window is valid
 ^
left        ^ right

Shrink left to find a smaller valid window:
[2, 3, 1, 2] -> remove 2
   ^
 left       ^ right

Now sum = 6, so expand again.
```

### Example Problem: Minimum Size Subarray Sum

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0;
    int sum = 0;
    int best = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];

        while (sum >= target) {
            best = Math.min(best, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }

    return best == Integer.MAX_VALUE ? 0 : best;
}
```

**Invariant**

`sum` always represents the current window `[left, right]`.
Whenever the window becomes valid, we shrink it as much as possible before moving on.

### Mental Model

A sliding window is a live region with a validity rule.
You are not checking all subarrays.
You are maintaining one candidate region and repairing it in place.

### Pattern Variations

- `Longest Substring Without Repeating Characters`: sliding window + hash map or set.
- `Permutation in String`: sliding window + frequency counts.
- `Fruit Into Baskets`: sliding window + map of counts.

### Common Mistakes

- using sliding window on sum problems with negative numbers without proving monotonicity
- updating the answer before the window reaches a valid state
- forgetting to remove the element at `left` before incrementing `left`

---

## Pattern 4: Fast and Slow Pointers on Linked Lists

Assume a standard LeetCode-style `ListNode`.

This pattern is for structure questions, not value lookup.

### How to Recognize This Pattern

- Signals in the problem statement:
  middle of list, split list, palindrome preparation, cycle detection, reorder list.
- Keywords that hint at it:
  middle, midpoint, one pass, cycle, loop, split into halves.
- Constraints that guide the approach:
  expected `O(1)` extra space and no full length precomputation.

### Problem-Solving Approach

**Brute force idea**

For midpoint problems, count the nodes first, then walk again.
For cycle detection, use a `HashSet<ListNode>` to track visited nodes.

**Optimization insight**

Relative speed reveals structure.
You do not need indexing or extra memory.

**Final optimal approach**

Move `slow` by one step and `fast` by two steps.
Their relative positions tell you whether the list has a midpoint or a cycle.

**Why this approach works**

The difference in speed encodes topology:

- if `fast` reaches the end, `slow` is near the middle
- if the list has a cycle, `fast` eventually laps `slow`

### Visual Intuition: Middle of the List

```text
1 -> 2 -> 3 -> 4 -> 5
s
f

1 -> 2 -> 3 -> 4 -> 5
     s
         f

1 -> 2 -> 3 -> 4 -> 5
          s

When `fast` stops, `slow` is at the middle.
```

### Example Problem: Middle of the Linked List

```java
public ListNode middleNode(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}
```

**Invariant**

After `k` iterations, `slow` has moved `k` steps and `fast` has moved `2k` steps.

### Variation: Cycle Detection

**Brute force idea**

Store every visited node in a set and check whether you revisit one.

**Optimization insight**

Inside a cycle, `fast` gains one node per iteration on `slow`.
If a cycle exists, a meeting point is inevitable.

**Visual Intuition**

```text
a -> b -> c -> d -> e
          ^         |
          |_________|

slow moves 1 step
fast moves 2 steps

Inside the cycle, `fast` keeps gaining on `slow`, so they must meet.
```

**Example Problem: Linked List Cycle**

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow == fast) {
            return true;
        }
    }

    return false;
}
```

### Common Mistakes

- checking `fast.next` before checking `fast != null`
- comparing node values instead of node references for cycle detection
- not clarifying first-middle vs second-middle behavior on even-length lists

---

## Pattern 5: Fixed Gap and Lead-Lag Pointers

This pattern is different from fast/slow.
After setup, both pointers usually move at the same speed.

### How to Recognize This Pattern

- Signals in the problem statement:
  remove nth from end, kth from end, keep two pointers `k` apart, one pass.
- Keywords that hint at it:
  from the end, gap, trailing pointer, lead pointer, one pass.
- Constraints that guide the approach:
  no backward traversal, no extra array, and uniform handling of head deletion.

### Problem-Solving Approach

**Brute force idea**

Compute the length first, convert the "from end" index into a "from front" index, then walk again.

**Optimization insight**

You do not need to know the total length if you maintain a fixed gap between two pointers.

**Final optimal approach**

Create a gap of `n + 1` nodes between `fast` and `slow` using a dummy node.
Then move both together until `fast` reaches `null`.

**Why this approach works**

When `fast` reaches the end, `slow` is exactly one node before the target.

### Visual Intuition

```text
dummy -> 1 -> 2 -> 3 -> 4 -> 5
slow
                               fast

Move both together until `fast` becomes null:

dummy -> 1 -> 2 -> 3 -> 4 -> 5
               slow            fast

Now `slow.next` is the node to remove.
```

### Example Problem: Remove Nth Node From End of List

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    ListNode slow = dummy;
    ListNode fast = dummy;

    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }

    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }

    slow.next = slow.next.next;
    return dummy.next;
}
```

**Invariant**

`fast` stays exactly `n + 1` steps ahead of `slow`.

### Mental Model

The gap is the real data structure.
You are turning a backward-looking problem into a forward-only traversal.

### Pattern Variations

- return the kth node from the end
- find the node before the kth node from the end
- apply the same setup to list partitioning problems

### Common Mistakes

- advancing `fast` by `n` instead of `n + 1` when using a dummy node
- forgetting why the dummy node is needed for head deletion
- not handling invalid `n` if the problem statement does not guarantee valid input

---

## Pattern 6: In-Place Reversal

This is a pointer-rewiring pattern that often combines with two-pointer reasoning in linked-list interviews.

### How to Recognize This Pattern

- Signals in the problem statement:
  reverse list, reverse sublist, reverse in groups, check palindrome in place.
- Keywords that hint at it:
  reverse, reorder, restore, second half, in place.
- Constraints that guide the approach:
  expected `O(1)` extra space and permission to mutate links.

### Problem-Solving Approach

**Brute force idea**

Copy values into an array or stack, then rebuild the answer.
This is simpler but uses extra memory.

**Optimization insight**

You can reverse a list by redirecting each `next` pointer exactly once.

**Final optimal approach**

Maintain three references:

- `prev` for the already reversed prefix
- `curr` for the node being processed
- `next` for the remainder you still need to preserve

**Why this approach works**

At every step, you save the rest of the list before mutating the current link.
That prevents you from losing reachability.

### Visual Intuition

```text
Before:
null <- 1    2 -> 3 -> 4
       ^
      curr

After rewiring one step:
null <- 1 <- 2    3 -> 4
            ^
           curr

The reversed prefix grows leftward.
The unprocessed suffix remains reachable through `next`.
```

### Example Problem: Reverse Linked List

```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}
```

**Invariant**

`prev` points to the reversed prefix, and `curr` points to the remaining unreversed suffix.

### Pattern Variations

- `Reverse Linked List II`: reconnect the reversed sublist to the untouched prefix and suffix.
- `Reverse Nodes in K Group`: reverse in chunks after verifying enough nodes remain.
- `Palindrome Linked List`: find middle, reverse second half, compare both halves.

### Common Mistakes

- losing the `next` reference before rewiring
- returning `head` instead of `prev`
- forgetting to reconnect the untouched parts in sublist reversal problems

---

## Pattern 7: Dummy Node and Merge Builder

Use this pattern when the head should stop being special.

### How to Recognize This Pattern

- Signals in the problem statement:
  merge lists, remove from head, insert before head, build a result list incrementally.
- Keywords that hint at it:
  merge, sentinel, dummy, append, tail, head edge case.
- Constraints that guide the approach:
  clean one-pass mutation, minimal branching, preserve sorted order if present.

### Problem-Solving Approach

**Brute force idea**

Copy all values into a separate structure, sort if needed, then rebuild the list.

**Optimization insight**

You can stream nodes directly into the answer while preserving order.
A dummy node gives you one stable pointer before the real head.

**Final optimal approach**

Use `tail` to build a finalized prefix.
At each step, attach the smaller current node and advance that list.

**Why this approach works**

The output prefix is always fully correct, and the remaining nodes are still untouched input.

### Visual Intuition

```text
list1: 1 -> 3 -> 5
list2: 2 -> 4 -> 6

dummy -> tail

Take 1:
dummy -> 1
          ^
         tail

Take 2:
dummy -> 1 -> 2
               ^
              tail

Continue until one list is exhausted, then attach the remainder.
```

### Example Problem: Merge Two Sorted Lists

```java
public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;

    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }

    tail.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}
```

**Invariant**

`dummy.next .. tail` is always the fully merged prefix, and `list1` and `list2` still point to the unmerged suffixes.

### Pattern Variations

- `Remove Linked List Elements`: dummy node makes head deletion identical to middle deletion.
- `Partition List`: build multiple output chains, then connect them.
- `Merge K Sorted Lists`: combine this builder pattern with a min-heap.

### Common Mistakes

- forgetting to move `tail`
- writing special logic for the first node instead of using a dummy node
- forgetting to attach the remaining suffix after one list ends

---

## Common Mistakes Across Two-Pointer Problems

These mistakes show up repeatedly in interviews:

1. Wrong loop condition
   Use `left < right`, `fast != null && fast.next != null`, or `while (sum >= target)` only when the invariant requires it.
2. No guaranteed progress
   If neither pointer moves on some branch, the algorithm can loop forever.
3. Losing references in linked lists
   Always save the next node before rewiring.
4. Ignoring edge cases
   Test empty input, one element, two elements, duplicates, and head-removal cases.
5. Using the right pattern under the wrong constraints
   Sliding window for sum constraints usually needs monotonicity, such as all-positive numbers.
6. Forgetting what the pointer represents
   `slow` is not always "slower." Sometimes it is a write index, sometimes a trailing pointer, sometimes the node before the target.

---

## Complexity Insights

Most interview-grade two-pointer problems follow a familiar complexity profile.

| Pattern | Time | Extra space | Trade-off |
| --- | --- | --- | --- |
| Opposite-direction pointers | `O(n)` after sorting or on already sorted input | `O(1)` | if sorting is required, total time becomes `O(n log n)` and original order may be lost |
| Fast/slow compaction | `O(n)` | `O(1)` | mutates the input array |
| Sliding window | `O(n)` | `O(1)` to `O(k)` depending on auxiliary map/set | only works when the window rule can be maintained incrementally |
| Fast/slow linked-list pointers | `O(n)` | `O(1)` | loop conditions are easy to get wrong |
| Fixed gap | `O(n)` | `O(1)` | dummy node adds one object but removes head special cases |
| In-place reversal | `O(n)` | `O(1)` | destroys original direction unless you reverse again |
| Merge builder | `O(n + m)` | `O(1)` when reusing nodes | pointer discipline matters more than raw algorithmic difficulty |

Interview shortcut:
for an optimal two-pointer solution, a strong summary is often:
"We do one linear scan, keep the state in pointers, and use `O(1)` extra space."

---

## Pattern Variations and Follow-Up Questions

Interviewers often mutate a base pattern slightly to test whether you actually understand it.

### Opposite-direction variations

- what changes if duplicates are allowed?
- what if you need all valid pairs instead of one?
- what if the array is not sorted and sorting would break the required output?

### Sliding-window variations

- what additional data structure is needed if the window must track counts or uniqueness?
- what breaks if negative numbers are introduced?
- do you need shortest valid window or longest valid window?

### Linked-list variations

- do you need the first middle or second middle?
- can the head be removed?
- do you need to restore the list after modifying it?

The best way to handle follow-ups is to restate the invariant and say exactly which part changes.

---

## Pattern Composition (Advanced)

The strongest interview solutions often combine patterns instead of using them in isolation.

| Composition | Where it shows up | Why it works |
| --- | --- | --- |
| Sorting + opposite-direction pointers | `3Sum`, `4Sum`, pair-difference problems | sorting creates monotonic movement rules |
| Sliding window + hash map | longest unique substring, permutation matching | pointers define the window, map tracks validity |
| Fast/slow + reversal | `Palindrome Linked List` | find the middle, reverse the second half, compare both halves |
| Fast/slow + reset to head | `Linked List Cycle II` | the meeting point lets you prove the cycle entry |
| Dummy node + fixed gap | `Remove Nth Node From End` | deletion becomes uniform even when the head changes |
| Merge builder + heap | `Merge K Sorted Lists` | heap chooses the next smallest head, tail builds the answer |

This is how senior candidates think:
not "Which memorized solution fits?"
but "Which invariant becomes available if I combine these two ideas?"

---

## Interview Answer Template

When you recognize a two-pointer problem, a clean explanation sounds like this:

1. "The key signal is that the input is sorted or the answer lives in a contiguous range."
2. "I will maintain this invariant: ..."
3. "When this condition happens, moving this pointer is safe because ..."
4. "Each pointer only moves forward or inward, so the total work is linear."
5. "The solution uses `O(1)` extra space unless we add a helper map or set."

That style sounds significantly stronger than only saying, "I will use two pointers."

---

## Practice Set (Recommended Order)

These problems cover the most useful variations:

1. Two Sum II - Input Array Is Sorted (LC 167)  
   [LeetCode](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
2. Valid Palindrome (LC 125)  
   [LeetCode](https://leetcode.com/problems/valid-palindrome/)
3. Remove Duplicates from Sorted Array (LC 26)  
   [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
4. Minimum Size Subarray Sum (LC 209)  
   [LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum/)
5. Container With Most Water (LC 11)  
   [LeetCode](https://leetcode.com/problems/container-with-most-water/)
6. Middle of the Linked List (LC 876)  
   [LeetCode](https://leetcode.com/problems/middle-of-the-linked-list/)
7. Linked List Cycle (LC 141)  
   [LeetCode](https://leetcode.com/problems/linked-list-cycle/)
8. Remove Nth Node From End of List (LC 19)  
   [LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
9. Reverse Linked List (LC 206)  
   [LeetCode](https://leetcode.com/problems/reverse-linked-list/)
10. Merge Two Sorted Lists (LC 21)  
   [LeetCode](https://leetcode.com/problems/merge-two-sorted-lists/)
11. Palindrome Linked List (LC 234)  
   [LeetCode](https://leetcode.com/problems/palindrome-linked-list/)
12. 3Sum (LC 15)  
   [LeetCode](https://leetcode.com/problems/3sum/)

---

## Key Takeaways

- Two pointers is not about memorizing pointer names. It is about maintaining an invariant with minimal state.
- The best recognition signals are sorted input, contiguous ranges, in-place mutation, and linked-list structure questions.
- Arrays usually use pointers to eliminate search space or maintain a valid range.
- Linked lists usually use pointers to infer structure or rewire links safely.
- In interviews, explain why each pointer move is safe, not just what it does.

If you can reliably identify the pattern, state the invariant, and walk the edge cases, you will solve a large class of array, string, and linked-list interview problems with much more confidence.

---
*Author: Sandeep Bhardwaj*  
*Senior Backend Engineer | Java | Distributed Systems*
