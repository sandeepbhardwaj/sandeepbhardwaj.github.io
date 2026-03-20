---
title: "Count Occurrences of Anagrams in Java"
date: '2024-01-28'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- arrays
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Count Occurrences of Anagrams in Java"
seo_description: "Understand Count Occurrences of Anagrams in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Count Occurrences of Anagrams is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Count Occurrences of Anagrams

Problem description:
We are given a problem around **Count Occurrences of Anagrams** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on hash-based lookup and pointer or search-space narrowing rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- count occurrences of anagrams is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 438. Find All Anagrams in a String / Count Occurrences of Anagrams
 * <p>
 * Given a word pat and a text txt. Return the count of the occurrences of anagrams of the word in the text.
 * <p>
 * Example 1:
 * Input: txt = forxxorfxdofr, ptr = for
 * Output: 3
 * Explanation: for, orf and ofr appears in the txt, hence answer is 3.
 * <p>
 * Example 2:
 * Input: txt = aabaabaa , ptr = aaba
 * Output: 4
 * Explanation: aaba is present 4 times in txt.
 */
public class CountOccurrencesOfAnagrams {

	private static int countAnagrams(String str, String ptr) {
		int count = 0;
		int k = ptr.length();

		Map<Character, Integer> map = new HashMap<>();
		for (char ch : ptr.toCharArray()) map.put(ch, map.getOrDefault(ch, 0) + 1);

		// variable that we will keep a count ,so we do not have to traverse the loop to see match
		int match = map.size();
		int left = 0, right = 0;

		while (right < str.length()) {
			char rightChar = str.charAt(right);
			if (map.containsKey(rightChar)) {
				map.put(rightChar, map.get(rightChar) - 1); // put the element and then reduce match

				if (map.get(rightChar) == 0) // if all occurrences of char found
					match--;
			}


			if (right - left + 1 < k) {
				right++;
			} else if (right - left + 1 == k) {
				if (match == 0)
					count++;

				char leftChar = str.charAt(left);
				if (map.containsKey(leftChar)) { // increment the match and then add to map

					//M.Imp before putting left char again do increment match
					if (map.get(leftChar) == 0)
						match++;

					map.put(leftChar, map.get(leftChar) + 1);
				}

				right++;
				left++;
			}
		}
		return count;
	}

	public static void main(String[] args) {
		System.out.println(countAnagrams("forxxorfxdofr", "for"));
		System.out.println(countAnagrams("aabaa", "aa"));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Count Occurrences of Anagrams usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on hash-based lookup and pointer or search-space narrowing. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Count Occurrences of Anagrams becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
