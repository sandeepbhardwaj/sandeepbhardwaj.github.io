---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-15
seo_title: HashMap and HashSet Frequency Pattern in Java – Complete Guide
seo_description: Learn HashMap and HashSet frequency patterns in Java with counting,
  lookup, and linear-time matching examples.
tags:
- dsa
- java
- hashmap
- hashset
- frequency-pattern
- algorithms
title: HashMap and HashSet Frequency Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/hashmap-hashset-banner.svg"
  overlay_filter: 0.35
  caption: Constant-Time Lookups for Linear-Time Solutions
  show_overlay_excerpt: false
---
Hash-based patterns are the default when you need fast membership checks, counts, or complement lookups.
This pattern often converts nested-loop logic into linear-time solutions.

---

## Why This Pattern Matters

Use it when problems ask for:

- duplicates / uniqueness
- frequency counts
- pair complements
- grouping by key

`HashSet` gives near `O(1)` membership checks.  
`HashMap` gives near `O(1)` key-value updates and lookups.

---

## Template 1: Frequency Counter

```java
public Map<Character, Integer> buildFrequency(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }
    return freq;
}
```

---

## Template 2: Seen Set

```java
public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;
    }
    return false;
}
```

---

## Problem 1: Two Sum

Problem description:
Given an array and a target, return indices of two numbers whose sum equals the target.

What we are doing actually:

1. Scan the array once from left to right.
2. For each number, compute the complement we still need.
3. Check whether that complement was seen earlier.
4. If not, store the current value and index for future elements.

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> index = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i]; // Value required to complete the target sum.
        if (index.containsKey(need)) {
            return new int[]{index.get(need), i}; // Earlier value + current value = target.
        }
        index.put(nums[i], i); // Save current value for later complements.
    }
    return new int[]{-1, -1};
}
```

Time: `O(n)`  
Space: `O(n)`

Debug steps:

- print `i`, `nums[i]`, `need`, and current `index` map
- verify you check the map before inserting the current element
- test duplicates like `[3,3]` with target `6`

---

## Problem 2: Valid Anagram

Problem description:
Given two strings, decide whether one is an anagram of the other.

What we are doing actually:

1. Reject immediately if lengths differ.
2. Use one counting array to add letters from the first string and subtract letters from the second.
3. If all counters end at zero, the strings contain the same characters in different order.

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++; // Character contributed by s.
        count[t.charAt(i) - 'a']--; // Matching character removed by t.
    }
    for (int x : count) {
        if (x != 0) return false;
    }
    return true;
}
```

Debug steps:

- print the `count` array after processing both strings
- test same letters in different order and different lengths
- verify this exact version assumes lowercase English letters

---

## Problem 3: Longest Consecutive Sequence

Problem description:
Given an unsorted array, return the length of the longest sequence of consecutive integers.

What we are doing actually:

1. Put all numbers into a set for constant-time lookup.
2. Start growing a sequence only from numbers that have no predecessor.
3. Expand forward until the sequence ends, then update the best length.

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);

    int best = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) { // Real sequence start because x - 1 does not exist.
            int curr = x;
            int len = 1;
            while (set.contains(curr + 1)) {
                curr++; // Extend the current consecutive run.
                len++;
            }
            best = Math.max(best, len);
        }
    }
    return best;
}
```

Debug steps:

- print every value that is treated as a sequence start
- trace `curr` and `len` while the inner loop grows a run
- test duplicates and negative numbers to confirm the set logic still works

---

## Problem 4: Group Anagrams

Problem description:
Given a list of strings, group together words that are anagrams of each other.

What we are doing actually:

1. Convert each word into a canonical key.
2. Use that key in a map to collect all matching words.
3. Return all map values as the grouped result.

```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();

    for (String s : strs) {
        char[] arr = s.toCharArray();
        Arrays.sort(arr); // Sorted characters form the canonical anagram signature.
        String key = new String(arr);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }

    return new ArrayList<>(groups.values());
}
```

Debug steps:

- print each original word and its computed `key`
- verify different words with the same sorted key land in the same bucket
- remember `HashMap` output order is not stable, so sort before asserting in tests

---

## API Tips: `merge` and `computeIfAbsent`

These APIs reduce boilerplate and edge bugs:

```java
freq.merge(c, 1, Integer::sum);
groups.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
```

Prefer them over repeated `containsKey` checks when possible.

---

## Determinism Note for Tests

`HashMap`/`HashSet` iteration order is not guaranteed.
If test output comparison depends on order:

- sort inner/outer collections before assert, or
- use `LinkedHashMap` when insertion order matters by design

This avoids flaky tests and hidden order coupling.

---

## Common Mistakes

1. Using mutable objects as map keys without stable `equals/hashCode`
2. Forgetting collision-safe key design for grouping problems
3. Assuming insertion order in `HashMap`/`HashSet`
4. Not handling null/empty edge cases

---

## Practice Set (Recommended Order)

1. Contains Duplicate (LC 217)  
   [LeetCode](https://leetcode.com/problems/contains-duplicate/)
2. Two Sum (LC 1)  
   [LeetCode](https://leetcode.com/problems/two-sum/)
3. Valid Anagram (LC 242)  
   [LeetCode](https://leetcode.com/problems/valid-anagram/)
4. Group Anagrams (LC 49)  
   [LeetCode](https://leetcode.com/problems/group-anagrams/)
5. Longest Consecutive Sequence (LC 128)  
   [LeetCode](https://leetcode.com/problems/longest-consecutive-sequence/)
6. Top K Frequent Elements (LC 347)  
   [LeetCode](https://leetcode.com/problems/top-k-frequent-elements/)

---

## Key Takeaways

- Hash patterns are first choice for lookup-heavy problems.
- Frequency maps and seen sets remove nested scans.
- Correct key design is the difference between right and wrong solutions.
