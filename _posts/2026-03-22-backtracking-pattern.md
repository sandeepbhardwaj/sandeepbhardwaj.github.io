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
Master backtracking as DFS over a decision tree with pruning.
This pattern matters in interviews when the problem asks us to generate, explore, or validate many candidate states while keeping the current partial state correct.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| Backtracking | Generate all valid possibilities | Explore a state, recurse, then undo | Subsets |
| DFS + Pruning | Constraint-based search | Cut branches as soon as they cannot lead to a valid answer | Combination Sum |
| Used-State Search | Ordering matters | Track which choices are already taken in the current branch | Permutations |

---

## 🎯 Problem Statement

Use recursion to explore all valid combinations, permutations, or constraint-satisfying states while avoiding invalid or useless branches early.

Typical constraints to clarify before coding:

- are duplicates present in the input?
- can we reuse an element?
- are we generating all answers or just checking if one exists?
- what makes a branch impossible so we can prune it?

> [!NOTE]
> Before writing code, identify the state, the decision at each level, the stopping condition, and the rollback step.

---

## 🔍 Pattern Recognition Signals

Common signals:

- "generate all"
- "all combinations"
- "all permutations"
- "all possible ways"
- "choose k items"
- "constraint satisfaction"
- "place items without conflicts"

Observations that strongly suggest backtracking:

- the answer is built incrementally
- a partial choice may still become valid later
- invalid branches can be rejected early
- we need to try one option, then try a different sibling option

> [!IMPORTANT]
> If you see "explore all possibilities under constraints" -> think backtracking.

---

## 🧪 Example

Consider the classic subsets problem.

Input:

```text
nums = [1, 2]
```

Output:

```text
[[], [1], [1,2], [2]]
```

Step-by-step:

1. Start with an empty path `[]`. This is already one valid subset.
2. Choose `1`, so the path becomes `[1]`.
3. From `[1]`, choose `2`, so the path becomes `[1,2]`.
4. Roll back by removing `2`, so we return to `[1]`.
5. Roll back again by removing `1`, so we return to `[]`.
6. Now choose `2` directly from the root, giving `[2]`.

The important idea is that the same `path` object is reused, so every branch must leave the state exactly as it found it before returning.

---

## 🐢 Brute Force Approach

### Idea

Treat the problem as "generate everything first, then filter what is valid."

Examples:

- for subsets, try every include/exclude pattern
- for permutations, generate all orderings even if a branch is already impossible
- for combination problems, keep exploring even after the sum has already become invalid

### Complexity

Exponential in the number of choices:

- subsets: `O(2^n)`
- permutations: `O(n!)`
- constraint search: often exponential in branching factor and depth

> [!WARNING]
> Brute force becomes unusable when we fail to prune. The difference between accepted and timed-out solutions is often not the recursion itself, but whether we stop bad branches early.

---

## ⚡ Optimized Approach

### 💡 Key Insight

We do not need to materialize all possibilities blindly. We only need to explore states that are still capable of producing a valid answer.

### 🧠 Mental Model

Think of backtracking as walking a decision tree:

- each level asks, "What choice do we make next?"
- `path` stores the current partial answer
- recursion explores one child branch
- rollback restores the invariant before moving to the next child

Invariant:

- `path` always represents a valid partial state for the current recursion frame

### 🛠️ Steps

1. Define the current state: index, remaining target, used array, path, etc.
2. Define the base case: when do we record an answer or stop?
3. Try one choice.
4. Recurse deeper.
5. Undo the choice.
6. Move to the next sibling branch.

### 💻 Code (Java)

This subset-style template is the canonical pattern:

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

### ⏱️ Complexity

Still exponential in the worst case, but usually much better in practice once pruning removes useless branches.

> [!TIP]
> Interviewers care less about memorizing one template and more about whether you can explain the state, the invariant, and why rollback is necessary.

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

## 🎨 Visual Intuition

Decision tree for subsets of `[1,2]`:

```text
        []
      /    \
    [1]    []
   /   \   /  \
[1,2] [1] [2]  []
```

Dry run:

- start `[]`
  - include `1` -> `[1]`
    - include `2` -> `[1,2]`
    - exclude `2` -> `[1]`
  - exclude `1` -> `[]`
    - include `2` -> `[2]`
    - exclude `2` -> `[]`

Collected subsets: `[]`, `[1]`, `[1,2]`, `[2]`

This is why rollback is not optional. Sibling branches must see clean state.

---

## ⚠️ Common Mistakes

> [!CAUTION]
> The most common backtracking bugs are state bugs, not recursion bugs.

- forgetting the rollback step
- storing the live `path` instead of a copy
- using the wrong index movement for combinations vs permutations
- missing duplicate-skip logic when the input contains repeated values
- not pruning obviously impossible branches

---

## Pruning Heuristic

Before recursing, ask:

- can this branch still reach a valid answer?
- can the remaining choices still fill the required slots?
- has the constraint already been violated?

Examples:

- combination sum: stop when `remain < 0`
- fixed-length combinations: stop when remaining elements are insufficient
- N-Queens: stop when row/column/diagonal constraints fail immediately

Effective pruning does not change correctness. It changes how much useless work we avoid.

---

## 🔁 Pattern Variations

- subset-style: include/exclude decisions
- permutation-style: `used[]` decides whether a value is available
- combination-style: index controls reuse and ordering
- constraint-placement style: place queens, letters, digits, or partitions while maintaining validity

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
> Backtracking often appears as the search layer, while another idea decides how aggressively we can prune.

- backtracking + sorting -> duplicate handling becomes cleaner
- backtracking + pruning -> search stays feasible
- backtracking + hash set -> fast conflict checks
- backtracking + memoization -> useful when subproblems overlap

Examples:

- palindrome partitioning combines backtracking with substring validity checks
- word search combines backtracking with grid traversal state
- N-Queens combines backtracking with column and diagonal constraints

---

## 🧠 Key Takeaways

- backtracking is controlled brute-force with structure
- the real invariant is that the current state must always be valid for the current frame
- choose -> recurse -> unchoose is the pattern you must be able to explain out loud
- pruning is often the difference between a correct slow solution and an accepted interview solution

---

## 📌 Practice Problems

> [!TIP]
> Repeat these until you can identify the state, the branch choice, and the rollback step without hesitation.

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
