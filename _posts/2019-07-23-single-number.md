---
title: Single Number in Java Using XOR
date: '2019-07-23'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- bit-manipulation
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Single Number in Java Using XOR (LeetCode 136)
seo_description: Find unique element in array where all others appear twice using
  XOR.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the best interview problems for learning how a bitwise invariant can replace extra memory.
If every number appears twice except one, XOR gives us cancellation for free.

The elegant part is that the algorithm is not a trick you memorize.
It is a direct consequence of four small XOR properties.

## Quick Summary

| Fact | Why it matters |
| --- | --- |
| `a ^ a = 0` | duplicate values cancel |
| `a ^ 0 = a` | the surviving value remains unchanged |
| XOR is associative | grouping does not matter |
| XOR is commutative | processing order does not matter |

The invariant is:
after processing the first `i` numbers, `result` equals the XOR of those `i` numbers.

## Problem Statement

Given an integer array where every value appears exactly twice except one value that appears once, return the single value.

The obvious solution is a frequency map.
It works, but it uses memory to count something the problem structure already guarantees.

The stronger solution is to exploit pair cancellation directly.

## Why XOR Solves It

Suppose the array is:

```text
[4, 1, 2, 1, 2]
```

If we XOR everything together:

```text
4 ^ 1 ^ 2 ^ 1 ^ 2
```

we can reorder and regroup because XOR is associative and commutative:

```text
4 ^ (1 ^ 1) ^ (2 ^ 2)
```

Now apply the key rule:

```text
1 ^ 1 = 0
2 ^ 2 = 0
```

So the expression becomes:

```text
4 ^ 0 ^ 0 = 4
```

That is the entire proof.

## Java Solution

```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;

        for (int n : nums) {
            result ^= n;
        }

        return result;
    }
}
```

## Why the Running Accumulator Works

At any moment, `result` stores the XOR of everything processed so far.

When we XOR in a value:

- if it is the first time we see that value, it enters the accumulator
- if it is the second time, it cancels out

So paired values keep appearing and disappearing, and only the unpaired value survives to the end.

That is why the code is just one loop and one accumulator.

## Dry Run

Input:

```text
[4, 1, 2, 1, 2]
```

Step by step:

1. `result = 0`
2. `result ^= 4` -> `4`
3. `result ^= 1` -> `5`
4. `result ^= 2` -> `7`
5. `result ^= 1` -> `6`
6. `result ^= 2` -> `4`

Final answer:

```text
4
```

The intermediate values are not meaningful by themselves.
What matters is that pairs eventually cancel.

## Why This Beats a Frequency Map Here

A map-based solution is easy to explain:

- count every value
- return the one with frequency `1`

But compared with XOR, it is weaker for this exact problem:

- more code
- `O(n)` extra space instead of `O(1)`
- less insight into the special structure of the input

In interviews, the map solution is acceptable as a starting point.
The XOR solution is the answer that shows you recognized the constraint.

## Important Constraint Check

This method works because the frequency pattern is exact:

- one value appears once
- every other value appears exactly twice

If the problem changes, the solution may change too.

Examples:

- every other number appears three times -> plain XOR no longer works
- two numbers appear once -> use partition-by-bit logic
- unspecific repetition counts -> use a map

This is the real interview lesson:
do not apply XOR because the problem "looks similar."
Apply it because the frequency invariant matches.

## Common Mistakes

### Using Sorting First

Sorting works, but it adds unnecessary `O(n log n)` cost to a problem with a linear solution.

### Reaching for a HashMap Too Early

That is a reasonable baseline, but it misses the stronger invariant.

### Misapplying the Trick to the Wrong Variant

The XOR approach is narrow and precise.
Its strength comes from the exact pair-cancellation pattern.

### Thinking Negative Numbers Break It

They do not.
XOR operates on bit patterns, and Java integers use a well-defined binary representation.

## Boundary Cases

- `[7]` -> answer is `7`
- `[0, 1, 1]` -> answer is `0`
- negative values still work

The important thing is not positivity.
It is the repetition pattern.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

We scan the array once and keep only one accumulator.

## Where This Pattern Generalizes

The broader pattern is not "always use XOR."
It is:

1. identify whether values cancel under some operation
2. keep a running accumulator
3. let the input structure do the work

That mindset shows up again in:

- parity checks
- bitmask state tracking
- missing-number style problems
- power-of-two and low-bit manipulations

## Final Takeaway

`Single Number` is a great reminder that the best solution is sometimes just the right invariant made operational.

Here the invariant is simple:
duplicate pairs vanish under XOR, so one pass is enough to leave the only unpaired value behind.
