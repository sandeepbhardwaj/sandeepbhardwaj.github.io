#!/usr/bin/env python3
"""
Archive-wide content quality audit for Jekyll posts.

Usage examples:
  python3 scripts/validate_post_quality.py
  python3 scripts/validate_post_quality.py --visible-only
  python3 scripts/validate_post_quality.py --min-words 600 --max-list 60
  python3 scripts/validate_post_quality.py --date 2026-03-20
"""

from __future__ import annotations

import argparse
import re
from collections import Counter
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "_posts"
WORD_RE = re.compile(r"\b\w+\b")


@dataclass
class PostInfo:
    path: Path
    title: str
    post_date: date
    categories: list[str]
    words: int
    has_mermaid: bool
    has_problem_marker: bool
    has_solving_marker: bool
    has_doing_marker: bool
    has_debug_marker: bool

    @property
    def future(self) -> bool:
        return False

    @property
    def marker_score(self) -> int:
        return sum(
            [
                self.has_problem_marker,
                self.has_solving_marker,
                self.has_doing_marker,
                self.has_debug_marker,
            ]
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate post quality across the archive.")
    parser.add_argument("--min-words", type=int, default=500, help="Flag posts under this word count.")
    parser.add_argument(
        "--max-list",
        type=int,
        default=40,
        help="Maximum number of thin posts to print.",
    )
    parser.add_argument(
        "--visible-only",
        action="store_true",
        help="Only evaluate posts dated on or before the reference date.",
    )
    parser.add_argument(
        "--date",
        default=str(date.today()),
        help="Reference date in YYYY-MM-DD format for visibility checks.",
    )
    return parser.parse_args()


def parse_front_matter(text: str) -> tuple[str, date, list[str]]:
    title_match = re.search(r"^title:\s*(.+)$", text, re.M)
    date_match = re.search(r"^date:\s*'?([0-9]{4}-[0-9]{2}-[0-9]{2})'?$", text, re.M)
    categories_match = re.search(r"^categories:\n((?:- .*\n)+)", text, re.M)

    if not title_match or not date_match:
        raise ValueError("Missing required front matter fields: title/date")

    title = title_match.group(1).strip()
    post_date = date.fromisoformat(date_match.group(1))

    categories: list[str] = []
    if categories_match:
        categories = [
            line[2:].strip()
            for line in categories_match.group(1).splitlines()
            if line.startswith("- ")
        ]

    return title, post_date, categories


def load_posts() -> list[PostInfo]:
    posts: list[PostInfo] = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        title, post_date, categories = parse_front_matter(text)
        posts.append(
            PostInfo(
                path=path,
                title=title,
                post_date=post_date,
                categories=categories,
                words=len(WORD_RE.findall(text)),
                has_mermaid="```mermaid" in text,
                has_problem_marker="Problem description:" in text,
                has_solving_marker="What we are solving actually:" in text,
                has_doing_marker="What we are doing actually:" in text,
                has_debug_marker="Debug steps:" in text,
            )
        )
    return posts


def print_counts(label: str, posts: Iterable[PostInfo], thresholds: list[int]) -> None:
    posts = list(posts)
    print(label)
    print(f"  posts={len(posts)}")
    if not posts:
        return

    mermaid_count = sum(post.has_mermaid for post in posts)
    guide_count = sum(post.marker_score == 4 for post in posts)
    print(f"  with_mermaid={mermaid_count}")
    print(f"  with_all_four_markers={guide_count}")
    for threshold in thresholds:
        count = sum(post.words < threshold for post in posts)
        print(f"  under_{threshold}={count}")


def main() -> None:
    args = parse_args()
    reference_date = date.fromisoformat(args.date)
    posts = load_posts()
    visible_posts = [post for post in posts if post.post_date <= reference_date]
    future_posts = [post for post in posts if post.post_date > reference_date]
    audit_posts = visible_posts if args.visible_only else posts
    thin_posts = [post for post in audit_posts if post.words < args.min_words]

    print(f"reference_date={reference_date.isoformat()}")
    print(f"mode={'visible_only' if args.visible_only else 'all_posts_including_future'}")
    print_counts("archive_summary", posts, [400, 500, 600, 800])
    print_counts("visible_summary", visible_posts, [400, 500, 600, 800])
    print_counts("future_summary", future_posts, [400, 500, 600, 800])

    print("thin_posts")
    print(f"  threshold={args.min_words}")
    print(f"  count={len(thin_posts)}")

    category_counter: Counter[str] = Counter()
    month_counter: Counter[str] = Counter()
    for post in thin_posts:
        category_key = " / ".join(post.categories) if post.categories else "(none)"
        category_counter[category_key] += 1
        month_counter[post.post_date.strftime("%Y-%m")] += 1

    print("top_categories_under_threshold")
    for category, count in category_counter.most_common(10):
        print(f"  {count:3} {category}")

    print("top_months_under_threshold")
    for month, count in month_counter.most_common(12):
        print(f"  {count:3} {month}")

    print("thinnest_posts")
    for post in sorted(thin_posts, key=lambda item: (item.words, item.path.name))[: args.max_list]:
        categories = " / ".join(post.categories) if post.categories else "(none)"
        print(
            f"  {post.words:4} {post.post_date.isoformat()} {post.path.name} "
            f"| mermaid={'yes' if post.has_mermaid else 'no'} "
            f"| markers={post.marker_score}/4 "
            f"| {categories}"
        )


if __name__ == "__main__":
    main()
