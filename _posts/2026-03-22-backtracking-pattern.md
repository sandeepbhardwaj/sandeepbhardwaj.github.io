---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-22
seo_title: Backtracking Pattern in Java – Complete Guide
seo_description: Learn backtracking in Java with recursion templates for combinations, permutations, subsets, and constraint search.
tags:
- dsa
- java
- backtracking
- recursion
- algorithms
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/backtracking-pattern/
title: Backtracking Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/backtracking-banner.svg
  overlay_filter: 0.35
  caption: "Search Trees with Pruning"
  show_overlay_excerpt: false
---

# Backtracking Pattern in Java — A Detailed Guide

Backtracking is DFS over a decision tree with undo steps.
It is the default strategy for exhaustive search with constraints.

---

## Core Idea

At each step:

1. choose
2. recurse
3. unchoose (rollback)

---

## Template: Subset-Style Backtracking

```java
public void dfs(int start, int[] nums, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<>(path));

    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        dfs(i + 1, nums, path, ans);
        path.remove(path.size() - 1);
    }
}
```

---

## Problem 1: Subsets

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), ans);
    return ans;
}

private void backtrack(int idx, int[] nums, List<Integer> path, List<List<Integer>> ans) {
    if (idx == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    path.add(nums[idx]);
    backtrack(idx + 1, nums, path, ans);
    path.remove(path.size() - 1);

    backtrack(idx + 1, nums, path, ans);
}
```

---

## Dry Run (Subsets of `[1,2]`)

Decision tree:

- start `[]`
  - include `1` -> `[1]`
    - include `2` -> `[1,2]`
    - exclude `2` -> `[1]`
  - exclude `1` -> `[]`
    - include `2` -> `[2]`
    - exclude `2` -> `[]`

Collected subsets: `[]`, `[1]`, `[1,2]`, `[2]`

This shows why every level must rollback before exploring sibling branches.

---

## Problem 2: Permutations

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    dfs(nums, used, new ArrayList<>(), ans);
    return ans;
}

private void dfs(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        dfs(nums, used, path, ans);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}
```

---

## Problem 3: Combination Sum

```java
public List<List<Integer>> combinationSum(int[] c, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    dfs(0, target, c, new ArrayList<>(), ans);
    return ans;
}

private void dfs(int i, int remain, int[] c, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) {
        ans.add(new ArrayList<>(path));
        return;
    }
    if (remain < 0 || i == c.length) return;

    path.add(c[i]);
    dfs(i, remain - c[i], c, path, ans);
    path.remove(path.size() - 1);

    dfs(i + 1, remain, c, path, ans);
}
```

---

## Common Mistakes

1. Forgetting rollback step
2. Reusing mutable path without copying
3. Missing duplicate-skip logic in duplicate-input problems
4. No pruning where obvious bounds exist

---

## Pruning Heuristic

Before recursing, ask: “Can this branch still reach a valid solution?”

Examples:

- combination sum: stop when `remain < 0`
- fixed-length combinations: stop when remaining elements are insufficient
- N-Queens: stop when row/diag constraints fail immediately

Effective pruning reduces exponential search significantly in practice.

---

## Practice Set (Recommended Order)

1. Subsets (LC 78)  
   [LeetCode](https://leetcode.com/problems/subsets/)
2. Permutations (LC 46)  
   [LeetCode](https://leetcode.com/problems/permutations/)
3. Combination Sum (LC 39)  
   [LeetCode](https://leetcode.com/problems/combination-sum/)
4. Palindrome Partitioning (LC 131)  
   [LeetCode](https://leetcode.com/problems/palindrome-partitioning/)
5. N-Queens (LC 51)  
   [LeetCode](https://leetcode.com/problems/n-queens/)
6. Word Search (LC 79)  
   [LeetCode](https://leetcode.com/problems/word-search/)

---

## Key Takeaways

- Backtracking is controlled brute-force with pruning.
- Correct choose-recurse-unchoose discipline is mandatory.
- Performance depends heavily on pruning and duplicate handling.
