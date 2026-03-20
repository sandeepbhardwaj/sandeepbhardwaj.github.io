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
This problem looks like repeated string cleanup, but the real pattern is stack simulation.
Whenever a new character cancels the previous one, we want to "undo" the last kept character efficiently.

Example: `"abbaca" -> "ca"`

---

## Problem 1: Remove All Adjacent Duplicates in String

Problem description:
Given a string `s`, repeatedly remove adjacent equal characters until no adjacent duplicate pair remains, then return the final string.

What we are solving actually:
The brute-force instinct is to keep rescanning the whole string after every removal. That works, but it wastes effort because only the newest surviving suffix can be affected by the next character. We only need a structure that remembers the current cleaned prefix.

What we are doing actually:

1. Scan the string from left to right exactly once.
2. Treat the output built so far like a stack.
3. If the current character matches the stack top, remove the top because that pair cancels.
4. Otherwise push the current character into the cleaned result.

```java
class Solution {
    public String removeDuplicates(String s) {
        StringBuilder stack = new StringBuilder();

        for (char c : s.toCharArray()) {
            int len = stack.length();

            // If the current character equals the last kept character,
            // the adjacent pair disappears from the final answer.
            if (len > 0 && stack.charAt(len - 1) == c) {
                stack.deleteCharAt(len - 1);
            } else {
                // Otherwise this character survives for now, so push it.
                stack.append(c);
            }
        }

        return stack.toString(); // Remaining characters are exactly the stable answer.
    }
}
```

Debug steps:

- print `c` and the current `stack` after each iteration to see every push and pop
- test `"abba"`, `"abbaca"`, and `"azxxzy"` to cover full cancellation and chain reactions
- verify the invariant that `stack` always represents the fully cleaned result for the prefix processed so far

---

## Stack Simulation Idea

Process characters left to right using stack behavior:

- if current char equals stack top, pop top and remove the pair
- otherwise push current char

A `StringBuilder` works well here because append and delete-at-end are efficient.
So we get stack behavior without needing to reverse a separate container at the end.

---

## Dry Run

Input: `"abbaca"`

1. read `a` -> stack becomes `"a"`
2. read `b` -> stack becomes `"ab"`
3. read `b` -> top is `b`, so remove the pair -> stack becomes `"a"`
4. read `a` -> top is `a`, so remove the pair -> stack becomes `""`
5. read `c` -> stack becomes `"c"`
6. read `a` -> top is `c`, so keep it -> stack becomes `"ca"`

Final answer: `"ca"`

The important observation is step 4:
removing `"bb"` exposes a new adjacent pair `"aa"`, and the same stack logic handles that automatically.

---

## Why One Pass Works

Each character does only one of two things:

- it gets appended once
- or it removes exactly one previous character and then disappears itself

So every character is pushed at most once and popped at most once.
That is why the total work is linear, even though the final effect looks like repeated cleanup.

Another useful way to think about it:
after processing `s[0..i]`, the stack already stores the fully reduced answer for that prefix.
So there is no need to rescan older characters again.

---

## Edge Cases

- empty string -> answer is empty
- one character -> answer is the same character
- full cancellation like `"aaaa"` -> answer becomes empty
- no duplicates like `"abcd"` -> answer stays unchanged

These cases are all handled naturally by the same loop.

---

## Common Mistakes

1. repeatedly calling `replace` or rebuilding strings in a loop, which can degrade toward `O(n^2)`
2. using immutable string concatenation inside the loop
3. forgetting that removals can trigger new adjacent pairs across the new boundary
4. using a stack but rebuilding the answer inefficiently at the end

---

## Related Extension: Remove Adjacent Duplicates in Groups of K

For the harder variant where you remove `k` equal adjacent characters, the stack idea still works.
The only change is that the stack stores `(character, count)` instead of just characters.

That is a strong sign that this problem belongs to the stack pattern family, not just a one-off trick.

---

## Complexity

- Time: `O(n)`
- Space: `O(n)`

---

## Key Takeaways

- adjacency plus rollback behavior usually hints at a stack
- `StringBuilder` can act as a very practical character stack in Java
- the core invariant is: the built stack is always the cleaned answer for the processed prefix
