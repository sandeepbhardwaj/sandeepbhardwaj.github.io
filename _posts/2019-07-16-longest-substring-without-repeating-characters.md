---
title: Longest Substring Without Repeating Characters in Java
date: '2019-07-16'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- sliding-window
- strings
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Longest Substring Without Repeating Characters in Java
seo_description: Sliding window solution with hashmap for LeetCode 3 in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the most important sliding-window problems.
The goal is not to generate every substring, but to maintain one valid window whose characters are all unique.

---

## Problem 1: Longest Substring Without Repeating Characters

Problem description:
Given a string `s`, return the length of the longest substring that contains no repeated characters.

What we are solving actually:
Brute force checks every possible substring and then tests whether it has duplicates, which is too expensive. The real idea is to keep one moving window that is always valid and repair it only when the newest character creates a repeat.

What we are doing actually:

1. Expand the window with pointer `right`.
2. Track the last seen index of each character.
3. If the current character was already seen inside the current window, move `left` just past that old position.
4. Update the best window length after each step.

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            if (lastSeen.containsKey(c)) {
                // Never move left backward; only shrink the window if the repeated
                // character is still inside the current valid window.
                left = Math.max(left, lastSeen.get(c) + 1);
            }

            lastSeen.put(c, right); // Record the newest position of this character.
            best = Math.max(best, right - left + 1); // Current window [left..right] is valid.
        }

        return best;
    }
}
```

Debug steps:

- print `left`, `right`, current character, and current window length after each iteration
- test `"abcabcbb"`, `"bbbbb"`, and `"abba"` because `"abba"` catches the left-moves-backward bug
- verify the invariant that substring `s[left..right]` never contains duplicate characters

---

## Sliding Window Idea

The window is:

- `left` = start of the current valid substring
- `right` = end of the current valid substring

As `right` moves, the window grows.
If a repeat appears, we do not restart from scratch.
We move `left` only as far as needed to restore the no-duplicate condition.

That is why this problem is a classic example of "expand, then repair" sliding-window logic.

---

## Dry Run

Input: `"abcabcbb"`

1. `right=0`, char=`a`
   window = `"a"`, best = `1`

2. `right=1`, char=`b`
   window = `"ab"`, best = `2`

3. `right=2`, char=`c`
   window = `"abc"`, best = `3`

4. `right=3`, char=`a`
   previous `a` was at index `0`
   move `left` to `1`
   window = `"bca"`, best stays `3`

5. continue the same way

Final answer: `3`

The algorithm does not rebuild substrings.
It only updates boundaries and the last seen positions.

---

## Why `Math.max(left, lastSeen + 1)` Is Required

This line prevents a subtle bug.

Consider `"abba"`:

- after reading the second `b`, `left` moves to index `2`
- when reading the final `a`, the old `a` was at index `0`

If we wrote:

- `left = lastSeen.get(c) + 1`

then `left` would move backward to `1`, which would make the window invalid again.

`Math.max` ensures `left` only moves forward.

---

## ASCII Optimization Variant

If the input is guaranteed to be ASCII, an array can replace the map:

```java
int[] last = new int[128];
Arrays.fill(last, -1);
```

That keeps the same algorithm and complexity, but improves constants.
The `HashMap` version is usually easier to explain because it works for general character sets too.

---

## Common Mistakes

1. moving `left` backward by skipping `Math.max`
2. forgetting to update the latest index of the current character
3. reconstructing substrings each step and accidentally adding extra `O(n)` work
4. confusing substring with subsequence

---

## Boundary Cases

- empty string -> answer `0`
- all unique characters -> answer is full length
- all same characters -> answer `1`
- repeated blocks like `"abcabcbb"` -> answer comes from maintaining the best repaired window

---

## Complexity

- Time: `O(n)`
- Space: `O(min(n, charset))`

---

## Key Takeaways

- this is a sliding-window problem with a "last seen index" map
- the key invariant is that the current window is always duplicate-free
- `left` must move only forward, never backward
