---
title: Remove All Adjacent Duplicates in String (Java)
date: '2019-07-19'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- stack
- strings
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove All Adjacent Duplicates in String in Java
seo_description: Stack-based linear solution for removing adjacent duplicates repeatedly.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Given a string, repeatedly remove adjacent equal characters until no such pair remains.

Example: `"abbaca" -> "ca"`

---

## Stack Simulation Idea

Process characters left to right using stack behavior:

- if current char equals stack top, pop top (remove pair)
- otherwise push current char

A `StringBuilder` works as efficient mutable stack.

---

## Java Solution

```java
class Solution {
    public String removeDuplicates(String s) {
        StringBuilder stack = new StringBuilder();

        for (char c : s.toCharArray()) {
            int len = stack.length();
            if (len > 0 && stack.charAt(len - 1) == c) {
                stack.deleteCharAt(len - 1);
            } else {
                stack.append(c);
            }
        }

        return stack.toString();
    }
}
```

---

## Dry Run

Input: `"abbaca"`

- read `a` -> stack: `a`
- read `b` -> stack: `ab`
- read `b` -> top `b` matches, pop -> `a`
- read `a` -> top `a` matches, pop -> ``
- read `c` -> `c`
- read `a` -> `ca`

Result: `"ca"`

---

## Why One Pass Works

Each character is:

- pushed at most once
- popped at most once

So total operations are linear.
No repeated rescans are needed.

---

## Common Mistakes

1. repeatedly using `replace` in loops (`O(n^2)` behavior)
2. using immutable string concatenation inside loop
3. missing chain reactions after a pop

---

## Complexity

- Time: `O(n)`
- Space: `O(n)`

---

## Key Takeaways

- adjacency + chain reaction naturally maps to stack pattern.
- `StringBuilder` gives efficient push/pop by end operations.
- this same idea extends to "remove adjacent duplicates in groups of k" using `(char, count)` pairs.
