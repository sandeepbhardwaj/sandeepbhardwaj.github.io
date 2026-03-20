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
author_profile: true
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
This is one of the cleanest bit-manipulation problems.
The whole solution comes from one idea: duplicate values cancel under XOR.

---

## Problem 1: Single Number

Problem description:
Given an integer array where every element appears exactly twice except for one element, return the value that appears only once.

What we are solving actually:
A frequency map would work, but it uses extra memory for a problem with a much simpler bitwise invariant. The real task is to accumulate all values in a way that makes pairs disappear automatically.

What we are doing actually:

1. Start with accumulator `result = 0`.
2. XOR every number into `result`.
3. Let duplicate pairs cancel because `a ^ a = 0`.
4. Return the only value left in the accumulator.

```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;

        for (int n : nums) {
            result ^= n; // Duplicate values cancel, so only the unpaired value survives.
        }

        return result;
    }
}
```

Debug steps:

- print `result` after each XOR operation
- test `[7]`, `[4,1,2,1,2]`, and a case including `0`
- verify the invariant that `result` equals the XOR of all values processed so far

---

## Why XOR Solves It

The important XOR properties are:

- `a ^ a = 0`
- `a ^ 0 = a`
- XOR is associative
- XOR is commutative

So the order does not matter.
Every duplicated number removes itself from the running XOR, and only the unpaired number remains.

---

## Dry Run

Input: `[4, 1, 2, 1, 2]`

1. start: `result = 0`
2. `result ^= 4` -> `4`
3. `result ^= 1` -> `5`
4. `result ^= 2` -> `7`
5. `result ^= 1` -> `6`
6. `result ^= 2` -> `4`

Answer: `4`

The two `1`s cancel.
The two `2`s cancel.
Only `4` remains.

---

## Why Order Does Not Matter

Because XOR is associative and commutative, these are equivalent:

- `((4 ^ 1) ^ 2) ^ 1 ^ 2`
- `(1 ^ 1) ^ (2 ^ 2) ^ 4`

That is why we can process the array in one pass without sorting.

---

## When This Trick Does Not Apply

This exact XOR trick works only for the variant:

- every other value appears exactly twice

If the problem changes to:

- every other value appears three times

then plain XOR no longer works.
That variant needs bit counting or a different state-machine approach.

Always check the frequency pattern before applying the XOR trick automatically.

---

## Common Mistakes

1. using sorting first, which adds unnecessary `O(n log n)` work
2. using a frequency map when `O(1)` extra space is possible
3. applying the same XOR logic to the wrong frequency variant
4. assuming negative numbers break XOR, even though XOR works on bit patterns

---

## Boundary Cases

- single element array -> answer is that element
- array containing `0` -> still works
- negative numbers -> still works

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- XOR cancellation is the full invariant behind this solution
- duplicate pairs disappear automatically in a running XOR
- always confirm the problem's repetition pattern before using this trick

---

## Pattern Extension

One good review question for single number in java using xor is whether the same invariant still holds when the input becomes degenerate: empty arrays, repeated values, already-sorted data, or the smallest possible string. That quick pressure test usually reveals whether we truly understood the pattern or only copied the happy path.
