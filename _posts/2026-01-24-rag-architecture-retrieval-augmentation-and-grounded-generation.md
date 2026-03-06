---
author_profile: true
categories:
- AI
- ML
date: 2026-01-24
seo_title: 'RAG Architecture: Retrieval-Augmented Generation'
seo_description: A practical deep dive into RAG system design, indexing, retrieval
  quality, grounding, and production evaluation.
tags:
- ai
- ml
- rag
- llm
- retrieval
- search
title: 'RAG Architecture: Retrieval-Augmented Generation'
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/ai-ml-series-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Better Retrieval, Better Answers
---
RAG is one of the most practical ways to make LLM answers more factual, auditable, and domain-aware.
Instead of relying only on model memory, RAG injects retrieved evidence at inference time.

Many teams think RAG is "add embeddings + query vector DB." That is not enough.
High-quality RAG is a full system with data contracts, retrieval strategy, grounding policy, evaluation, and operations.

---

## When RAG Is the Right Pattern

RAG is especially useful when:

- knowledge changes frequently
- answers must cite current internal sources
- hallucination risk must be reduced
- model fine-tuning is expensive or slow
- multiple tenants/data boundaries exist

If your problem is pure creative generation with no external knowledge dependency, RAG may add unnecessary complexity.

---

## End-to-End RAG Pipeline

A production pipeline typically includes:

1. content ingestion
2. normalization and cleaning
3. chunking and metadata extraction
4. embedding generation
5. indexing
6. retrieval
7. reranking
8. prompt assembly with context
9. grounded generation
10. output validation and logging

Weakness in any layer can dominate final answer quality.

---

## Ingestion and Data Contracts

RAG quality starts before embeddings.
Define ingestion contracts:

- source type (docs, wiki, tickets, PDFs, code)
- update frequency
- access control tags
- deprecation and deletion behavior
- schema for metadata fields

If stale or unauthorized documents enter index, downstream quality and compliance fail together.

---

## Chunking Strategy: One of the Highest-Leverage Decisions

Chunking determines retrieval granularity.

Too small:

- high lexical recall but low semantic completeness
- model sees fragments without enough context

Too large:

- noisy retrieval
- irrelevant tokens consume context window

Practical chunking rules:

- preserve semantic boundaries (heading/section/paragraph)
- keep moderate overlap where cross-boundary meaning matters
- include source metadata with each chunk
- version chunking policy because it impacts retrieval metrics

For manuals and policy documents, section-aware chunking usually beats fixed-size split.

---

## Embeddings and Index Design

Embedding model choice should match domain language.
General embeddings can miss domain-specific terms.

Index design considerations:

- ANN index type and recall-latency trade-off
- metadata filters (tenant, date, document type)
- incremental index updates
- handling hard deletions and tombstones

A fast index with poor recall is still a low-quality RAG system.

---

## Retrieval Strategy: Dense, Sparse, or Hybrid

### Dense Retrieval

Captures semantic similarity.
Works well for paraphrases and conceptual matches.

### Sparse Retrieval (BM25)

Strong for exact terms, IDs, rare keywords.

### Hybrid Retrieval

Combines both and often improves robustness.
Especially useful for enterprise content with jargon and structured identifiers.

In practice, hybrid + reranking is often the best baseline.

---

## Reranking for Precision

Initial retrieval may bring 50-200 candidates.
Rerankers (cross-encoders or high-precision scorers) narrow to top context.

Benefits:

- better context relevance
- reduced token waste
- improved answer grounding

Reranking adds latency, so measure quality gain versus budget.

---

## Prompt Grounding Policy

Prompt policy should explicitly constrain behavior:

- answer from provided context only
- cite sources used
- abstain when evidence is insufficient
- separate answer from speculation

Without explicit grounding instructions, model may mix retrieved evidence with priors.

---

## Context Window Management

Context is a scarce budget.
Key controls:

- max chunks per answer
- metadata-prioritized ordering
- duplicate/similar chunk collapse
- query rewriting for better retrieval focus

A common failure is overstuffing context and degrading model attention.

---

## Access Control and Multi-Tenant Safety

RAG must enforce retrieval-time authorization.

Required controls:

- tenant-aware filtering before retrieval output
- document-level ACL metadata
- audit logs of retrieved sources
- strict isolation tests

A single unauthorized retrieval event can be severe security incident.

---

## Evaluation: Separate Retrieval from Generation

Do not evaluate only final answer score.
Split evaluation by stage.

Retrieval evaluation:

- recall@k on gold evidence sets
- precision@k
- MRR/NDCG where relevant

Generation evaluation:

- factual correctness given retrieved context
- citation faithfulness
- abstention quality
- hallucination rate

End-to-end failure analysis becomes actionable only when metrics are layer-specific.

---

## Offline and Online Validation

Offline benchmark is necessary but insufficient.
Also test in production-like conditions:

- real user queries
- long-tail and ambiguous queries
- adversarial prompts
- noisy OCR or malformed documents

Track online KPIs:

- answer acceptance rate
- citation click-through
- human escalation rate
- time-to-resolution in support workflows

---

## Common Failure Modes

1. stale index due to weak ingestion sync
2. retrieval returning topically related but decision-irrelevant chunks
3. prompt not forcing abstain behavior
4. no reranking in noisy corpora
5. poor tenant filter enforcement
6. no monitoring for retrieval drift over time

Most failures are system-design failures, not "LLM intelligence" failures.

---

## Operational Playbook

For production RAG, define routines:

- daily index freshness check
- weekly retrieval quality sampling
- monthly prompt and chunking regression tests
- incident runbook for data leak or hallucination spike
- controlled rollout for embedding/model changes

RAG quality decays without active maintenance.

---

## Example Architecture (Support Assistant)

For an internal support bot:

- ingestion from product docs + incident runbooks + policy wiki
- hybrid retrieval (BM25 + dense)
- reranking to top 8 chunks
- strict citation requirement
- abstain if no evidence above confidence threshold
- escalate to human support with retrieved context attached

This design usually outperforms "single prompt + base LLM" approaches on factual reliability.

---

## End-to-End Code Example (Minimal RAG Pipeline in Python)

The following example shows a complete minimal flow:

- ingest documents
- chunk + metadata
- TF-IDF retrieval
- prompt assembly with citations

You can swap retrieval and generation components later (vector DB, reranker, hosted LLM).

```python
import json
from dataclasses import dataclass
from typing import List, Dict

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

@dataclass
class Chunk:
    chunk_id: str
    source: str
    text: str
    acl: str  # simple tenant/access marker

def chunk_docs(raw_docs: List[Dict], max_chars: int = 450) -> List[Chunk]:
    chunks = []
    for doc in raw_docs:
        content = doc["content"].strip()
        parts = [content[i:i + max_chars] for i in range(0, len(content), max_chars)]
        for idx, part in enumerate(parts):
            chunks.append(
                Chunk(
                    chunk_id=f'{doc["doc_id"]}-{idx}',
                    source=doc["source"],
                    text=part,
                    acl=doc["acl"],
                )
            )
    return chunks

def retrieve(query: str, chunks: List[Chunk], user_acl: str, top_k: int = 5) -> List[Chunk]:
    visible = [c for c in chunks if c.acl == user_acl]
    corpus = [c.text for c in visible]
    vec = TfidfVectorizer(stop_words="english")
    mat = vec.fit_transform(corpus)
    q = vec.transform([query])
    scores = cosine_similarity(q, mat).ravel()
    top_idx = np.argsort(scores)[::-1][:top_k]
    return [visible[i] for i in top_idx]

def build_prompt(query: str, retrieved: List[Chunk]) -> str:
    context_blocks = []
    for c in retrieved:
        context_blocks.append(f"[{c.chunk_id}] ({c.source}) {c.text}")
    context = "\n\n".join(context_blocks)
    return f"""
You are a grounded assistant.
Answer only from provided CONTEXT.
If insufficient evidence, say: "I don't have enough evidence in the provided documents."
Include citations as [chunk_id].

QUESTION:
{query}

CONTEXT:
{context}
""".strip()

# Placeholder: replace with your LLM provider call
def llm_generate(prompt: str) -> str:
    return "Example grounded answer with citation [doc-1-0]."

if __name__ == "__main__":
    raw_docs = [
        {
            "doc_id": "doc-1",
            "source": "refund_policy.md",
            "acl": "tenant_a",
            "content": "Refunds are allowed within 30 days for annual plans..."
        },
        {
            "doc_id": "doc-2",
            "source": "billing_faq.md",
            "acl": "tenant_a",
            "content": "Proration is applied when upgrading plans mid-cycle..."
        },
    ]

    chunks = chunk_docs(raw_docs)
    query = "Can I get a refund after 45 days on annual plan?"
    retrieved = retrieve(query, chunks, user_acl="tenant_a", top_k=4)
    prompt = build_prompt(query, retrieved)
    answer = llm_generate(prompt)

    print("Prompt:")
    print(prompt)
    print("\nAnswer:")
    print(answer)
```

Use this as a base skeleton, then upgrade in order: hybrid retrieval -> reranking -> evaluation harness -> monitoring.

---

## Key Takeaways

- RAG is a system architecture, not a vector search feature.
- Chunking, retrieval, reranking, and grounding policy are the highest leverage quality levers.
- Secure, permission-aware retrieval is mandatory in enterprise settings.
- Evaluate retrieval and generation separately for actionable debugging.
- Treat RAG as a continuously operated platform, not a one-time integration.

---

## Further Reading

- [Vector Databases for RAG in Production](/ai/ml/vector-databases-for-rag-in-production/)
- [Embeddings in Practice: Model Choice, Evaluation, and Lifecycle](/ai/ml/embeddings-in-practice-model-choice-evaluation-and-lifecycle/)
- [Agentic AI Fundamentals: Planning, Tools, Memory, and Control Loops](/ai/ml/agentic-ai-fundamentals-planning-tools-memory-control-loops/)
- [Building Production AI Agents: Architecture, Guardrails, and Evaluation](/ai/ml/building-production-ai-agents-architecture-guardrails-evaluation/)
