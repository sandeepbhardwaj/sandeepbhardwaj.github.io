---
title: Binary Search Pattern in Java - Interview Preparation Guide
date: 2026-03-16
categories:
- DSA
- Java
tags:
- dsa
- java
- binary-search
- algorithms
- interview-preparation
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Binary Search Pattern in Java – Complete Interview Guide (Exact Match, Bounds, Answer Space)
seo_description: Learn binary search patterns in Java with exact match, lower bound, and answer-space problems. Includes intuition, edge cases, and interview-ready explanations.
header:
  overlay_image: "/assets/images/binary-search-banner.svg"
  overlay_filter: 0.35
  caption: Log-Time Decisions on Monotonic Spaces
  show_overlay_excerpt: false
---
Binary search is not just for finding a value in a sorted array.
It is a decision pattern over monotonic spaces.

Strong candidates do not describe binary search as "keep halving until it works."
They define the search space, state the interval convention, prove which half is impossible after each comparison, and explain what the loop returns when the target is missing.

> [!NOTE] Interview lens
> A strong binary-search explanation usually has four parts:
> 1. what ordered or monotonic space is being searched,
> 2. which invariant the interval maintains,
> 3. why the midpoint test lets you discard one half safely,
> 4. what value the loop returns when you are searching for a boundary rather than an exact match.

---

## Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|---|---|---|---|
| Exact Match | Target exists in a sorted array and you need its index | Compare the middle value and discard the impossible half | Binary Search (LC 704) |
| First True / Lower Bound | Need the first index where a monotonic condition becomes true | Keep mid when condition is true and continue searching left | Search Insert Position (LC 35) |
| Answer Space Search | The answer is numeric and feasibility is monotonic | Binary search the smallest valid answer instead of scanning all answers | Koko Eating Bananas (LC 875) |

---

## Problem Statement

Binary search applies when:

- the input is sorted, or
- the answer space is monotonic, meaning once a condition becomes true, it stays true (or once false, stays false in the other direction)

Typical goals include:

- finding an exact value
- finding the first or last valid position
- finding the minimum or maximum feasible answer

> [!NOTE]
> Before coding, confirm the search space is monotonic. If you cannot prove that one half can be safely discarded, then binary search is not justified.

**Common constraints that favor binary search:**

- Input size is large, often `10^5` or more
- A linear scan may pass, but is not optimal
- A brute-force answer search would be too slow
- The condition can be evaluated independently for a candidate answer

---

## Pattern Recognition Signals

You should strongly consider binary search when the problem contains one or more of these signals.

### Keywords

- sorted array
- first occurrence
- last occurrence
- smallest valid
- minimum feasible
- maximum possible
- insert position
- monotonic
- answer space

### Constraint Signals

- Brute force is `O(n)` or `O(answer range * n)` but expected solution is faster
- The input or output domain is ordered
- There is a yes/no feasibility function over a numeric range

### Core Observations

- We are not required to examine every candidate
- Once a condition becomes true, the answer lies on one side
- Once a target comparison is made, sorted order lets us discard half

> [!IMPORTANT]
> If you can say, “everything on the left fails” or “everything on the right is too large,” then binary search is probably the right pattern.

---

## Example

Consider a sorted array:

**Input:** `nums = [2, 4, 7, 11, 15]`, `target = 11`  
**Output:** `3`

### Step-by-step

- Start with search range `[0, 4]`
- Middle index is `2`, value is `7`
- Since `7 < 11`, discard the left half including index `2`
- New range becomes `[3, 4]`
- Middle index is `3`, value is `11`
- Exact match found

This works because the array is sorted, so every element before `7` is also too small.

---

## Brute Force Approach

### Idea

Scan the full array from left to right until the answer is found.

For answer-space problems, brute force would try every possible answer value and check feasibility one by one.

### Complexity

- Exact search by scan: `O(n)`
- Answer-space brute force: often `O(range * checkCost)`

> [!WARNING]
> Brute force ignores monotonic structure. The whole point of binary search is that we do **not** need to inspect every element or every answer candidate.

### Why It Fails

- It wastes comparisons on impossible regions
- It does not exploit sorted order
- In answer-space problems, checking all candidates can be prohibitively expensive

---

## Optimized Approach

### Key Insight

Maintain a range where the answer may still exist. At each step, inspect the middle and eliminate half the space based on a monotonic rule.

### Mental Model

We maintain an invariant: **the answer is always inside the current search range**.

Or more practically:

> Each comparison should eliminate half of the remaining possibilities.

### General Steps

1. Define the search space
2. Choose an interval style:
   - closed `[lo, hi]`
   - half-open `[lo, hi)`
3. Compute `mid` safely using `lo + (hi - lo) / 2`
4. Use the condition or comparison to discard one half
5. Repeat until the loop ends
6. Validate the result if the problem is boundary-based

### Generic Skeleton

```java
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (condition(mid)) {
        hi = mid - 1; // or hi = mid depending on interval style
    } else {
        lo = mid + 1;
    }
}
```

### Complexity

- Time: `O(log n)` for array search
- Time: `O(log range * checkCost)` for answer-space search
- Space: `O(1)`

> [!TIP]
> Binary search is optimal when every step can safely eliminate half the remaining search space. The real challenge is not coding it, but defining the right invariant and interval convention.

---

## Visual Intuition

```text
Sorted array:
[2, 4, 7, 11, 15, 20, 25]
             ^
            mid

If target > nums[mid], discard left half
If target < nums[mid], discard right half

Answer-space view:
false false false true true true
                  ^
             first true
```

The second diagram is the most important mental model for advanced binary search. You are often not searching for a value. You are searching for the **first valid answer**.

---

## Pattern 1: Exact Match

### Problem Statement

Given a sorted array and a target value, return the exact index if the target exists.

### Recognition

Signals:

- sorted array
- direct target lookup
- exact index required

> [!IMPORTANT]
> If the array is sorted and the task is to find whether a target exists, exact-match binary search is the default starting point.

### Example

**Input:** `nums = [1, 3, 5, 7, 9]`, `target = 7`  
**Output:** `3`

### Problem-Solving Approach

1. Keep a search range that may still contain the answer.
2. Look at the middle element.
3. Discard half the range based on sorted order.

### Brute Force

#### Idea

Check every element until the target is found.

#### Complexity

- Time: `O(n)`
- Space: `O(1)`

> [!WARNING]
> This works, but it wastes the fact that the array is already sorted.

### Optimized Approach

#### Key Insight

At every step, compare `nums[mid]` with the target. Because the array is sorted, one side becomes impossible immediately.

#### Mental Model

We maintain a candidate interval where the target could still exist. After checking `mid`, we remove the half that cannot possibly contain the target.

#### Steps

1. Start with `lo = 0`, `hi = nums.length - 1`
2. Compute `mid`
3. If `nums[mid] == target`, return `mid`
4. If `nums[mid] < target`, move right
5. Otherwise, move left
6. If range becomes empty, return `-1`

#### Code (Java)

```java
public int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid; // Exact match found.
        if (nums[mid] < target) lo = mid + 1; // Target must be on the right half.
        else hi = mid - 1; // Target must be on the left half.
    }
    return -1;
}
```

#### Complexity

- Time: `O(log n)`
- Space: `O(1)`

> [!TIP]
> This is optimal for exact search in a sorted array because each comparison cuts the remaining search space in half.

### Visual Intuition

```text
nums   = [1, 3, 5, 7, 9]
target = 7

lo=0 hi=4 mid=2 nums[mid]=5  -> target is on the right
lo=3 hi=4 mid=3 nums[mid]=7  -> found
```

### Common Mistakes

- Using `(lo + hi) / 2` and risking overflow in other languages or larger integer ranges
- Incorrect boundary updates causing infinite loops
- Forgetting that this variant uses a closed interval `[lo, hi]`

> [!CAUTION]
> Choose one interval style and stay consistent. Mixing `[lo, hi]` logic with `[lo, hi)` updates is one of the most common interview mistakes.

### Debug Tips

- print `lo`, `hi`, `mid`, and `nums[mid]` each iteration
- verify the loop condition matches the boundary style you chose
- test found, not-found, first-index, and last-index cases

### Variations

- Search Insert Position
- First and Last Position of Element in Sorted Array
- Search in Rotated Sorted Array

### Composition

- Combine with lower/upper bound logic when duplicates exist
- Combine with rotation logic when the sorted array has been shifted

---

## Pattern 2: First True / Lower Bound

### Problem Statement

Return the first index where the array value is greater than or equal to the target.

### Recognition

Signals:

- asks for the first valid position
- boundary search, not exact match
- condition can be written as `nums[mid] >= target`

> [!IMPORTANT]
> If the question asks for the earliest index satisfying a condition, think “first true” binary search.

### Example

**Input:** `nums = [1, 3, 3, 5, 8]`, `target = 3`  
**Output:** `1`

If target is missing:

**Input:** `nums = [1, 3, 5, 8]`, `target = 4`  
**Output:** `2` because index `2` is the first place with value `>= 4`

### Problem-Solving Approach

1. Use a half-open interval `[lo, hi)`.
2. Treat `nums[mid] >= target` as a true condition.
3. Move left when true so we keep searching for an earlier valid index.

### Brute Force

#### Idea

Scan from left to right and return the first index where `nums[i] >= target`.

#### Complexity

- Time: `O(n)`
- Space: `O(1)`

> [!WARNING]
> This ignores the fact that once one value satisfies the condition, everything after it also satisfies it. That monotonic transition is exactly what binary search exploits.

### Optimized Approach

#### Key Insight

This is not an exact-match search. It is a search for the first position where a monotonic condition becomes true.

#### Mental Model

Imagine a boolean array:

```text
false false false true true true
```

Your job is to find the first `true`.

#### Steps

1. Set `lo = 0`, `hi = nums.length`
2. While `lo < hi`:
   - compute `mid`
   - if `nums[mid] >= target`, keep `mid` by moving `hi = mid`
   - else move `lo = mid + 1`
3. Return `lo`

#### Code (Java)

```java
public int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length; // half-open
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid; // Mid could be the first valid answer.
        else lo = mid + 1; // Need a larger value, so move right.
    }
    return lo;
}
```

#### Complexity

- Time: `O(log n)`
- Space: `O(1)`

> [!TIP]
> Returning `lo` is correct because the loop ends only when the search space shrinks to the first valid insertion position.

### Visual Intuition

```text
nums   = [1, 3, 3, 5, 8]
target = 3

condition: nums[i] >= 3

index:      0     1     2     3     4
value:      1     3     3     5     8
cond:    false  true  true  true  true
                ^
          first true
```

### Common Mistakes

- Using `hi = mid - 1` with a half-open interval variant
- Returning `-1` directly without defining what lower bound means when target is missing
- Confusing lower bound with exact match

> [!CAUTION]
> Lower bound returns a position, not necessarily an existing occurrence of the target. Always define what the returned index means.

### Debug Tips

- print `lo`, `hi`, `mid`, and whether the condition was true
- test all elements smaller than target and all elements greater than target
- verify you return `lo` even when the target is missing

### Variations

- upper bound
- first occurrence of target
- last occurrence of target
- search insert position

### Composition

- Combine with post-loop validation to turn lower bound into exact occurrence detection
- Combine with duplicate-handling problems to find frequency ranges

---

## Pattern 3: Search on Answer

### Problem Statement

When the answer is numeric and feasibility is monotonic, binary search the answer itself.

Example: minimum eating speed (Koko).

We do not search for a value inside an array. We search for the smallest answer that makes the feasibility check pass.

### Recognition

Signals:

- asks for minimum or maximum possible answer
- answer is numeric
- a helper function can test feasibility
- if one candidate works, all larger (or smaller) candidates also work

> [!IMPORTANT]
> If you can write `canX(mid)` and the result is monotonic, then answer-space binary search is likely the intended solution.

### Example

For Koko:

- If speed `k = 30` works, then `31`, `32`, and larger speeds also work
- That gives a monotonic true/false answer space

### Problem-Solving Approach

1. Define a numeric answer range.
2. Write a `canFinish` function that is monotonic.
3. Binary search for the smallest speed where feasibility becomes true.

### Brute Force

#### Idea

Try every candidate speed from `1` up to `max(piles)` and return the first one that works.

#### Complexity

- Time: `O(maxPile * n)` in the worst case
- Space: `O(1)`

> [!WARNING]
> This becomes slow when the answer range is large. The inefficiency is not in checking one candidate, but in checking too many candidates.

### Optimized Approach

#### Key Insight

We are searching for the first valid answer in a monotonic range of possible speeds.

#### Mental Model

Think of the answer range as:

```text
speed:   1  2  3  4  5  6  ...
works?   F  F  F  T  T  T  ...
```

The job is to find the first `T`.

#### Steps

1. Set `lo = 1`
2. Set `hi = max(piles)`
3. While `lo < hi`:
   - compute `mid`
   - if `canFinish(mid)` is true, keep searching left
   - else search right
4. Return `lo`

#### Code (Java)

```java
public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = Arrays.stream(piles).max().orElse(1);

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, h, mid)) hi = mid; // Mid works, so try a smaller answer.
        else lo = mid + 1; // Mid is too small, so move right.
    }
    return lo;
}

private boolean canFinish(int[] piles, int h, int k) {
    long hours = 0;
    for (int p : piles) {
        hours += (p + k - 1) / k; // Ceiling division for hours needed at speed k.
    }
    return hours <= h;
}
```

#### Complexity

Let `M = max(piles)`.

- Time: `O(n log M)`
- Space: `O(1)`

> [!TIP]
> The key to answer-space binary search is not the loop itself. It is proving monotonicity of the helper function.

### Visual Intuition

```text
Possible speeds: 1  2  3  4  5  6  7
canFinish:       F  F  F  T  T  T  T
                           ^
                      first valid speed
```

### Common Mistakes

- Not proving the helper is monotonic
- Setting invalid search bounds
- Debugging the binary search loop instead of first verifying the helper
- Integer overflow in aggregated computations

> [!CAUTION]
> If binary search “looks correct” but still fails, inspect the helper function first. In answer-space problems, the bug is often in feasibility logic, not in the boundary updates.

### Debug Tips

- print `lo`, `hi`, `mid`, and `canFinish(...)` on each iteration
- test feasibility on two neighboring answers to confirm monotonicity
- if binary search seems wrong, inspect the helper first

### Variations

- Capacity To Ship Packages Within D Days
- Minimum Days to Make M Bouquets
- Split Array Largest Sum
- Smallest Divisor Given a Threshold

### Composition

- Combine with greedy feasibility checks
- Combine with prefix sum or accumulation logic inside the helper

---

## Common Mistakes

1. Infinite loops from wrong boundary updates
2. Mid overflow from `(lo + hi) / 2`
3. Mixing closed `[lo, hi]` and half-open `[lo, hi)` styles
4. Not proving monotonicity in answer-space problems

> [!CAUTION]
> Binary search bugs are usually not “big logic” bugs. They are small invariant or boundary mistakes. That is why disciplined interval handling matters so much.

---

## Debug Pattern (Fast)

When binary search fails, print:

- `lo`, `hi`, `mid`
- `nums[mid]` or feasibility result
- update decision taken

Example:

```text
lo=3 hi=7 mid=5 cond=true -> hi=5
```

You can usually spot off-by-one errors within a few iterations.

---

## Post-Loop Validation Rule

For bound-style searches, loop exit index may still need validation.

Example for lower bound:

```java
int idx = lowerBound(nums, target);
if (idx == nums.length || nums[idx] != target) return -1;
```

Always define what returned index means when target is missing.

> [!NOTE]
> Post-loop validation is part of the algorithm, not an afterthought. Binary search often gives you a candidate position, and you must still decide whether that candidate satisfies the exact requirement.

---

## Pattern Composition (Advanced)

Binary search becomes even more powerful when combined with other patterns.

### 1. Binary Search + Greedy

Used in answer-space problems where a greedy check can verify feasibility.

Examples:

- Koko Eating Bananas
- Capacity To Ship Packages Within D Days

### 2. Binary Search + Prefix Sum

Useful when feasibility or range properties can be checked faster using precomputed sums.

### 3. Binary Search + Two Pointers / Sliding Window

In some problems, binary search is applied to answer size, while a window check validates feasibility.

### 4. Binary Search on Implicit Domains

Sometimes the array is not explicitly sorted, but the answer domain is ordered and monotonic.

> [!IMPORTANT]
> Strong interview performance comes from recognizing that binary search is often a search framework layered on top of another idea, especially greedy feasibility.

---

## Key Takeaways

- Binary search is a monotonic decision framework, not just a value lookup trick.
- Choose one interval convention and stay consistent.
- Lower bound and first-true style are often more useful than exact-match search.
- Answer-space binary search is one of the highest-value interview patterns.
- The real skill is defining the invariant and monotonic condition correctly.

---

## Practice Problems

1. Binary Search (LC 704)  
   [LeetCode](https://leetcode.com/problems/binary-search/)
2. First Bad Version (LC 278)  
   [LeetCode](https://leetcode.com/problems/first-bad-version/)
3. Search Insert Position (LC 35)  
   [LeetCode](https://leetcode.com/problems/search-insert-position/)
4. Find First and Last Position (LC 34)  
   [LeetCode](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
5. Koko Eating Bananas (LC 875)  
   [LeetCode](https://leetcode.com/problems/koko-eating-bananas/)
6. Capacity To Ship Packages (LC 1011)  
   [LeetCode](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

> [!TIP]
> Practice binary search by category: exact match, first true, last true, and answer space. Pattern recognition becomes much easier when you group problems this way.
