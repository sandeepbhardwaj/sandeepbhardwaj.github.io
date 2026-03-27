---
title: Sliding Window Technique in Java - Interview Preparation Guide
date: 2026-03-13
categories:
- DSA
- Java
tags:
- dsa
- java
- sliding-window
- two-pointers
- deque
- algorithms
- interview-preparation
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Sliding Window Technique in Java - Interview Preparation Guide
seo_description: Master sliding window patterns in Java with fixed and variable windows, frequency maps, monotonic deques, recognition signals, and interview-ready reasoning.
header:
  overlay_image: "/assets/images/sliding-window-banner.svg"
  overlay_filter: 0.35
  caption: Interview Pattern Recognition and Window Invariants
  show_overlay_excerpt: false
---
Sliding window is one of the most important interview patterns because it converts many contiguous-range problems from repeated rescans into one controlled linear pass.

It is a specialized form of two pointers:
`right` expands the current range, `left` shrinks it when the invariant breaks, and a small state object summarizes what the current window means.

If you have not read the base pattern yet, start here:
[Two Pointers Technique in Java](/dsa/java/two-pointers-technique/)

> [!NOTE] Interview lens
> A strong sliding-window answer usually has four parts:
> 1. why the problem is really about a contiguous range,
> 2. what state the window must maintain,
> 3. when and why `left` moves,
> 4. why each index is processed only `O(1)` times.

---

## Pattern Summary Table

Use this as a quick revision sheet before interviews.

| Pattern | When to use | Key idea | Example problems |
| --- | --- | --- | --- |
| Fixed-size window | every subarray or substring of exact size `k` | add the incoming element, remove the outgoing one, evaluate when size is exactly `k` | Maximum Sum Subarray of Size K, Maximum Average Subarray I |
| Variable-size longest valid window | longest range satisfying a constraint | expand `right`, shrink `left` until valid again, then maximize length | Longest Substring Without Repeating Characters, Longest Substring with At Most K Distinct Characters |
| Variable-size shortest valid window | smallest range meeting a threshold or coverage rule | expand until valid, then shrink aggressively to minimize | Minimum Size Subarray Sum, Minimum Window Substring |
| Frequency-matching window | anagram, permutation, exact multiset matching | maintain counts for the current window instead of rescanning characters | Permutation in String, Find All Anagrams in a String |
| Monotonic deque window | max/min for every window | keep only useful candidates in a deque, discard dominated values | Sliding Window Maximum, Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit |

---

## Problem Statement

Sliding window works when the answer lives inside a contiguous subarray or substring and the window state can be updated incrementally.

Instead of recalculating every range from scratch, we maintain a live window `[left, right]` and update only what changes:

- what enters from the right
- what leaves from the left
- whether the window is now valid

That is the real optimization.
The pattern is not "move two pointers."
It is "preserve an invariant while reusing previous work."

---

## Pattern Recognition Signals

Before coding, ask these questions:

1. Is the problem about a contiguous subarray or substring?
2. Does the prompt ask for the longest, shortest, maximum, minimum, or count over a range?
3. Can the window state be updated with one incoming element and one outgoing element?
4. When the window becomes invalid, can moving `left` eventually restore validity?
5. Is the problem asking about every range of size `k` or a range constrained by "at most", "at least", or "exactly"?

If the answer is yes to most of these, sliding window should be one of your first thoughts.

---

## Visual Intuition

- A sliding window is a live contract over `[left, right]`.
- `right` discovers information; `left` repairs the invariant.
- Fixed-size windows behave like a conveyor belt: one element enters, one element leaves.
- Variable-size windows behave like an elastic band: expand to gain information, shrink to restore validity.
- The window state is usually a compressed summary such as a sum, a frequency map, or a deque of candidates.
- In linear solutions, each element is usually added once and removed once.
- If you do not know exactly when to move `left`, you do not yet have the invariant.

> [!IMPORTANT] Senior-engineer habit
> State the invariant before writing code.
> In interviews, that makes your implementation safer and your explanation much stronger.

---

## Pattern 1: Fixed-Size Window

Use this when the range size is fixed at `k`.

### How to Recognize This Pattern

- Signals in the problem statement:
  every subarray of size `k`, rolling average, window size stays constant, compute max or min over all length-`k` ranges.
- Keywords that hint at it:
  size `k`, exact length, every window, rolling, moving average.
- Constraints that guide the approach:
  contiguous range, repeated evaluation of same-size windows, expected `O(n)` solution.

### Problem-Solving Approach

**Brute force idea**

Enumerate every subarray of size `k` and compute its value from scratch.
For sums, that becomes `O(nk)`.

**Optimization insight**

Adjacent windows overlap heavily.
When the window moves by one step, only one element leaves and one element enters.

**Final optimal approach**

Maintain the current window summary.
Add `nums[right]` when expanding.
If the window exceeds size `k`, remove `nums[left]` and increment `left`.
Evaluate the answer only when the window size is exactly `k`.

**Why this approach works**

Each window is derived from the previous one in `O(1)` time.
No full recomputation is needed.

### Visual Intuition

```text
nums = [2, 1, 5, 1, 3, 2], k = 3

Window 1: [2, 1, 5] -> sum = 8
Window 2: [1, 5, 1] -> sum = 8

Move by one step:

old sum = 8
remove 2
add 1
new sum = 7

Only the boundary elements change.
```

### Example Problem: Maximum Sum Subarray of Size K

```java
public int maxSumSubarrayOfSizeK(int[] nums, int k) {
    if (nums == null || k <= 0 || nums.length < k) return -1;

    int left = 0;
    int windowSum = 0;
    int best = Integer.MIN_VALUE;

    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right];

        if (right - left + 1 > k) {
            windowSum -= nums[left];
            left++;
        }

        if (right - left + 1 == k) {
            best = Math.max(best, windowSum);
        }
    }

    return best;
}
```

**Invariant**

`windowSum` always equals the sum of the current window `[left, right]`.
After the shrink step, the window size is never greater than `k`.

### Pattern Variations

- `Maximum Average Subarray I`: same pattern, different final calculation.
- count negatives or distinct values in every window of size `k`
- fixed-length string windows such as substring hash or character counts

### Common Mistakes

- updating the answer before the window actually reaches size `k`
- forgetting to subtract the outgoing element
- using the wrong outgoing index after incrementing `left`
- not handling `k <= 0` or `k > n`

---

## Pattern 2: Variable-Size Window for the Shortest Valid Range

Use this when you want the smallest contiguous range that satisfies a threshold.

### How to Recognize This Pattern

- Signals in the problem statement:
  minimum length subarray, smallest substring, at least target, once valid make it smaller.
- Keywords that hint at it:
  shortest, minimum, at least, cover, satisfy threshold.
- Constraints that guide the approach:
  validity should become easier to preserve as `left` moves right, and shrinking should not miss a shorter valid answer.

### Problem-Solving Approach

**Brute force idea**

Enumerate every starting index and expand until the condition is met.
This is typically `O(n^2)`.

**Optimization insight**

Once a window becomes valid, keeping extra elements on the left only makes it longer than necessary.
That means we should shrink immediately while the condition still holds.

**Final optimal approach**

Expand `right` until the window becomes valid.
Then shrink `left` as aggressively as possible while preserving validity.
Update the best answer during that shrinking phase.

**Why this approach works**

The first valid version of a window is rarely the best one.
The optimal answer is found by repeatedly tightening valid windows before moving on.

### Visual Intuition

```text
target = 7
nums = [2, 3, 1, 2, 4, 3]

Expand:
[2, 3, 1, 2] -> sum = 8, valid
 ^
left        ^ right

Shrink:
[3, 1, 2] -> sum = 6, invalid
 ^
left     ^ right

The best moment to update the answer is while the window is still valid.
```

### Example Problem: Minimum Size Subarray Sum

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0;
    int sum = 0;
    int best = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];

        while (sum >= target) {
            best = Math.min(best, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }

    return best == Integer.MAX_VALUE ? 0 : best;
}
```

**Invariant**

`sum` always represents the current window.
Whenever `sum >= target`, the current window is valid, so shrinking it is the only way to improve the answer.

> [!WARNING] Important precondition
> This direct pattern assumes all numbers are positive.
> If negative numbers are allowed, shrinking the window no longer behaves monotonically, so this exact approach can fail.

### Pattern Variations

- `Minimum Window Substring`: coverage-based shrinking with character counts
- smallest subarray with sum at least `target`
- shortest range that covers required categories or symbols

### Common Mistakes

- using `if` instead of `while` when multiple shrink steps are needed
- updating the answer after breaking validity instead of before
- applying the positive-number version to arrays containing negatives

---

## Pattern 3: Variable-Size Window for the Longest Valid Range

Use this when you want the longest range that stays valid under a constraint.

### How to Recognize This Pattern

- Signals in the problem statement:
  longest substring, longest subarray, no repeats, at most `k`, valid while a rule holds.
- Keywords that hint at it:
  longest, at most, distinct, unique, replacement, no duplicates.
- Constraints that guide the approach:
  validity can be restored by moving `left` forward, and once valid, a longer window is always worth considering.

### Problem-Solving Approach

**Brute force idea**

Check every substring or subarray and test whether it is valid.
This is usually `O(n^2)`.

**Optimization insight**

When the window becomes invalid, the left side is the only part we can discard to repair it.
We do not need to restart the scan.

**Final optimal approach**

Expand `right` one step at a time.
Update the window state.
While the window is invalid, shrink from the left.
Once valid, update the best length.

**Why this approach works**

Each index moves forward only once.
That turns repeated range checking into one incremental scan.

### Visual Intuition

```text
s = "abca"

Window grows:
"abc" -> valid

Add 'a':
"abca" -> invalid because 'a' repeats

Shrink from left:
"bca" -> valid again

The window is repaired, not rebuilt from scratch.
```

### Example Problem: Longest Substring Without Repeating Characters

```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    int left = 0;
    int best = 0;

    for (int right = 0; right < s.length(); right++) {
        char in = s.charAt(right);
        freq.put(in, freq.getOrDefault(in, 0) + 1);

        while (freq.get(in) > 1) {
            char out = s.charAt(left);
            freq.put(out, freq.get(out) - 1);
            if (freq.get(out) == 0) {
                freq.remove(out);
            }
            left++;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}
```

**Invariant**

After the inner `while` loop, the substring `s[left..right]` contains no duplicate characters.

### Mental Model

The goal is not to find every valid substring.
The goal is to maintain the longest valid suffix ending at `right`.
If that suffix is correct, the global best is easy to update.

### Pattern Variations

- `Longest Substring with At Most K Distinct Characters`
- `Fruit Into Baskets`
- `Longest Repeating Character Replacement`

### Common Mistakes

- updating `best` before restoring validity
- using `if` when duplicates require repeated shrinking
- forgetting to remove zero-frequency keys when map size matters

---

## Pattern 4: Frequency-Matching Window

Use this when the window must match a target multiset of characters or values.

### How to Recognize This Pattern

- Signals in the problem statement:
  anagram, permutation, contains all characters, same frequency, exact coverage.
- Keywords that hint at it:
  anagram, permutation, rearrangement, multiset, pattern match.
- Constraints that guide the approach:
  compare a moving fixed-length or coverage-based window against target frequencies without rescanning every character.

### Problem-Solving Approach

**Brute force idea**

For every candidate substring, build counts and compare them to the target counts.
That is often `O(nm)` or `O(n * alphabet)` with unnecessary repeated work.

**Optimization insight**

Frequency changes only at the edges of the window.
We can maintain the deficit between the target and the current window incrementally.

**Final optimal approach**

Preload the target counts.
As `right` expands, consume characters from the deficit.
When the window becomes larger than the pattern length, restore the outgoing character.
If the remaining required count reaches zero, a valid permutation exists.

**Why this approach works**

You never recompute the whole frequency table for the current window.
You only update what changed.

### Visual Intuition

```text
pattern = "ab"
text    = "eidbaooo"

Need initially:
a:1 b:1

Window "db":
consume d -> irrelevant
consume b -> b deficit becomes 0

Shift to "ba":
remove d
add a -> a deficit becomes 0

All required characters matched -> valid permutation found
```

### Example Problem: Permutation in String

Assume lowercase English letters, as in the standard interview version.

```java
public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;

    int[] need = new int[26];
    for (char c : s1.toCharArray()) {
        need[c - 'a']++;
    }

    int left = 0;
    int required = s1.length();

    for (int right = 0; right < s2.length(); right++) {
        int in = s2.charAt(right) - 'a';
        if (need[in] > 0) {
            required--;
        }
        need[in]--;

        if (right - left + 1 > s1.length()) {
            int out = s2.charAt(left) - 'a';
            need[out]++;
            if (need[out] > 0) {
                required++;
            }
            left++;
        }

        if (required == 0) {
            return true;
        }
    }

    return false;
}
```

**Invariant**

`need[c]` represents how far the current window is from satisfying the required count for character `c`.
`required` counts how many characters are still missing overall.

### Pattern Variations

- `Find All Anagrams in a String`
- `Minimum Window Substring`
- any exact-frequency match over a bounded alphabet

### Common Mistakes

- confusing "window contains extras" with "window is invalid"
- forgetting to restore the outgoing character when the window slides
- using this array version when the alphabet is not fixed or not small

---

## Pattern 5: Monotonic Deque Window

Use this when each window needs its maximum or minimum quickly.

### How to Recognize This Pattern

- Signals in the problem statement:
  max in every window, min in every window, online extreme queries for each contiguous range.
- Keywords that hint at it:
  sliding maximum, sliding minimum, every window, best value in each range.
- Constraints that guide the approach:
  brute force per window is too slow, and the answer requires repeated extreme-value access.

### Problem-Solving Approach

**Brute force idea**

For every window, scan all `k` elements to find the maximum.
That is `O(nk)`.

**Optimization insight**

Many elements can never become the maximum of a future window.
If a new element is larger than smaller elements at the back, those smaller elements are permanently dominated.

**Final optimal approach**

Maintain a deque of indices whose values are in decreasing order.

- remove stale indices from the front
- remove dominated indices from the back
- add the current index
- the front always stores the window maximum

**Why this approach works**

Each index enters the deque once and leaves once.
That gives amortized `O(1)` deque maintenance and `O(n)` total time.

### Visual Intuition

```text
nums = [1, 3, 1, 2, 0, 5], k = 3

Deque stores indices of useful candidates in decreasing value order.

After processing [1, 3, 1]:
deque -> [index of 3, index of 1]
front is max

Add 2:
drop stale index if outside window
drop trailing 1 because 2 dominates it
deque now keeps only candidates that can still become max
```

### Example Problem: Sliding Window Maximum

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || nums.length == 0 || k <= 0 || k > nums.length) {
        return new int[0];
    }

    Deque<Integer> dq = new ArrayDeque<>();
    int[] ans = new int[nums.length - k + 1];
    int idx = 0;

    for (int right = 0; right < nums.length; right++) {
        while (!dq.isEmpty() && dq.peekFirst() <= right - k) {
            dq.pollFirst();
        }

        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[right]) {
            dq.pollLast();
        }

        dq.offerLast(right);

        if (right >= k - 1) {
            ans[idx++] = nums[dq.peekFirst()];
        }
    }

    return ans;
}
```

**Invariant**

The deque stores indices inside the current window, and their values are in decreasing order from front to back.
That makes the front the maximum of the current window.

### Pattern Variations

- sliding minimum by reversing the comparison
- two deques for max and min in range-difference problems
- window-based online monitoring where each step needs current extreme values

### Common Mistakes

- storing values instead of indices, which makes stale removal difficult
- forgetting to remove indices that fall out of the window
- using the wrong comparison direction when maintaining monotonic order

---

## Common Mistakes

These are the mistakes interviewers see most often:

1. Updating the answer before restoring validity
   In variable windows, the answer usually belongs after the shrink loop, not before it.
2. Using `if` when `while` is required
   Many invalid windows need repeated shrinking, not a single adjustment.
3. Off-by-one window size errors
   The standard formula is `right - left + 1`.
4. Stale state
   Forgetting to decrement outgoing counts, remove zero-frequency keys, or evict stale deque indices.
5. Broken edge-case handling
   Test empty input, `k <= 0`, `k > n`, single element, duplicates, and "no valid window" cases.
6. Applying the pattern where monotonicity does not exist
   Some sum-based shortest-window problems break when negative numbers are allowed.

---

## Complexity Insights

Most sliding-window problems have a familiar complexity profile.

| Pattern | Time | Extra space | Trade-off |
| --- | --- | --- | --- |
| Fixed-size window | `O(n)` | `O(1)` or `O(k)` depending on state | very simple, but only works when the window size is fixed |
| Variable-size longest valid | `O(n)` | `O(1)` to `O(charset)` | requires a repairable validity rule |
| Variable-size shortest valid | `O(n)` for monotonic cases | `O(1)` or `O(charset)` | can fail if shrinking is not monotonic |
| Frequency-matching window | `O(n)` with bounded alphabet or incremental counts | `O(charset)` | state bookkeeping is easy to get wrong |
| Monotonic deque window | `O(n)` amortized | `O(k)` | implementation is trickier, but supports window max/min efficiently |

Interview shortcut:
the core reason these are linear is that each index enters and leaves the window or helper structure at most once.

---

## Advanced Variations

Interviewers often modify the same core pattern in small but meaningful ways.

### Fixed-size follow-ups

- what changes if you need the minimum instead of maximum?
- what if the window summary is a frequency table instead of a sum?
- what if you need to report all windows, not just the best one?

### Variable-window follow-ups

- is the condition "at most", "at least", or "exactly"?
- does the answer ask for the longest valid window or the shortest valid window?
- what extra state is needed: sum, frequency map, distinct count, max frequency?

### Frequency-window follow-ups

- do you need one valid window or all valid starting indices?
- is the alphabet fixed enough for an array or do you need a map?
- do extra characters make the window invalid or just irrelevant?

### Deque-window follow-ups

- do you need max, min, or both?
- is the answer for every window or only the best one overall?
- can a heap work, or do stale elements make a deque cleaner?

The right follow-up response is usually:
restate the invariant, then say exactly which state object changes.

---

## Pattern Composition (Advanced)

The strongest solutions often combine sliding window with another pattern instead of using it alone.

| Composition | Where it shows up | Why it works |
| --- | --- | --- |
| Two pointers + sliding window | most contiguous range problems | `left` and `right` define the live range, and the invariant decides when to shrink |
| Sliding window + hash map or count array | unique characters, anagrams, `k` distinct | the map summarizes the current window without rescanning it |
| Sliding window + monotonic deque | window max/min, bounded-difference ranges | the deque gives extreme values in amortized `O(1)` |
| Sliding window + running sum | fixed-size sums, rolling averages, positive-number thresholds | the numeric state updates in constant time as the window moves |
| Sliding window + greedy summary | character replacement, majority-like constraints | one summary statistic helps decide whether the window can stay open |
| Binary search on answer + window feasibility check | "find maximum valid length" style problems | the window becomes an `O(n)` validator for a guessed answer |

This is how senior candidates think:
not "Which template did I memorize?"
but "What minimal state makes this moving range easy to reason about?"

---

## When Not to Use Sliding Window

Do not force this pattern when the problem does not have local, repairable range behavior.

Avoid defaulting to sliding window when:

- the constraint depends on non-contiguous choices
- negative numbers break the monotonic shrink logic of a sum-based window
- the query is better answered by prefix sums, binary search, heaps, or segment trees
- the state needed for a range cannot be updated incrementally

Pattern selection matters as much as implementation.

---

## Interview Answer Template

When you recognize a sliding-window problem, a clean explanation sounds like this:

1. "The prompt is about a contiguous range, so I want a moving window instead of rescanning all subarrays."
2. "My window state is: ..."
3. "I will expand `right` to add new information."
4. "If the invariant breaks, I will move `left` until the window is valid again."
5. "Each index enters and leaves the window at most once, so the total work is linear."

That explanation sounds much stronger than only saying, "I will use sliding window."

---

## Production Perspective

Sliding windows matter in backend systems for the same reason they matter in interviews:
they let you maintain rolling range state without rescanning history.

Common examples:

- request rate over the last `N` events
- rolling error counts over recent intervals
- stream analytics on bounded ranges
- fraud or anomaly signals over recent activity

The practical benefits are the same:
linear processing, bounded state, and predictable performance.

---

## Practice Problems

These problems cover the most useful sliding-window variants:

1. Maximum Average Subarray I (LC 643)  
   [LeetCode](https://leetcode.com/problems/maximum-average-subarray-i/)
2. Longest Substring Without Repeating Characters (LC 3)  
   [LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
3. Minimum Size Subarray Sum (LC 209)  
   [LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum/)
4. Fruit Into Baskets (LC 904)  
   [LeetCode](https://leetcode.com/problems/fruit-into-baskets/)
5. Permutation in String (LC 567)  
   [LeetCode](https://leetcode.com/problems/permutation-in-string/)
6. Find All Anagrams in a String (LC 438)  
   [LeetCode](https://leetcode.com/problems/find-all-anagrams-in-a-string/)
7. Longest Repeating Character Replacement (LC 424)  
   [LeetCode](https://leetcode.com/problems/longest-repeating-character-replacement/)
8. Minimum Window Substring (LC 76)  
   [LeetCode](https://leetcode.com/problems/minimum-window-substring/)
9. Sliding Window Maximum (LC 239)  
   [LeetCode](https://leetcode.com/problems/sliding-window-maximum/)

---

## Key Takeaways

- Sliding window is a specialized two-pointer pattern for contiguous ranges.
- The best recognition signals are "longest", "shortest", "size `k`", "at most", "at least", and "every window".
- The heart of the pattern is the invariant, not the pointer movement.
- Fixed-size windows reuse previous work by dropping one element and adding one element.
- Variable-size windows succeed when the constraint can be repaired by moving `left`.
- In interviews, explain the state object, the validity rule, and why each pointer moves only forward.

If you can identify the right subpattern, state the invariant clearly, and manage the window state without drift, you will solve a large class of array and string interview problems much more reliably.
