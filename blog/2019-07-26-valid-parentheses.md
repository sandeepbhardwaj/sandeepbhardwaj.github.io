---
layout: post
title: Valid Parentheses
author: Sandeep Bhardwaj
published: true
date: 2019-07-26 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: [Stack]
summary: "Valid Parentheses"
---

<h3>Valid Parentheses</h3>


``` java
/**
 * 20. Valid Parentheses
 * <p>
 * Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
 * <p>
 * An input string is valid if:
 * <p>
 * Open brackets must be closed by the same type of brackets.
 * Open brackets must be closed in the correct order.
 * Note that an empty string is also considered valid.
 * <p>
 * Example 1:
 * <p>
 * Input: "()"
 * Output: true
 * Example 2:
 * <p>
 * Input: "()[]{}"
 * Output: true
 * Example 3:
 * <p>
 * Input: "(]"
 * Output: false
 */
public class ValidParentheses {

	public boolean isValid(String s) {

		Stack<Character> stack = new Stack<>();

		for (int i = 0; i < s.length(); i++) {
			char ch = s.charAt(i);

			// for open parentheses push to stack
			if (ch == '(' || ch == '{' || ch == '[') {
				stack.push(ch);
				continue;
			}

			if (stack.isEmpty()) {
				return false;
			}

			char top = stack.pop();

			if (ch == ')' && top != '(') {
				return false;
			}

			if (ch == '}' && top != '{') {
				return false;
			}

			if (ch == ']' && top != '[') {
				return false;
			}
		}

		return stack.isEmpty();
	}

	public boolean isValid2(String s) {
		Stack<Character> stack = new Stack<Character>();

		for (char c : s.toCharArray()) {
			if (c == '(') {
				stack.push(')');
			} else if (c == '{') {
				stack.push('}');
			} else if (c == '[') {
				stack.push(']');
			} else if (stack.isEmpty() || stack.pop() != c) {
				return false;
			}
		}
		return stack.isEmpty();
	}
}
```