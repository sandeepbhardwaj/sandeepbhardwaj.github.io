---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-15
seo_title: HashMap and HashSet Frequency Pattern in Java – Complete Guide
seo_description: Learn HashMap and HashSet frequency patterns in Java with counting, lookup, and linear-time matching examples.
tags:
- dsa
- java
- hashmap
- hashset
- frequency-pattern
- algorithms
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/hashmap-hashset-frequency-pattern/
title: HashMap and HashSet Frequency Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/hashmap-hashset-banner.svg
  overlay_filter: 0.35
  caption: "Constant-Time Lookups for Linear-Time Solutions"
  show_overlay_excerpt: false
---

# HashMap and HashSet Frequency Pattern in Java — A Detailed Guide

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

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> index = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (index.containsKey(need)) {
            return new int[]{index.get(need), i};
        }
        index.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
```

Time: `O(n)`  
Space: `O(n)`

---

## Problem 2: Valid Anagram

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int x : count) {
        if (x != 0) return false;
    }
    return true;
}
```

---

## Problem 3: Longest Consecutive Sequence

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);

    int best = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) { // start of sequence
            int curr = x;
            int len = 1;
            while (set.contains(curr + 1)) {
                curr++;
                len++;
            }
            best = Math.max(best, len);
        }
    }
    return best;
}
```

---

## Problem 4: Group Anagrams

```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();

    for (String s : strs) {
        char[] arr = s.toCharArray();
        Arrays.sort(arr);
        String key = new String(arr);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }

    return new ArrayList<>(groups.values());
}
```

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
