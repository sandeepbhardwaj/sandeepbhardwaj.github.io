---
title: Palindrome Number in Java (Without String Conversion)
date: '2019-07-18'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- math
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Palindrome Number in Java Without Converting to String
seo_description: Check if integer is palindrome by reversing only half the number.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This problem looks like a string problem at first, but there is a neat numeric solution.
The clean trick is to reverse only half of the digits instead of reversing the whole number.

---

## Problem 1: Palindrome Number

Problem description:
Given an integer `x`, return `true` if it reads the same forward and backward; otherwise return `false`. Solve it without converting the number to a string.

What we are solving actually:
Reversing the full number works, but it can overflow and does extra work. We only need enough reversed digits to compare the left half with the right half.

What we are doing actually:

1. Reject numbers that can never be palindromes, like negatives and numbers ending in `0` (except `0` itself).
2. Build `reversedHalf` one digit at a time from the right side.
3. Stop once `reversedHalf` is greater than or equal to the remaining left half.
4. Compare the two halves, ignoring the middle digit for odd-length numbers.

```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false; // Negative numbers and trailing-zero numbers cannot mirror correctly.

        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10; // Pull one digit from the right into the reversed half.
            x /= 10; // Remove that digit from the original left half.
        }

        return x == reversedHalf || x == reversedHalf / 10; // Odd-length numbers have one extra middle digit in reversedHalf.
    }
}
```

Debug steps:

- print `x` and `reversedHalf` each loop iteration
- test `121`, `1221`, `10`, `0`, and `-121`
- verify the invariant that `reversedHalf` is always the reverse of the digits removed from the original number so far

---

## Why Half Reversal Works

For a palindrome:

- left half mirrors right half

So once we reverse the right half, we do not need the entire reversed number.
We only need enough digits to compare both halves.

That gives two cases:

- even number of digits:
  compare `x == reversedHalf`

- odd number of digits:
  compare `x == reversedHalf / 10`

The middle digit does not matter in a palindrome, so we can drop it.

---

## Dry Run

Input: `1221`

1. start: `x = 1221`, `reversedHalf = 0`
2. move one digit:
   `reversedHalf = 1`
   `x = 122`
3. move one digit:
   `reversedHalf = 12`
   `x = 12`
4. stop because `x` is no longer greater than `reversedHalf`

Now:

- `x == reversedHalf`
- `12 == 12`

Answer: `true`

Odd-length example: `121`

At the end:

- `x = 1`
- `reversedHalf = 12`

Drop the middle digit:

- `reversedHalf / 10 = 1`

So it is also a palindrome.

---

## Early Rejections

These quick checks are important:

- `x < 0` -> false, because the minus sign appears only on one side
- `x % 10 == 0 && x != 0` -> false, because a non-zero palindrome cannot start with `0`

Example:

- `10` ends in `0`
- reversed form would need to start with `0`
- that is impossible for a normal integer representation

---

## String-Based Alternative

A string solution is completely valid when the problem allows it:

- convert number to string
- compare from both ends

The numeric half-reversal method is useful when:

- the interviewer explicitly forbids string conversion
- you want constant extra space
- you want to avoid whole-number reversal overflow concerns

---

## Common Mistakes

1. reversing the full number and risking overflow
2. forgetting the trailing-zero rejection rule
3. missing the odd-digit comparison with `reversedHalf / 10`
4. treating negative numbers as possible palindromes

---

## Complexity

- Time: `O(log10 n)`
- Space: `O(1)`

---

## Key Takeaways

- reverse only half the digits, not the whole number
- odd-length palindromes need the middle digit ignored
- early rejection rules remove impossible cases before the loop starts
