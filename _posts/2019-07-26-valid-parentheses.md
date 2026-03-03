---
title: Valid Parentheses in Java
date: '2019-07-26'
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
seo_title: Valid Parentheses in Java (LeetCode 20)
seo_description: Stack-based validation for bracket matching problems in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Valid Parentheses in Java

Given a string containing only `()[]{}`, return `true` if brackets are valid.
A valid string must close in correct order and with correct bracket type.

---

## Stack Invariant

Use stack to track what closing bracket is expected next.

- on opening bracket, push expected closer
- on closing bracket, it must equal stack top
- after full scan, stack must be empty

---

## Java Solution

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else {
                if (stack.isEmpty() || stack.pop() != c) {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }
}
```

---

## Dry Run

Input: `"{[()]}"`

- `{` -> push `}`
- `[` -> push `]`
- `(` -> push `)`
- `)` -> pop `)` match
- `]` -> pop `]` match
- `}` -> pop `}` match

Stack ends empty -> valid.

Input: `"([)]"`

- `(` -> push `)`
- `[` -> push `]`
- `)` -> top is `]`, mismatch -> invalid

---

## Why Push Expected Closers

This avoids mapping logic during closing phase.
At close bracket, one check is enough: `stack.pop() == currentChar`.

---

## Common Mistakes

1. popping without checking empty stack
2. returning true without checking stack is empty at end
3. using legacy `Stack` instead of `ArrayDeque`

---

## Complexity

- Time: `O(n)`
- Space: `O(n)`

---

## Key Takeaways

- valid parentheses is a strict LIFO matching problem.
- pushing expected closers keeps code concise and less error-prone.
- mismatched closer or leftover expected closers both mean invalid string.
