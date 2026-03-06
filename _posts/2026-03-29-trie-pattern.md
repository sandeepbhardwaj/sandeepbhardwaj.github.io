---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-29
seo_title: Trie Pattern in Java – Complete Guide
seo_description: Learn Trie in Java for prefix search, autocomplete, and dictionary-based
  backtracking problems.
tags:
- dsa
- java
- trie
- prefix-tree
- strings
title: Trie Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/trie-banner.svg"
  overlay_filter: 0.35
  caption: Efficient Prefix-Based String Search
  show_overlay_excerpt: false
---
Trie (prefix tree) is optimized for prefix operations on string sets.
It is widely used in dictionaries, autocomplete, and word-search style problems.

---

## Core Trie Node

```java
class TrieNode {
    TrieNode[] next = new TrieNode[26];
    boolean isWord;
}
```

---

## Basic Trie Implementation

```java
class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode cur = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (cur.next[i] == null) cur.next[i] = new TrieNode();
            cur = cur.next[i];
        }
        cur.isWord = true;
    }

    public boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isWord;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private TrieNode walk(String s) {
        TrieNode cur = root;
        for (char ch : s.toCharArray()) {
            int i = ch - 'a';
            if (cur.next[i] == null) return null;
            cur = cur.next[i];
        }
        return cur;
    }
}
```

---

## Dry Run (Insert + Search)

Insert words: `"cat"`, `"car"`

Structure after insert:

- root -> `c` -> `a`
  - branch `t` (`isWord=true`)
  - branch `r` (`isWord=true`)

`search("ca")` -> reaches node but `isWord=false` => false  
`startsWith("ca")` -> node exists => true  
`search("car")` -> node exists and `isWord=true` => true

This separation between path existence and word completion is key.

---

## Problem 1: Implement Trie

Covered by template above.

---

## Problem 2: Word Dictionary (Wildcard Search)

Use trie + DFS where `.` branches across children.

```java
class WordDictionary {
    private final TrieNode root = new TrieNode();

    public void addWord(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) cur.next[i] = new TrieNode();
            cur = cur.next[i];
        }
        cur.isWord = true;
    }

    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String w, int idx, TrieNode node) {
        if (node == null) return false;
        if (idx == w.length()) return node.isWord;

        char c = w.charAt(idx);
        if (c == '.') {
            for (TrieNode child : node.next) {
                if (dfs(w, idx + 1, child)) return true;
            }
            return false;
        }
        return dfs(w, idx + 1, node.next[c - 'a']);
    }
}
```

---

## Problem 3: Word Search II

Build trie of dictionary words and DFS on board; prune paths missing trie children.

---

## Common Mistakes

1. Forgetting end-of-word marker
2. Not pruning DFS when trie path is null
3. Hardcoding character set assumptions unintentionally
4. High memory usage without cleanup in large dictionaries

---

## Memory Optimization Note

For sparse dictionaries, `Map<Character, TrieNode>` children can reduce memory versus fixed `TrieNode[26]`.
Trade-off: more overhead per access.

Choose based on character set size and dictionary scale.

---

## Debug Checklist

1. verify `isWord` is set only at full-word end
2. print traversed chars during failed search
3. for wildcard search, ensure all children are explored on `.`
4. in board DFS problems, confirm visited rollback and trie-pruning both happen

Most trie bugs come from word-end handling or missing prune conditions.

---

## Practice Set (Recommended Order)

1. Implement Trie (Prefix Tree) (LC 208)  
   [LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree/)
2. Design Add and Search Words Data Structure (LC 211)  
   [LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
3. Word Search II (LC 212)  
   [LeetCode](https://leetcode.com/problems/word-search-ii/)
4. Replace Words (LC 648)  
   [LeetCode](https://leetcode.com/problems/replace-words/)
5. Longest Word in Dictionary (LC 720)  
   [LeetCode](https://leetcode.com/problems/longest-word-in-dictionary/)

---

## Key Takeaways

- Trie is the right tool for repeated prefix queries.
- Trie + DFS is powerful for grid/dictionary search problems.
- Memory tradeoff is the cost for fast prefix operations.
