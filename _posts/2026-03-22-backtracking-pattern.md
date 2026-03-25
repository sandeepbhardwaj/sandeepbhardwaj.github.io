---
categories:
- DSA
- Java
date: 2026-03-22
seo_title: Backtracking Pattern in Java - Interview Preparation Guide
seo_description: Learn backtracking in Java with recursion templates for combinations,
  permutations, subsets, and constraint search.
tags:
- dsa
- java
- backtracking
- recursion
- algorithms
title: Backtracking Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/backtracking-banner.svg"
  overlay_filter: 0.35
  caption: Search Trees with Pruning
  show_overlay_excerpt: false
---
Master backtracking as DFS over a decision tree with pruning. Focus on state management, rollback discipline, and constraint-driven search.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| Backtracking | Generate all possibilities | Explore + undo decisions | Subsets |
| DFS + Pruning | Constraint-based search | Cut invalid branches early | Combination Sum |

---

## 🎯 Problem Statement

Explore all valid combinations/permutations under constraints using recursive decision trees.

> [!NOTE]
Understand constraints: duplicates, pruning opportunities, and search space size.

---

## 🔍 Pattern Recognition Signals

- "generate all"
- "combinations / permutations"
- "all possible ways"
- "constraint satisfaction"

> [!IMPORTANT]
If you see **explore all possibilities with constraints → think Backtracking**

---

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

What we are doing actually:

1. Add the current path as one valid partial answer.
2. Try each next choice.
3. Recurse deeper.
4. Roll back before trying the next sibling branch.

```java
public void dfs(int start, int[] nums, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<>(path)); // Snapshot current path before branching further.

    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]); // Choose.
        dfs(i + 1, nums, path, ans); // Explore.
        path.remove(path.size() - 1); // Unchoose.
    }
}
```

Debug steps:

- print `path` before choose, after choose, and after rollback
- verify the copied list goes into `ans`, not the live `path`
- test with `[1,2]` so the recursion tree is easy to inspect

---

## Problem 1: Subsets

Problem description:
Return all subsets of the given array.

What we are doing actually:

1. At each index, choose whether to include the current element.
2. Recurse into the include branch.
3. Roll back and recurse into the exclude branch.

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), ans);
    return ans;
}

private void backtrack(int idx, int[] nums, List<Integer> path, List<List<Integer>> ans) {
    if (idx == nums.length) {
        ans.add(new ArrayList<>(path)); // One complete subset.
        return;
    }
    path.add(nums[idx]); // Include current value.
    backtrack(idx + 1, nums, path, ans);
    path.remove(path.size() - 1); // Roll back before exclude branch.

    backtrack(idx + 1, nums, path, ans); // Exclude current value.
}
```

Debug steps:

- print `idx` and `path` at each recursive entry
- verify rollback happens before the exclude branch
- compare the recursion tree against the dry run for `[1,2]`

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

Problem description:
Return all possible orderings of the given numbers.

What we are doing actually:

1. Build the permutation one position at a time.
2. Skip values already used in the current path.
3. After recursion, unmark the value so another branch can use it.

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    dfs(nums, used, new ArrayList<>(), ans);
    return ans;
}

private void dfs(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
        ans.add(new ArrayList<>(path)); // One complete ordering.
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; // Reserve this number for current permutation.
        path.add(nums[i]);
        dfs(nums, used, path, ans);
        path.remove(path.size() - 1); // Roll back path.
        used[i] = false; // Make number available again.
    }
}
```

Debug steps:

- print `path` and `used` at each depth
- verify every `used[i] = true` has a matching rollback to `false`
- test `[1,2,3]` and count that the answer size becomes `6`

---

## Problem 3: Combination Sum

Problem description:
Find all combinations whose sum equals the target, where each candidate can be reused.

What we are doing actually:

1. At each index, decide whether to take the current candidate.
2. If we take it, stay on the same index because reuse is allowed.
3. If we skip it, move to the next index.
4. Prune immediately when the remaining sum goes negative.

```java
public List<List<Integer>> combinationSum(int[] c, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    dfs(0, target, c, new ArrayList<>(), ans);
    return ans;
}

private void dfs(int i, int remain, int[] c, List<Integer> path, List<List<Integer>> ans) {
    if (remain == 0) {
        ans.add(new ArrayList<>(path)); // Found one valid combination.
        return;
    }
    if (remain < 0 || i == c.length) return;

    path.add(c[i]); // Take current candidate.
    dfs(i, remain - c[i], c, path, ans); // Stay on same index because reuse is allowed.
    path.remove(path.size() - 1); // Roll back take branch.

    dfs(i + 1, remain, c, path, ans); // Skip current candidate.
}
```

Debug steps:

- print `i`, `remain`, and `path` on each recursive call
- verify negative `remain` branches stop immediately
- test one case where reuse is essential, like candidates `[2,3,6,7]`, target `7`

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

---

## 🐢 Brute Force Approach

### Idea  
Generate all possible combinations without pruning  

### Complexity  
Exponential: O(2^N, N!, etc.)

> [!WARNING]
Huge search space → TLE without pruning

---

## ⚡ Optimized Approach

### 💡 Key Insight  
Prune invalid branches early  

### 🧠 Mental Model  
Invariant:
- `path` always represents a valid partial solution  

### 🛠️ Steps  
1. Choose  
2. Recurse  
3. Undo (rollback)  

### ⏱️ Complexity  
Still exponential but significantly reduced with pruning  

> [!TIP]
Efficiency depends on pruning strength

---

## 🎨 Visual Intuition

Decision tree (Subsets):
```text
        []
      /    \
    [1]    []
   /   \   /  \
[1,2] [1] [2]  []

Each branch = decision (include/exclude)
```
---

## ⚠️ Common Mistakes

> [!CAUTION]
- Forgetting rollback  
- Not copying path  
- Missing pruning  
- Incorrect duplicate handling  

---

## 🔁 Pattern Variations

- Subset-style (include/exclude)  
- Permutation-style (used array)  
- Combination-style (index control)  

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
- Backtracking + sorting → duplicate handling  
- Backtracking + pruning → optimization  
- Backtracking + memoization → hybrid DP  

---

## 🧠 Key Takeaways

- Backtracking = DFS + rollback  
- Always maintain valid state  
- Pruning is the difference between TLE and AC  

---

## 📌 Practice Problems

> [!TIP]
Repeat until pattern becomes intuitive

1. Subsets (LC 78)  
   https://leetcode.com/problems/subsets/
2. Permutations (LC 46)  
   https://leetcode.com/problems/permutations/
3. Combination Sum (LC 39)  
   https://leetcode.com/problems/combination-sum/
4. Palindrome Partitioning (LC 131)  
   https://leetcode.com/problems/palindrome-partitioning/
5. N-Queens (LC 51)  
   https://leetcode.com/problems/n-queens/
6. Word Search (LC 79)  
   https://leetcode.com/problems/word-search/
