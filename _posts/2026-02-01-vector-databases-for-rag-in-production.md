---
title: Vector Databases for RAG in Production
date: 2026-02-01
categories:
- AI
- ML
tags:
- ai
- ml
- rag
- vector-database
- embeddings
- retrieval
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Vector Databases for RAG in Production
seo_description: A practical deep-dive into vector database design, ANN indexing,
  hybrid retrieval, filtering, and operations for production RAG systems.
header:
  overlay_image: "/assets/images/ai-ml-series-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: ANN Trade-offs Decide Retrieval Quality and Latency
---
Vector databases are central to modern RAG systems, but many implementations fail because teams treat them as storage instead of retrieval engines.

A production-ready vector system must balance:

- retrieval quality (recall/precision)
- latency SLOs
- filtering correctness
- cost and operational stability

This article covers architecture decisions, index trade-offs, and practical operating patterns.

---

## What a Vector Database Actually Does

At retrieval time, you:

1. convert query to embedding vector
2. search nearest vectors in index
3. apply metadata filters and ranking
4. return top-k context for downstream generation

The key challenge is approximate nearest neighbor (ANN) search under strict latency.

---

## Exact Search vs Approximate Search

Exact nearest-neighbor gives perfect recall but is expensive at scale.
ANN gives large speed gains with small recall trade-off.

For most production RAG workloads, ANN is required.
The goal is not max speed or max recall alone, but best quality under latency budget.

---

## Core ANN Index Families

### HNSW (Hierarchical Navigable Small World)

Strengths:

- strong recall-latency performance
- good default for many medium/large corpora

Trade-offs:

- memory-heavy
- build time can be significant

### IVF (Inverted File)

Strengths:

- scalable for very large datasets
- tunable search breadth

Trade-offs:

- requires good clustering configuration
- recall sensitive to probe settings

### PQ / OPQ (Product Quantization)

Strengths:

- reduces memory footprint substantially

Trade-offs:

- compression can degrade similarity precision

Use when memory pressure is critical and slight recall drop is acceptable.

---

## Metadata Filtering Is Not Optional

Enterprise retrieval needs filters:

- tenant_id
- access policy
- language
- date range
- document type

If filtering is weak or applied incorrectly, you risk:

- unauthorized retrieval
- low relevance due to mixed domains
- compliance incidents

Validate filter behavior with integration tests, not assumptions.

---

## Hybrid Retrieval Pattern

Vector search alone is often insufficient.
For production, hybrid retrieval is usually stronger:

- dense ANN retrieval for semantic matches
- BM25/sparse retrieval for exact terms and identifiers
- score fusion and reranking

Hybrid improves robustness on enterprise queries containing product codes, policy IDs, and rare terms.

---

## Reranking Layer

Initial retrieval can return 50-200 candidates.
A reranker reorders for precision.

Benefits:

- higher top-k relevance
- reduced context noise
- better grounded generation quality

Trade-off is additional latency. Measure marginal gain carefully.

---

## Operational SLO Design

Define retrieval SLOs explicitly:

- P50/P95/P99 query latency
- recall@k target on gold evaluation set
- index freshness lag
- filter correctness rate

A retrieval stack with good average latency but poor tail latency can still break user experience.

---

## Index Update Strategies

Common update modes:

- full rebuild (simple, costly)
- incremental append and periodic compaction
- streaming updates for freshness-sensitive corpora

Also design deletion behavior:

- hard delete for sensitive content
- tombstone + periodic cleanup for large pipelines

Stale or deleted documents in index are high-risk failure modes.

---

## Capacity and Cost Planning

Plan for:

- vector dimension and memory footprint
- index replication for availability
- query throughput bursts
- embedding refresh waves

Cost usually grows faster from replication and memory than from compute.
Instrument per-query cost and cache hit rates.

---

## Evaluation Framework

Offline retrieval metrics:

- recall@k
- precision@k
- MRR/NDCG

Online metrics:

- answer acceptance rate
- citation usefulness
- escalation rate
- latency by query segment

Evaluate by query class (faq, troubleshooting, policy, long-tail) for realistic diagnosis.

---

## End-to-End Code Example (FAISS + Metadata Filter + Hybrid Rerank)

```python
import numpy as np
import faiss
from rank_bm25 import BM25Okapi

# Assume you already have document chunks + embeddings
chunks = [
    {"id": "c1", "text": "Refunds are allowed within 30 days", "tenant": "a", "tokens": ["refund", "30", "days"]},
    {"id": "c2", "text": "Proration applies on upgrade", "tenant": "a", "tokens": ["proration", "upgrade"]},
    {"id": "c3", "text": "Enterprise SLA is 99.9%", "tenant": "b", "tokens": ["enterprise", "sla"]},
]

emb = np.array([
    [0.12, 0.42, 0.91],
    [0.10, 0.35, 0.84],
    [0.95, 0.07, 0.11],
], dtype="float32")

# Normalize for cosine similarity via inner product
faiss.normalize_L2(emb)
index = faiss.IndexHNSWFlat(emb.shape[1], 32)
index.hnsw.efConstruction = 80
index.hnsw.efSearch = 64
index.add(emb)

bm25 = BM25Okapi([c["tokens"] for c in chunks])

# Mock query embedding + sparse tokens
query_vec = np.array([[0.11, 0.40, 0.89]], dtype="float32")
faiss.normalize_L2(query_vec)
query_tokens = ["refund", "days"]

# Dense retrieval
D, I = index.search(query_vec, k=5)
dense_candidates = [chunks[i] for i in I[0] if i != -1]

# Metadata filter (tenant-aware)
dense_candidates = [c for c in dense_candidates if c["tenant"] == "a"]

# Sparse scores for hybrid fusion
bm25_scores = bm25.get_scores(query_tokens)
score_map = {chunks[i]["id"]: float(bm25_scores[i]) for i in range(len(chunks))}

# Simple hybrid rerank: dense rank score + sparse score
reranked = []
for rank, c in enumerate(dense_candidates):
    dense_score = 1.0 / (rank + 1)
    sparse_score = score_map.get(c["id"], 0.0)
    hybrid_score = 0.7 * dense_score + 0.3 * sparse_score
    reranked.append((hybrid_score, c))

reranked.sort(key=lambda x: x[0], reverse=True)
top_context = [x[1] for x in reranked[:3]]

print("Top context:")
for c in top_context:
    print(c["id"], c["text"])
```

This is a minimal skeleton. In production, add robust embedding generation, persistent storage, ACL enforcement, and evaluation harness.

---

## Common Mistakes

1. using vector-only retrieval for all query types
2. no metadata filtering or weak ACL enforcement
3. tuning ANN for speed only and ignoring recall
4. no reranking for noisy corpora
5. no index freshness and deletion policy

---

## Key Takeaways

- Vector databases are retrieval engines, not simple storage.
- ANN index configuration and metadata filtering drive production quality.
- Hybrid retrieval + reranking is often best default for enterprise RAG.
- Evaluate with both retrieval metrics and downstream answer outcomes.
- Operate vector indexes with explicit SLOs, refresh policy, and access controls.
