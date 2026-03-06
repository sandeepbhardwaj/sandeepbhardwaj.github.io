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
author_profile: true
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
This guide explains the intuition, optimized approach, and Java implementation for palindrome number in java (without string conversion), with practical tips for interviews and production coding standards.

## Problem

Determine if integer `x` is palindrome.

## Better Approach

Instead of reversing full number (risk overflow), reverse only half and compare.

## Java Solution

```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;

        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }

        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

## Why Half Reversal Works

For palindrome numbers, left half mirrors right half.
Once reversed right-half becomes greater than or equal to remaining left-half, enough digits are processed.

- even digits: compare `x == reversedHalf`
- odd digits: middle digit is irrelevant, compare `x == reversedHalf / 10`

This avoids full reversal and overflow concerns.

## Dry Run (`x = 1221`)

1. `x=1221`, `reversedHalf=0`
2. -> `x=122`, `reversedHalf=1`
3. -> `x=12`, `reversedHalf=12`
4. stop (`x` not greater than `reversedHalf`)
5. `x == reversedHalf` => palindrome

## Common Mistakes

1. Reversing whole number and risking overflow.
2. Forgetting early rejection for numbers ending in `0` (except zero).
3. Missing odd-digit handling (`reversedHalf / 10` comparison).

## String-Based Alternative

Converting to string is valid and simpler:

```java
boolean isPalString(int x) {
    String s = Integer.toString(x);
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}
```

Use numeric method when interview asks explicitly “without string conversion.”

## Testing Checklist

- `121` -> true
- `-121` -> false
- `10` -> false
- `0` -> true
- large palindrome and non-palindrome values

## Complexity

- Time: `O(log10 n)`
- Space: `O(1)`

## Edge Cases

- Negative numbers -> false
- `0` -> true
- Numbers ending with `0` (except `0`) -> false

## Key Takeaways

- reversing only half the digits avoids overflow risk and keeps space constant.
- early rejection rules (`x < 0`, trailing zero except zero itself) remove invalid cases quickly.
- odd and even digit counts are handled cleanly by comparing `x` with `reversedHalf` or `reversedHalf / 10`.
