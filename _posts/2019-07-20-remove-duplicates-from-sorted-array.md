---
title: Remove Duplicates from Sorted Array in Java
date: '2019-07-20'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- two-pointers
- array
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove Duplicates from Sorted Array in Java (LeetCode 26)
seo_description: In-place two-pointer solution for sorted array deduplication.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This problem is not really about deleting anything.
It is about building a correct unique prefix at the front of the array and returning its length.

That mental shift is the whole pattern.
Once you see the array as "finalized prefix plus unexplored suffix," the implementation becomes a clean two-pointer compaction loop instead of index guesswork.

## Quick Summary

| Signal | What it tells you |
| --- | --- |
| input is sorted | duplicates appear in one contiguous block |
| output must be in place | we should overwrite the array instead of allocating another one |
| return value is a length | only the first `k` positions matter after processing |

The winning invariant is:
`nums[0..slow]` always contains the unique values seen so far, in sorted order.

## Problem Statement

Given a sorted array `nums`, remove duplicates in place so each distinct value appears only once, and return the number of unique elements.

The problem does not ask us to physically shrink the array.
It asks us to make the first `k` positions correct.

That is why this belongs in the fast/slow compaction family of two-pointer problems.

## Why Sorted Order Changes Everything

If the array were unsorted, duplicates could appear anywhere.
We would need a set, a map, or sorting first.

Sorted order gives us something much stronger:

- equal values appear next to each other
- the first time we see a new value, we know it belongs in the answer
- once we move past a block of duplicates, we never need to revisit it

That turns the problem into a one-pass rewrite:

1. keep one representative from each value block
2. copy it into the next available answer slot
3. ignore the extra copies

## Core Invariant

Use two pointers:

- `slow` points to the end of the finalized unique prefix
- `fast` scans the remaining input from left to right

At every step:

- `nums[0..slow]` is already the correct answer for everything processed so far
- `fast` is the next value we need to classify

If `nums[fast]` equals `nums[slow]`, it is a duplicate of the latest kept value.
If it differs, we have found the next unique value and should extend the prefix.

That is why the write happens at `++slow`.

## Java Solution

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        int slow = 0;

        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }

        return slow + 1;
    }
}
```

## Why This Works

Suppose `nums[0..slow]` is already a correct unique prefix.

When `nums[fast] == nums[slow]`:

- the value is already represented in the prefix
- writing it again would create a duplicate
- so we skip it

When `nums[fast] != nums[slow]`:

- sorted order guarantees this is the first occurrence of a new value
- the next answer slot is `slow + 1`
- writing there preserves sorted order and uniqueness

Every iteration either discards a duplicate or extends the answer prefix.
That is why the loop is linear and why no candidate is missed.

## Dry Run

Input:

```text
[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
```

Initial state:

- `slow = 0`
- unique prefix is `[0]`

Now scan with `fast`:

1. `fast = 1`, value `0`
   same as `nums[slow]`, so skip it
2. `fast = 2`, value `1`
   new value, move `slow` to `1`, write `nums[1] = 1`
3. `fast = 3`, value `1`
   duplicate, skip
4. `fast = 4`, value `1`
   duplicate, skip
5. `fast = 5`, value `2`
   new value, move `slow` to `2`, write `nums[2] = 2`
6. continue the same pattern for `3` and `4`

Final array prefix:

```text
[0, 1, 2, 3, 4]
```

Return value:

```text
5
```

## Visual Intuition

Think of the array as two zones:

```text
[ finalized unique prefix | unread suffix ]
          slow                  fast
```

`slow` is the write boundary of the answer.
`fast` is the reader.

That same idea appears in many array rewrite problems:

- remove duplicates
- remove element
- move zeroes
- keep at most two duplicates

If you learn the boundary correctly here, several interview questions become much easier.

## Common Mistakes

### Misunderstanding the Output

Only the first `k` positions matter after the function returns.
The rest of the array may still contain old values, and that is completely fine.

### Comparing Against the Wrong Index

The comparison should be against `nums[slow]`, which represents the last accepted unique value.
Comparing against `nums[fast - 1]` can blur the real invariant.

### Forgetting the Empty Array Case

If `nums.length == 0`, returning `slow + 1` would be wrong.
The early return is necessary.

### Treating It Like Deletion

No shifting is required.
We are overwriting selected positions, not removing elements one by one.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

Each element is examined once, and no auxiliary collection is needed.

## How This Pattern Generalizes

This exact solution solves the "keep one copy" version.
The same compaction idea extends naturally:

- keep values not equal to `target`
- keep nonzero values at the front
- keep at most two copies of each value

The interview habit to build is not just "I know LeetCode 26."
It is:
"I can maintain a write boundary for the valid prefix while another pointer reads the input."

That is a reusable skill.

## Final Takeaway

The sorted array is not giving you a shortcut.
It is giving you a proof.

Because equal values are grouped together, one reader pointer and one write boundary are enough to preserve exactly one copy of each value in a single pass with `O(1)` extra space.
