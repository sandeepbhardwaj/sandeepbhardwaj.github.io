---
layout: post
title: Palindrome Number
author: Sandeep Bhardwaj
published: true
date: 2019-07-18 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: [Palindrome]
summary: "Palindrome Number"
---

<h3>Palindrome Number</h3>


``` java
/**
 * 9. Palindrome Number
 * <p>
 * Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.
 * <p>
 * Example 1:
 * <p>
 * Input: 121
 * Output: true
 * Example 2:
 * <p>
 * Input: -121
 * Output: false
 * Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
 * Example 3:
 * <p>
 * Input: 10
 * Output: false
 * Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
 * Follow up:
 * <p>
 * Coud you solve it without converting the integer to a string?
 */
public class PalindromeNumber {
	public boolean isPalindrome(int x) {
		//for negative number no need to test
		if (x < 0) {
			return false;
		}

		int temp = x;

		int reverseNumber = 0;
		while (Math.abs(temp) > 0) {
			reverseNumber = reverseNumber * 10 + temp % 10;
			temp = temp / 10;
		}

		return reverseNumber == x;
	}
}
```