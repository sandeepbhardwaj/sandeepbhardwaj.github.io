---
title: 'Decision Trees: From Splits to Pruning'
date: 2026-01-09
categories:
- AI
- ML
tags:
- ai
- ml
- decision-trees
- classification
- regression
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: 'Decision Trees: From Splits to Pruning'
seo_description: A deep practical guide to decision trees, split criteria, pruning,
  interpretability, and production trade-offs.
header:
  overlay_image: "/assets/images/ai-ml-series-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Simple Rules, Strong Baselines
---
Decision trees are one of the most practical ML models for tabular data.
They are intuitive, flexible, and strong baselines for both classification and regression.

---

## Tree Mechanics

A decision tree recursively splits data into increasingly pure subsets.

Structure:

- root node: first split
- internal nodes: subsequent decisions
- leaves: final prediction

For a prediction request, path traversal from root to leaf forms an explicit rule chain.

---

## Split Criteria and Objective

For classification, typical split criteria:

- Gini impurity
- entropy / information gain

For regression:

- MSE reduction
- MAE reduction

At each node, algorithm greedily selects the split that maximizes immediate impurity reduction.
This greedy approach is fast but not globally optimal.

---

## Why Trees Overfit Easily

Unconstrained trees can memorize training data by creating many tiny leaves.

Overfit indicators:

- near-perfect train score
- much lower validation score
- unstable behavior across folds

Regularization for trees comes mainly from structural constraints.

---

## Pre-Pruning Controls

Most important hyperparameters:

- `max_depth`
- `min_samples_split`
- `min_samples_leaf`
- `max_leaf_nodes`
- `min_impurity_decrease`

These define model complexity directly and should be tuned with validation.

---

## Post-Pruning

Post-pruning grows a larger tree first, then removes weak branches.
Cost-complexity pruning is common:

- adds penalty for tree size
- selects subtree with best validation trade-off

In noisy datasets, post-pruning can significantly improve generalization.

---

## Handling Numeric and Categorical Features

Numeric features are split via threshold tests, for example `x <= 12.5`.
Categorical handling depends on implementation:

- one-hot then numeric splits
- direct category partitioning in some libraries

High-cardinality categories can fragment data.
Use encoding and minimum leaf constraints carefully.

---

## Missing Values Strategy

Different implementations use:

- surrogate splits
- explicit missing direction
- pre-imputation

Whatever strategy you use, enforce parity between training and serving pipelines.

---

## Interpretability Strengths and Limits

Small trees are highly interpretable and audit-friendly.
Deep trees become hard to reason about, even if technically “explainable.”

Useful practices:

- cap depth for human readability
- inspect top-level splits for domain sanity
- review leaf sample counts
- validate path-level fairness for sensitive use cases

---

## Example: Credit Risk Pre-Screen

A tree may learn rules like:

- if missed_payments_6m > 2 and utilization > 80% -> high risk
- else if income_stability high and utilization < 40% -> lower risk

Such rule structures are easier for policy teams to validate than opaque embeddings.

---

## Common Mistakes

1. treating a deep unconstrained tree as production model
2. ignoring leaf sample size, causing unstable decisions
3. using random split on temporal risk data
4. interpreting one tree as causal policy logic without testing

---

## Key Takeaways

- decision trees are fast, practical, and interpretable baselines
- structural constraints and pruning are essential for generalization
- they form the foundation for stronger ensembles like random forests and boosting

---

            ## Problem 1: Turn 'Decision Trees: From Splits to Pruning' Into a Repeatable ML Decision

            Problem description:
            Topics like 'decision trees: from splits to pruning' are easy to understand conceptually and still easy to misuse in practice when the team tunes offline metrics without checking validation stability, calibration, and serving behavior together.

            What we are solving actually:
            We are deciding how this idea should change model quality on unseen data and what evidence would prove the change was worth shipping.

            What we are doing actually:

            1. define the failure mode this technique is supposed to reduce
            2. compare train, validation, and serving behavior instead of one score in isolation
            3. keep a small experiment log so parameter changes stay explainable
            4. re-check latency, drift, and threshold behavior before rollout

            ```mermaid
flowchart LR
    A[Training data] --> B[Model training]
    B --> C[Validation check]
    C --> D[Serving decision]
```

            ## Debug Steps

            Debug steps:

            - compare training and validation curves before deciding the model is better
            - inspect whether the improvement survives a different split or time window
            - verify that threshold or calibration changes still match the product objective
            - record the production metric that should move if the offline change is real
