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
This problem looks like it wants string conversion.
The cleaner interview answer is numeric.

The trick is not to reverse the whole number.
It is to reverse only the right half and compare the two halves directly.

## Quick Summary

| Signal | What it means |
| --- | --- |
| string conversion is disallowed | use digit arithmetic |
| reversing full number risks overflow | avoid full reversal |
| palindromes mirror around the center | only half the digits need to be reversed |

The key invariant is:
`reversedHalf` is always the reverse of the digits we have removed from the right side of `x`.

## Problem Statement

Given an integer `x`, return `true` if it reads the same forward and backward.
Do it without converting the number to a string.

## The Main Idea

For a palindrome:

- the left half equals the reversed right half

So we do not need the entire reversed number.
We only need enough digits to compare the halves.

That gives us a safer and smaller algorithm:

1. reject impossible cases early
2. peel digits from the right
3. build `reversedHalf`
4. stop when the left half is no longer longer than the reversed right half

## Java Solution

```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reversedHalf = 0;

        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }

        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

## Why This Works

Each loop iteration:

- removes one digit from the right side of `x`
- appends that digit to `reversedHalf`

Eventually there are two possibilities.

### Even number of digits

Example: `1221`

Stop when:

- `x = 12`
- `reversedHalf = 12`

Compare them directly.

### Odd number of digits

Example: `121`

Stop when:

- `x = 1`
- `reversedHalf = 12`

The middle digit does not matter, so drop it with:

```java
reversedHalf / 10
```

Now compare:

- `1 == 1`

## Early Rejection Rules

These checks are not optional details.
They remove impossible cases before the loop starts.

### Negative numbers

`-121` is not a palindrome because the minus sign appears only on the left.

### Numbers ending in zero

Any non-zero number ending in `0` cannot be a palindrome.
If it were, it would also have to start with `0`, which normal integer notation does not allow.

That is why:

```java
x % 10 == 0 && x != 0
```

means immediate `false`.

## Dry Run

Input:

```text
1221
```

Start:

- `x = 1221`
- `reversedHalf = 0`

Iteration 1:

- take last digit `1`
- `reversedHalf = 1`
- `x = 122`

Iteration 2:

- take last digit `2`
- `reversedHalf = 12`
- `x = 12`

Stop because `x` is no longer greater than `reversedHalf`.

Now:

```text
x == reversedHalf
12 == 12
```

So the number is a palindrome.

## Common Mistakes

1. Reversing the full number and ignoring overflow concerns.
2. Forgetting the trailing-zero rejection rule.
3. Missing the odd-length case with `reversedHalf / 10`.
4. Treating negative numbers as candidates.

## Complexity

- Time: `O(log10 n)`
- Space: `O(1)`

## Pattern Generalization

This is a good example of a broader interview habit:

- do not compute more than the comparison actually needs

Half reversal is better than full reversal for the same reason two pointers can be better than checking all pairs:
the algorithm uses structure to avoid wasted work.

## Key Takeaways

- Reverse only half the digits.
- Reject negatives and non-zero trailing-zero numbers immediately.
- Compare `x` with `reversedHalf` for even length, and `x` with `reversedHalf / 10` for odd length.
