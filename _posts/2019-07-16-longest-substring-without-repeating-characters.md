---
layout: post
title: Longest Substring Without Repeating Characters
author: Sandeep Bhardwaj
published: true
date: 2019-07-16 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "String"
summary: "Longest Substring Without Repeating Characters"
---

<h3>Longest Substring Without Repeating Characters</h3>


``` java
/**
 * 3. Longest Substring Without Repeating Characters
 * <p>
 * Given a string, find the length of the longest substring without repeating characters.
 * <p>
 * Example 1:
 * <p>
 * Input: "abcabcbb"
 * Output: 3
 * Explanation: The answer is "abc", with the length of 3.
 * Example 2:
 * <p>
 * Input: "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 * Example 3:
 * <p>
 * Input: "pwwkew"
 * Output: 3
 * Explanation: The answer is "wke", with the length of 3.
 * Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
 */
public class LongestSubStrWithoutRepChars {
	public int lengthOfLongestSubstring(String s) {
		//base case
		if (s == null || s.length() == 0) {
			return 0;
		}

		Set<Character> set = new HashSet<>();
		int left = 0;
		int right = 0;
		int max = 0;

		while (right < s.length() && left <= right) {
			//if element not exist in set add and return true
			if (set.add(s.charAt(right))) {
				//move to next element to increase window size
				right++;
				max = Math.max(max, set.size());
			} else {
				//shrink the window size
				set.remove(s.charAt(left));
				left++;
			}

		}
		return max;
	}
}
```

