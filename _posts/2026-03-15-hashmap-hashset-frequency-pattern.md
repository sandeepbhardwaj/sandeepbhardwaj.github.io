---
categories:
- DSA
- Java
date: 2026-03-15
seo_title: HashMap and HashSet Frequency Pattern in Java - Interview Preparation Guide
seo_description: Learn HashMap and HashSet frequency patterns in Java with counting,
  lookup, and linear-time matching examples.
tags:
- dsa
- java
- hashmap
- hashset
- frequency-pattern
- algorithms
title: HashMap and HashSet Frequency Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/hashmap-hashset-banner.svg"
  overlay_filter: 0.35
  caption: Constant-Time Lookups for Linear-Time Solutions
  show_overlay_excerpt: false
---

## HashMap and HashSet Frequency Pattern in Java

The HashMap/HashSet frequency pattern is one of the most important interview patterns because it converts repeated searching into constant-time lookup. It appears whenever a problem asks you to count occurrences, detect duplicates, find complements, or group items by a derived key.

In interviews, this pattern often turns an obvious `O(n²)` solution into an `O(n)` or `O(n log n)` solution. More importantly, it helps you explain *why* your solution is efficient: we avoid re-scanning previously seen data by storing the right information as we iterate.

---

## 🚀 Pattern Summary Table

| Pattern Name | When to Use | Key Idea | Example |
|---|---|---|---|
| Frequency Map | When counts matter | Store occurrence counts by key | Valid Anagram, Top K Frequent Elements |
| Seen Set | When uniqueness or prior existence matters | Track visited values for near `O(1)` membership checks | Contains Duplicate |
| Complement Lookup | When current value depends on a previously seen matching value | Store values seen so far and look up the missing partner | Two Sum |
| Canonical Grouping | When items belong together based on normalized structure | Convert each item into a stable key, then group by that key | Group Anagrams |
| Sequence Expansion with Set | When consecutive or chain-like membership must be checked repeatedly | Put all values in a set, then expand only from valid starts | Longest Consecutive Sequence |

---

## 🎯 Problem Statement

Hash-based patterns solve a family of problems where we need to efficiently answer one of these questions while iterating through data:

- Have we seen this value before?
- How many times has this value appeared?
- Is the matching/complement value already available?
- Which bucket/group should this item belong to?
- Does the next value in a logical sequence exist?

Typical tasks include:

- duplicates / uniqueness
- frequency counts
- pair complements
- grouping by key
- consecutive membership checks

`HashSet` gives near `O(1)` membership checks.  
`HashMap` gives near `O(1)` key-value updates and lookups.

> [!NOTE]
> Before coding, inspect the constraints. If input size is large—often `10^5` or more—an `O(n²)` nested-loop approach usually will not pass. That is your signal to look for a stored-lookup strategy such as `HashMap` or `HashSet`.

**Typical constraints you should keep in mind:**

- Array/string length may be up to `10^5` or `10^6`
- Values may be negative, repeated, or unordered
- Output order may or may not matter
- Duplicate handling often changes the correct logic

---

## 🔍 How to Recognize This Pattern

You should strongly consider `HashMap` or `HashSet` when the problem includes one or more of the following signals.

### Keywords in the Problem

- duplicate
- unique / distinct
- frequency / count
- pair sum / complement
- anagram
- grouping
- first repeated / first unique
- consecutive
- lookup / contains

### Constraint Signals

- Input is too large for pairwise comparison
- We need better than `O(n²)`
- We repeatedly need to answer: “Have we seen this before?”
- The problem asks for fast existence checks or count updates

### Core Observations

- A lot of brute-force solutions re-check the same information
- Hashing works when the answer depends on remembering prior elements
- The main design question is not whether to use hashing, but **what exactly to store**
  - the raw value
  - the frequency
  - the index
  - a normalized key
  - a presence marker

> [!IMPORTANT]
> If you see **counting, membership, complement search, or grouping by identity**, think of this pattern immediately. In interviews, the strongest signal is: “I keep needing information about values I already processed.”

---

## 🧪 Example

Consider the classic **Two Sum** problem.

**Input:** `nums = [2, 7, 11, 15]`, `target = 9`  
**Output:** `[0, 1]`

### Explanation

We scan from left to right:

- At index `0`, value is `2`
  - Needed complement = `9 - 2 = 7`
  - `7` has not been seen yet
  - Store `2 -> 0`
- At index `1`, value is `7`
  - Needed complement = `9 - 7 = 2`
  - `2` is already in the map at index `0`
  - So indices `[0, 1]` form the answer

The important insight is that we do **not** search the rest of the array for the complement.  
We only ask whether the complement has already been seen.

---

## 🐢 Brute Force Approach

### Idea

For many problems in this family, the brute-force approach compares each element against many others.

For example, in **Two Sum**, we try every pair:

- check `(i, j)` for all `i < j`
- if `nums[i] + nums[j] == target`, return the indices

### Why It Feels Natural

This is usually the first correct thought because it directly models the problem. The issue is not correctness. The issue is repeated work.

### Complexity

- Time: `O(n²)`
- Space: `O(1)` (excluding output)

> [!WARNING]
> This approach becomes inefficient because it repeatedly scans data that could have been remembered. In hash-based problems, brute force usually fails because of redundant comparisons or repeated membership checks.

### Why It Fails

- Duplicate checks compare many unnecessary pairs
- Complement search redoes work at every index
- Grouping problems repeatedly compare strings or arrays
- Sequence problems repeatedly test the same chain starts

The optimization idea is simple: **store useful information once, then reuse it in constant time**.

---

## ⚡ Optimized Approach

### 💡 Key Insight

Instead of recomputing or re-scanning, we maintain a hash-based structure that gives near `O(1)` lookup for the exact information we need: frequency, existence, prior index, or grouping bucket.

### 🧠 Mental Model

We maintain an invariant: **after processing the first `i` elements, our map/set contains exactly the information needed to answer questions about everything seen so far.**

Or more simply:

> We optimize by turning “search again” into “look it up.”

### 🛠️ General Steps

1. Decide what information should be stored
   - seen values
   - counts
   - indices
   - canonical grouping keys
2. Iterate through the input once
3. Query the hash structure before or after update, depending on the problem
4. Update the structure so future elements can benefit from current work
5. Return the accumulated answer

### 💻 Core Java Templates

#### Template 1: Frequency Counter

```java
public Map<Character, Integer> buildFrequency(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }
    return freq;
}
```

#### Why this works

Each character becomes a key, and the map stores how many times it has appeared.  
This is the standard template for problems involving:

- anagrams
- majority/frequency
- counting duplicates
- histogram-style preprocessing

---

#### Template 2: Seen Set

```java
public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;
    }
    return false;
}
```

#### Why this works

`HashSet.add(x)` returns `false` if `x` already exists.  
That lets us detect duplicates in a single pass without separate membership and insertion code.

### ⏱️ Complexity

For most of these hash-based solutions:

- Time: `O(n)` average
- Space: `O(n)`

> [!TIP]
> This is usually optimal for interview settings because every value must be read at least once, which already gives a lower bound of `O(n)` time.

---

## Problem 1: Two Sum

### Problem Statement

Given an array and a target, return indices of two numbers whose sum equals the target.

### How to Recognize the Pattern

Signals:

- asks for a pair satisfying a relation
- obvious brute force is nested loops
- each current number naturally defines a missing complement

This is a **complement lookup** problem.

> [!IMPORTANT]
> If a problem says “find two values that combine to make a target,” think: “Can I store previously seen values and look up the complement?”

### Example

**Input:** `nums = [2, 7, 11, 15]`, `target = 9`  
**Output:** `[0, 1]`

Explanation:

- `2` needs `7`
- when we reach `7`, its needed complement `2` is already stored

### Brute Force

Check every pair `(i, j)`:

```java
public int[] twoSumBruteForce(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{-1, -1};
}
```

- Time: `O(n²)`
- Space: `O(1)`

> [!WARNING]
> This fails to scale because each element is compared with many others, even though we only need one matching complement.

### Optimized Approach

#### 💡 Key Insight

For each number `x`, compute `target - x`. If that complement has already been seen, we are done.

#### 🧠 Mental Model

We maintain a map from value to index for everything left of the current position.  
That means the current element only needs a constant-time lookup to know whether its partner already exists.

#### 🛠️ Steps

1. Create a map from value to index
2. Iterate from left to right
3. For each value, compute `need = target - nums[i]`
4. If `need` exists in the map, return the stored index and current index
5. Otherwise, store the current value and index

#### 💻 Code (Java)

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

#### ⏱️ Complexity

- Time: `O(n)` average
- Space: `O(n)`

> [!TIP]
> This is optimal because each element is processed once and each lookup/update is near constant time.

### 🎨 Visual Intuition

```text
nums   = [2, 7, 11, 15]
target = 9

i = 0, nums[i] = 2, need = 7
map = {2: 0}

i = 1, nums[i] = 7, need = 2
map contains 2 -> answer = [0, 1]
```

### ⚠️ Common Mistakes

- Inserting before checking, which can break cases where the same value is reused incorrectly
- Mishandling duplicates
- Forgetting that the problem asks for indices, not values

> [!CAUTION]
> Always verify the order of operations. For complement problems like Two Sum, **check first, then insert**. This is what makes `[3, 3]` with target `6` work correctly.

### Debug Steps

- print `i`, `nums[i]`, `need`, and current `index` map
- verify you check the map before inserting the current element
- test duplicates like `[3,3]` with target `6`

### Pattern Variations

- Two Sum II
- Two Sum in a data stream
- Pair difference / pair product variants

### Pattern Composition

- Combine with sorting + two pointers when output values matter more than original indices
- Combine with prefix sum + hashmap for subarray sum problems

---

## Problem 2: Valid Anagram

### Problem Statement

Given two strings, decide whether one is an anagram of the other.

### How to Recognize the Pattern

Signals:

- asks whether two collections contain the same elements with the same counts
- order does not matter
- frequency matters

This is a **frequency counting** problem.

> [!IMPORTANT]
> If order is irrelevant but counts must match exactly, think frequency map or counting array.

### Example

**Input:** `s = "anagram"`, `t = "nagaram"`  
**Output:** `true`

Explanation:

Both strings contain the same letters with the same multiplicity.

### Brute Force

One brute-force path is:

1. Sort both strings
2. Compare the results

This is correct, but not the most direct frequency-based interpretation.

```java
public boolean isAnagramBySorting(String s, String t) {
    if (s.length() != t.length()) return false;
    char[] a = s.toCharArray();
    char[] b = t.toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
}
```

- Time: `O(n log n)`
- Space: depends on implementation, often `O(n)`

> [!WARNING]
> Sorting works, but it is slower than necessary when the problem is fundamentally about matching counts.

### Optimized Approach

#### 💡 Key Insight

Increase counts for characters in `s` and decrease counts for characters in `t`.  
If both strings are anagrams, every final count must be zero.

#### 🧠 Mental Model

We maintain a balance sheet of character frequencies.  
The first string deposits counts; the second string withdraws them.

#### 🛠️ Steps

1. If lengths differ, return `false`
2. Create a count structure
3. Traverse both strings in one loop
4. Increment for `s[i]`, decrement for `t[i]`
5. Verify all counts end at zero

#### 💻 Code (Java)

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

#### ⏱️ Complexity

- Time: `O(n)`
- Space: `O(1)` because the array size is fixed at 26

> [!TIP]
> When the alphabet is fixed and small, a counting array is often better than a `HashMap` because it is simpler and more memory efficient.

### 🎨 Visual Intuition

```text
s = "abca"
t = "caba"

count after processing s:
a: 2, b: 1, c: 1

count after processing t in same loop:
a: 0, b: 0, c: 0
```

### ⚠️ Common Mistakes

- Forgetting to check equal length first
- Using this exact version for Unicode or mixed-case strings without adjusting the logic
- Mixing up increment/decrement directions

> [!CAUTION]
> This exact implementation assumes lowercase English letters. If the character set is broader, use a `HashMap<Character, Integer>` instead.

### Debug Steps

- print the `count` array after processing both strings
- test same letters in different order and different lengths
- verify this exact version assumes lowercase English letters

### Pattern Variations

- Find all anagrams in a string
- Group Anagrams
- Compare multisets instead of strings

### Pattern Composition

- Combine with sliding window for substring-anagram problems

---

## Problem 3: Longest Consecutive Sequence

### Problem Statement

Given an unsorted array, return the length of the longest sequence of consecutive integers.

### How to Recognize the Pattern

Signals:

- unordered input
- repeated need to test whether adjacent numeric values exist
- sequence length matters, not element order in original array

This is a **set membership with smart start detection** problem.

> [!IMPORTANT]
> If the task is to repeatedly ask “does `x + 1` exist?” or “does `x - 1` exist?”, a `HashSet` is usually the right structure.

### Example

**Input:** `nums = [100, 4, 200, 1, 3, 2]`  
**Output:** `4`

Explanation:

The longest consecutive run is `[1, 2, 3, 4]`, so the answer is `4`.

### Brute Force

One brute-force idea is:

- for each number, keep checking whether the next number exists by scanning the array

This leads to repeated linear searches.

```java
public int longestConsecutiveBruteForce(int[] nums) {
    int best = 0;
    for (int x : nums) {
        int curr = x;
        int len = 1;
        while (contains(nums, curr + 1)) {
            curr++;
            len++;
        }
        best = Math.max(best, len);
    }
    return best;
}

private boolean contains(int[] nums, int target) {
    for (int x : nums) {
        if (x == target) return true;
    }
    return false;
}
```

- Time: `O(n²)` in the worst case
- Space: `O(1)`

> [!WARNING]
> This is inefficient because membership testing is repeated over and over using linear scans.

### Optimized Approach

#### 💡 Key Insight

Put all values in a set. Then only start building a sequence from numbers that do **not** have a predecessor.

#### 🧠 Mental Model

A number is a true sequence start only if `x - 1` is missing.  
That prevents us from re-growing the same sequence from the middle.

#### 🛠️ Steps

1. Add all numbers to a set
2. Iterate through the set
3. For each number `x`, check whether `x - 1` is missing
4. If so, start extending from `x`
5. Update the best length seen

#### 💻 Code (Java)

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

#### ⏱️ Complexity

- Time: `O(n)` average
- Space: `O(n)`

> [!TIP]
> The “start only when no predecessor exists” trick is what keeps the solution linear. Without it, you may repeatedly expand the same sequence.

### 🎨 Visual Intuition

```text
set = {100, 4, 200, 1, 3, 2}

100 -> no 99, start -> length 1
4   -> has 3, not a start
200 -> no 199, start -> length 1
1   -> no 0, start -> 1 -> 2 -> 3 -> 4, length 4
```

### ⚠️ Common Mistakes

- Growing sequences from every number
- Forgetting that duplicates are naturally removed by the set
- Missing negative values in testing

> [!CAUTION]
> If you do not check for sequence starts first, the algorithm may still be correct but becomes unnecessarily repetitive and harder to reason about.

### Debug Steps

- print every value that is treated as a sequence start
- trace `curr` and `len` while the inner loop grows a run
- test duplicates and negative numbers to confirm the set logic still works

### Pattern Variations

- Count sequence ranges
- Detect longest arithmetic-like chains with a different structure
- Merge intervals after hashing starts/ends

### Pattern Composition

- Combine with union-find in advanced connectivity-style variants

---

## Problem 4: Group Anagrams

### Problem Statement

Given a list of strings, group together words that are anagrams of each other.

### How to Recognize the Pattern

Signals:

- output is grouped buckets
- items are equivalent under a normalized form
- “same letters, different order” strongly suggests a canonical key

This is a **hash-based grouping** problem.

> [!IMPORTANT]
> When multiple items should collapse into the same bucket, the key question is: “What is the stable representation that makes equivalent items identical?”

### Example

**Input:** `["eat", "tea", "tan", "ate", "nat", "bat"]`  
**Output:** `[["eat","tea","ate"], ["tan","nat"], ["bat"]]`  
(Order may vary.)

Explanation:

- `"eat"`, `"tea"`, and `"ate"` all sort to `"aet"`
- `"tan"` and `"nat"` both sort to `"ant"`
- `"bat"` sorts to `"abt"`

### Brute Force

A brute-force approach would compare each word to many others to decide whether they belong in the same group.

- Time: can degrade toward `O(n² * k log k)` depending on comparison method
- Space: variable

> [!WARNING]
> Brute-force grouping is expensive because it repeatedly asks whether pairs of strings are anagrams, instead of computing one reusable key per word.

### Optimized Approach

#### 💡 Key Insight

Convert each string into a canonical form.  
All anagrams share the same canonical key.

#### 🧠 Mental Model

We do not group by the original word.  
We group by its **identity under reordering**.

#### 🛠️ Steps

1. Create a map from canonical key to list of strings
2. For each string:
   - build its canonical key
   - append it to the correct group
3. Return all grouped lists

#### 💻 Code (Java)

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

#### ⏱️ Complexity

Let `n` be the number of strings and `k` be the average string length.

- Time: `O(n * k log k)` because each word is sorted
- Space: `O(n * k)` for grouped storage

> [!TIP]
> The important optimization is not making grouping free; it is making grouping *direct*. Each word computes its bucket exactly once.

### 🎨 Visual Intuition

```text
"eat" -> sort -> "aet" -> groups["aet"] = ["eat"]
"tea" -> sort -> "aet" -> groups["aet"] = ["eat", "tea"]
"tan" -> sort -> "ant" -> groups["ant"] = ["tan"]
"ate" -> sort -> "aet" -> groups["aet"] = ["eat", "tea", "ate"]
```

### ⚠️ Common Mistakes

- Using an unstable or incorrect key
- Forgetting that `HashMap` output order is not guaranteed
- Assuming sorted-key approach is the only possible solution

> [!CAUTION]
> Grouping problems are only as correct as the key design. If two equivalent items do not produce the same key, the entire solution breaks.

### Debug Steps

- print each original word and its computed `key`
- verify different words with the same sorted key land in the same bucket
- remember `HashMap` output order is not stable, so sort before asserting in tests

### Pattern Variations

- Group shifted strings
- Group by frequency signature instead of sorted string
- Bucket users/items by normalized attribute sets

### Pattern Composition

- Combine with frequency arrays to build `O(k)` keys for fixed alphabets instead of sorting each word

---

## API Tips: `merge` and `computeIfAbsent`

These APIs reduce boilerplate and edge bugs:

```java
freq.merge(c, 1, Integer::sum);
groups.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
```

### Why they help

- `merge` avoids manual `containsKey` plus update logic
- `computeIfAbsent` avoids manually checking whether a bucket already exists

Prefer them over repeated `containsKey` checks when possible.

> [!TIP]
> In interviews, these APIs also improve readability because they communicate intent directly: update count, or create bucket if missing.

---

## 🎨 Visual Intuition

Below is a quick mental map of how the main variants differ.

```text
1) Frequency counting
   input -> item -> map[item]++

2) Seen set
   input -> item -> if already in set => duplicate
                    else add to set

3) Complement lookup
   current value x -> need = target - x
                   -> if need already stored => answer

4) Grouping
   item -> canonical key -> append item to group[key]

5) Consecutive sequence
   put all values in set
   start only from x where x - 1 is absent
   expand while x + 1 exists
```

---

## ⚠️ Common Mistakes

1. Using mutable objects as map keys without stable `equals/hashCode`
2. Forgetting collision-safe key design for grouping problems
3. Assuming insertion order in `HashMap`/`HashSet`
4. Not handling null/empty edge cases
5. Updating before checking in complement-style problems
6. Using a counting-array solution for inputs that do not match its character assumptions

> [!CAUTION]
> The most subtle bug in hash-based interview problems is usually not the data structure choice—it is storing the wrong thing or updating it in the wrong order.

---

## 🔁 Pattern Variations

This pattern appears in many related forms:

- **Contains Duplicate** → use a seen set
- **Top K Frequent Elements** → build a frequency map, then combine with heap/bucket sort
- **Subarray Sum Equals K** → combine prefix sum with hashmap frequency
- **Longest Substring Without Repeating Characters** → combine set/map with sliding window
- **Find All Anagrams in a String** → combine frequency counting with a fixed-size window
- **First Unique Character** → frequency map, then second scan
- **Isomorphic Strings** → dual mapping consistency check

The core question remains the same:

> What information should I remember so I never have to recompute it?

---

## 🔗 Pattern Composition (Advanced)

Hash-based patterns become even more powerful when combined with other interview patterns.

### 1. HashMap + Prefix Sum

Use when you need counts or existence of earlier prefix states.

Example:

- Subarray Sum Equals K
- Continuous Subarray Sum
- Number of subarrays with a target property

Idea:

- maintain running prefix sum
- store how often each prefix sum has occurred
- check whether a prior prefix enables the required subarray

### 2. HashSet + Sliding Window

Use when you need uniqueness inside a moving window.

Example:

- Longest Substring Without Repeating Characters

Idea:

- window expands to include new characters
- while invariant breaks, shrink from the left
- set/map tracks current window state

### 3. HashMap + Sorting

Use when hashing provides grouping, but ordering is also required.

Example:

- Group Anagrams with deterministic output
- Frequency results sorted by count or lexicographic order

### 4. Hashing + Heaps / Buckets

Use when the map gives frequencies, but the problem asks for top-ranked answers.

Example:

- Top K Frequent Elements

> [!IMPORTANT]
> Strong interview performance comes from recognizing that patterns rarely appear alone. Hashing is often the lookup layer inside a larger strategy.

---

## 🧠 Key Takeaways

- Hash patterns are the first choice for lookup-heavy problems.
- Frequency maps and seen sets remove repeated scanning.
- The most important design decision is **what to store**.
- Correct key design determines correctness in grouping problems.
- Many “hard” problems become manageable when hashing is combined with prefix sum, sliding window, or heaps.

---

## 📌 Practice Problems

### Core Practice

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

### Next-Level Pattern Composition

7. Subarray Sum Equals K (LC 560)  
8. Longest Substring Without Repeating Characters (LC 3)  
9. Find All Anagrams in a String (LC 438)

> [!TIP]
> Do not just solve these once. Solve them by pattern category: duplicate detection, counting, complement lookup, grouping, and composition. That is how pattern recognition becomes automatic in interviews.
