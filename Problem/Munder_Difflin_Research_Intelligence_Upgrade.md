# Munder Difflin — Research Intelligence & Integrity Upgrade
## Detailed Feature, Architecture & Implementation Specification

**Document Version:** 1.0  
**Date:** October 2026  
**Project Base:** Decorator Multi-Agent Research Hive / Munder Difflin  
**Primary Direction:** Autonomous Multi-Agent Evidence Intelligence & Research Integrity System

---

# 1. Executive Summary

The current project is an autonomous multi-agent research system presented through a retro pixel-art virtual office.

The existing architecture already provides:

- A Boss/Manager agent for task decomposition.
- Specialized employee agents for academic research, market intelligence, and auditing.
- Local RAG using FAISS.
- Dense embeddings.
- Cross-Encoder reranking.
- FastAPI backend.
- Server-Sent Events (SSE) for real-time agent events.
- A 2D Canvas office simulation.
- BFS pathfinding and office-life simulation.
- A final verified research dossier.

The next stage should not focus mainly on adding more animations or more generic AI agents.

The stronger direction is to turn the system into a:

> **Locally deployable Multi-Agent Evidence Intelligence & Research Integrity Platform**

The upgraded system should help a researcher answer not only:

> "What papers exist about this topic?"

but also:

> "Which evidence should I trust, what contradicts it, what is missing, how reproducible is it, has anything been corrected or retracted, where exactly does every claim come from, and what research gap is still open?"

---

# 2. Existing Project — Current Baseline

## 2.1 Existing Objective

The current project is designed as an autonomous multi-agent web system using Python decorators and local vector RAG rather than relying on an external/ungrounded LLM.

The system uses:

- `@boss`
- `@employee`
- FAISS
- Embeddings
- Cross-Encoder reranking
- FastAPI
- SSE
- Canvas rendering
- BFS pathfinding

The current workflow is:

```text
User Query
    |
    v
Boss Agent
    |
    +-------------------+
    |                   |
    v                   v
Academic Agent      Market Agent
    |                   |
    +---------+---------+
              |
              v
        Audit Agent
              |
              v
       Final Synthesis
              |
              v
       Verified Dossier
```

The existing documentation describes a five-phase visual research choreography:

1. Task analysis in the manager cabin.
2. Team briefing.
3. Deep RAG work at desks.
4. Boardroom assembly.
5. Final dossier display.

---

# 3. Why Upgrade the Project?

The project already demonstrates technical concepts well, but a research platform needs to solve actual research workflow problems.

Important researcher pain points include:

- Too many papers to manually screen.
- Duplicate papers and different versions of the same work.
- Difficulty finding relevant evidence.
- Search systems missing useful papers.
- Citation errors and unsupported claims.
- Retracted or corrected papers entering evidence collections.
- Conflicting findings across studies.
- Poor reproducibility information.
- Missing datasets and source code.
- Difficulty identifying genuine research gaps.
- Difficulty understanding how a research field evolved.
- Publication and non-reporting bias.
- Difficulty continuously updating literature reviews.
- Difficulty auditing how an AI system reached a conclusion.

The upgrade should therefore focus on **evidence quality, traceability, research integrity, and gap discovery**.

---

# 4. Product Vision

## 4.1 Current Positioning

Current:

> Autonomous Multi-Agent Research System

## 4.2 Recommended Positioning

Recommended:

> Autonomous Multi-Agent Evidence Intelligence & Research Integrity System

## 4.3 Long-Term Vision

The platform should become a research assistant that can:

```text
Research Question
       |
       v
Search
       |
       v
Discover Literature
       |
       v
Deduplicate
       |
       v
Retrieve Evidence
       |
       v
Verify Integrity
       |
       v
Compare Findings
       |
       v
Identify Gaps
       |
       v
Synthesize
       |
       v
Produce Auditable Dossier
```

Every important claim should ideally be traceable back to evidence.

---

# 5. Core Design Principles

## 5.1 Evidence First

The system should prefer:

> Evidence -> Interpretation -> Conclusion

rather than:

> AI-generated conclusion -> search for supporting evidence

---

## 5.2 Human-in-the-Loop

The system should automate repetitive work but should not pretend that every research decision can be safely automated.

Recommended decisions:

- Include
- Exclude
- Uncertain
- Needs human review

The `UNCERTAIN` state is important.

---

## 5.3 Provenance by Default

Every important evidence item should store:

- Source.
- DOI.
- URL.
- Publication date.
- Retrieval date.
- Paper version.
- Page number when available.
- Section.
- Evidence span.
- Retrieval score.
- Reranker score.
- Integrity status.

---

## 5.4 Explainable Scores

Do not show:

> Research Quality = 87%

without explanation.

Instead show:

```text
Reproducibility Readiness: 72/100

Dataset availability       20/20
Code availability          15/20
Method details             17/20
Environment details        10/20
Experiment reproducibility 10/20
```

Every score should have a visible reason.

---

## 5.5 Conservative Scientific Language

The system should distinguish:

- Proven.
- Supported.
- Partially supported.
- Contradicted.
- Uncertain.
- Insufficient evidence.

Never convert uncertainty into certainty.

---

# 6. Proposed High-Level Architecture

```text
                           USER
                            |
                            v
                    RESEARCH QUESTION
                            |
                            v
                    +---------------+
                    |   BOSS AGENT  |
                    | Task Planner   |
                    +-------+-------+
                            |
       +--------------------+--------------------+
       |                    |                    |
       v                    v                    v
 DISCOVERY AGENT       EVIDENCE AGENT      INTEGRITY AGENT
       |                    |                    |
       |                    |                    +-- Retraction
       |                    |                    +-- Correction
       |                    |                    +-- COI/Funding
       |                    |                    +-- Methodology
       |                    |
       |                    +-- Claim extraction
       |                    +-- Evidence mapping
       |
       +-- Search APIs
       +-- Keyword search
       +-- Citation graph
       +-- Related papers
       |
       +--------------------+--------------------+
                            |
                            v
                  DEDUPLICATION ENGINE
                            |
                            v
                 HYBRID RETRIEVAL ENGINE
                  /                    \
                 /                      \
          Semantic Search          Keyword Search
             FAISS                    BM25
                 \                      /
                  \                    /
                   +--------+---------+
                            |
                            v
                   CROSS-ENCODER
                    RERANKER
                            |
                            v
                   EVIDENCE MATRIX
                            |
            +---------------+----------------+
            |               |                |
            v               v                v
      CONTRADICTION     GAP RADAR      REPRODUCIBILITY
         ENGINE           ENGINE           INSPECTOR
            |               |                |
            +---------------+----------------+
                            |
                            v
                    SYNTHESIS AGENT
                            |
                            v
                     VERIFIED DOSSIER
                            |
                            v
                 REAL-TIME OFFICE UI
```

---

# 7. Feature #1 — Research Gap Radar

## Priority

**P0 / Must Have**

## Problem

Researchers often know a broad topic but struggle to identify:

- What has already been studied.
- What remains poorly studied.
- Which datasets are missing.
- Which populations/geographies are underrepresented.
- Which methods have not been compared.
- Which limitations repeatedly appear.

A research-gap feature should not simply generate random "future work" suggestions.

It should derive gaps from evidence.

---

## 7.1 Proposed Workflow

```text
Research Topic
      |
      v
Literature Collection
      |
      v
Topic Clustering
      |
      v
Method Extraction
      |
      v
Dataset Extraction
      |
      v
Population / Domain Analysis
      |
      v
Repeated Limitations
      |
      v
Contradiction Analysis
      |
      v
Gap Candidates
      |
      v
Gap Priority Score
```

---

## 7.2 Gap Categories

### Method Gap

Example:

> Method A and Method B are widely studied, but direct comparison under the same dataset is limited.

### Dataset Gap

Example:

> Most studies use Dataset X, while real-world regional data is poorly represented.

### Geographic Gap

Example:

> Research is concentrated in North America and Europe.

### Population Gap

Example:

> A particular population is underrepresented.

### Deployment Gap

Example:

> High-performing models exist, but real-world edge deployment is rarely evaluated.

### Evaluation Gap

Example:

> Accuracy is commonly reported, but robustness under distribution shift is poorly evaluated.

### Reproducibility Gap

Example:

> Many papers report results without releasing code or complete experimental configurations.

---

## 7.3 Gap Priority Score

Recommended factors:

```text
Gap Score =
Evidence Frequency
+ Importance
+ Research Scarcity
+ Contradiction Level
+ Practical Impact
- Evidence Confidence
```

Do not expose a single score without its components.

---

# 8. Feature #2 — Claim-to-Evidence Graph

## Priority

**P0 / Must Have**

This should become one of the signature features.

---

## 8.1 Problem

A research report can contain many claims, but researchers need to know:

> "Where exactly did this statement come from?"

---

## 8.2 Architecture

```text
CLAIM
 |
 +---- Paper A
 |       |
 |       +-- Page 8
 |       +-- Table 3
 |       +-- Results
 |
 +---- Paper B
 |       |
 |       +-- Partial support
 |
 +---- Paper C
         |
         +-- Contradiction
```

---

## 8.3 Claim States

Every claim can have:

- Strongly supported.
- Supported.
- Partially supported.
- Contradicted.
- Insufficient evidence.
- Unverified.

---

## 8.4 Example

```text
Claim:
"Method X improves accuracy."

Evidence:

Paper A
Result: +12%
Support: Strong

Paper B
Result: +3%
Support: Partial

Paper C
Result: -2%
Support: Contradicts

Overall:
Evidence is mixed.
```

This is substantially more useful than a generic summary.

---

# 9. Feature #3 — Retraction & Correction Guardian

## Priority

**P0 / Must Have**

---

## 9.1 Problem

A paper can appear in search results while its scholarly status has changed.

The system should detect:

- Retracted papers.
- Expressions of concern.
- Corrections.
- Updated versions.
- Withdrawn/preprint status where identifiable.

---

## 9.2 Paper Integrity Card

```text
Paper:
Example Research Paper

Status:
ACTIVE

Retraction:
No

Correction:
Yes

Expression of Concern:
No

Version:
Publisher Version

Last Checked:
2026-10-05
```

For a retracted paper:

```text
RED FLAG

Status:
RETRACTED

Recommendation:
Do not use as primary evidence.

Reason:
Retraction metadata detected.

Original source:
[Source]
```

---

## 9.3 Recommended Data Sources

Possible sources include:

- Crossref.
- Retraction Watch data through supported scholarly metadata infrastructure.
- Publisher metadata.
- PubMed where applicable.

Do not depend on a single source.

---

# 10. Feature #4 — Reproducibility Inspector

## Priority

**P0 / Must Have**

---

## 10.1 Problem

A paper may report impressive results but provide insufficient information for another researcher to reproduce them.

---

## 10.2 Inspection Categories

```text
Dataset
Code
Model
Hyperparameters
Random Seed
Environment
Hardware
Training Procedure
Evaluation Procedure
Preprocessing
Experimental Setup
```

---

## 10.3 Example Output

```text
REPRODUCIBILITY AUDIT

Dataset available?          YES
Dataset identifier?         YES
Code available?             NO
Environment specified?      PARTIAL
Hyperparameters?            YES
Random seed?                NO
Hardware described?         YES
Preprocessing described?    PARTIAL

Reproducibility Readiness:
72/100
```

---

## 10.4 Important Rule

The system must not claim:

> "This research is irreproducible."

Better:

> "The paper does not provide enough publicly available information to fully reproduce the reported experiment."

---

# 11. Feature #5 — Contradiction & Consensus Engine

## Priority

**P0 / Must Have**

---

## 11.1 Problem

A researcher may find papers reaching different conclusions.

A simple RAG system may summarize all of them but fail to explain the disagreement.

---

## 11.2 Proposed Model

```text
                 TOPIC
                   |
          +--------+--------+
          |                 |
       SUPPORT           CONTRADICT
       Papers              Papers
          |                 |
          +--------+--------+
                   |
                   v
             EXPLANATION
```

---

## 11.3 Possible Contradiction Reasons

- Different datasets.
- Different sample sizes.
- Different evaluation metrics.
- Different experimental settings.
- Different model architectures.
- Different populations.
- Different geographic conditions.
- Different definitions.
- Different study quality.

---

## 11.4 Output

```text
Consensus:
12 studies support the finding.

Contradictory:
5 studies report no significant improvement.

Uncertain:
3 studies have insufficient evidence.

Potential reasons:
Dataset variation
Evaluation differences
Sample-size variation
```

The system should report disagreement rather than force a single conclusion.

---

# 12. Feature #6 — Systematic Review Mode

## Priority

**P1 / High**

---

## 12.1 Workflow

```text
Research Question
       |
       v
Question Structuring
       |
       v
Search Strategy
       |
       v
Database Search
       |
       v
Deduplication
       |
       v
Title/Abstract Screening
       |
       v
Full-Text Screening
       |
       v
Citation Chaining
       |
       v
Quality / Risk Assessment
       |
       v
Evidence Extraction
       |
       v
Synthesis
       |
       v
Review Report
```

---

## 12.2 Screening States

Every paper:

```text
INCLUDE
EXCLUDE
UNCERTAIN
```

`UNCERTAIN` papers should go to human review.

---

## 12.3 Inclusion Criteria Builder

Example:

```text
Year >= 2020
Language = English
Study type = Experimental
Dataset = Publicly available
Topic relevance >= threshold
```

The system should preserve the criteria in the final report.

---

# 13. Feature #7 — Citation Chaining Agent

## Priority

**P1 / High**

---

## 13.1 Problem

Keyword search can miss important papers.

---

## 13.2 Workflow

```text
Seed Paper
    |
    +---- References
    |
    +---- Cited By
    |
    +---- Related Works
    |
    +---- Authors
    |
    +---- Research Topic
```

This creates a literature graph rather than a flat list.

---

## 13.3 Agent Name

Recommended:

> Citation Scout

Responsibilities:

- Find influential references.
- Find newer papers citing a seed paper.
- Identify related work.
- Discover foundational research.
- Discover recent extensions.

---

# 14. Feature #8 — Literature Deduplication Engine

## Priority

**P1 / High**

---

## 14.1 Problem

The same work can appear through:

- DOI.
- arXiv.
- Publisher.
- Institutional repository.
- Conference version.
- Preprint.

---

## 14.2 Deduplication Strategy

Primary matching:

```text
DOI
```

Fallback:

```text
Normalized Title
+
Author Similarity
+
Publication Year
+
Venue
```

Advanced:

```text
Semantic Similarity
+
Metadata Similarity
```

---

## 14.3 Output

```text
SAME WORK DETECTED

Primary Version:
IEEE Publisher Version

Other Versions:
arXiv
Institutional Repository
Preprint

Recommendation:
Use publisher version as primary evidence.
```

---

# 15. Feature #9 — Methodology Quality Scanner

## Priority

**P1 / High**

---

## 15.1 Important Principle

Do not create one generic "paper quality" score.

The checklist should depend on study type.

---

## 15.2 Example

For randomized trials:

```text
Randomization
Allocation
Sample Size
Outcome Definition
Participant Flow
Statistical Analysis
```

For AI/ML papers:

```text
Dataset Description
Train/Test Split
Baseline Comparison
Hyperparameters
Random Seed
Evaluation Metrics
Ablation Study
External Validation
Code Availability
```

For observational research:

```text
Population
Sampling
Confounding
Missing Data
Statistical Methods
Outcome Definition
```

---

## 15.3 Reporting Guidelines

Where appropriate, the platform can map studies to established reporting frameworks such as:

- CONSORT.
- ARRIVE.
- PRISMA.
- Other domain-specific EQUATOR guidelines.

The system should identify applicable guidelines rather than blindly applying every checklist to every paper.

---

# 16. Feature #10 — Publication Bias / Evidence Imbalance Indicator

## Priority

**P2 / Advanced**

---

## 16.1 Goal

Detect suspicious imbalance in the available evidence.

Example:

```text
Positive findings: 18
Null findings:      3
Negative findings:  1

Warning:
Possible evidence imbalance.
```

---

## 16.2 Important Disclaimer

The system must not say:

> "Publication bias is proven."

Instead:

> "The observed evidence distribution may be affected by selective publication or non-reporting. Additional investigation is required."

---

# 17. Feature #11 — Conflict of Interest & Funding Analyzer

## Priority

**P1 / High**

---

## 17.1 Extract

- Funding organization.
- Sponsor.
- Author affiliation.
- Conflict-of-interest statement.
- Industry involvement.
- Data ownership statements.

---

## 17.2 Output

```text
FUNDING

Company:
Company X

Author affiliation:
2 authors affiliated with Company X

Conflict statement:
Declared

Interpretation:
Potential conflict context identified.
```

Do not automatically label a paper as biased.

The system should expose context, not make unsupported accusations.

---

# 18. Feature #12 — Living Research Monitor

## Priority

**P2 / Advanced**

---

## 18.1 Goal

Turn a completed research task into a continuously updated research watch.

---

## 18.2 Workflow

```text
Saved Research Topic
       |
       v
Scheduled Search
       |
       v
New Papers
       |
       v
Relevance Check
       |
       v
Novelty Check
       |
       v
Evidence Impact
       |
       v
Researcher Notification
```

---

## 18.3 Change Detection

The system should tell the user:

```text
Previous conclusion:
Moderate evidence

New papers:
7

New contradictory evidence:
2

Conclusion change:
Moderate -> Mixed
```

This is more useful than simply sending a list of new papers.

---

# 19. Feature #13 — Research Timeline

## Priority

**P2 / Advanced**

---

## 19.1 Visualization

```text
2019 -------- 2020 -------- 2021 -------- 2022 -------- 2023 -------- 2026
  |             |             |             |             |             |
Foundation    Method A      Dataset B     Method C      Model D      New Gap
```

---

## 19.2 Timeline Events

- Foundational papers.
- Major methods.
- Important datasets.
- Benchmark releases.
- Major improvements.
- Contradictory findings.
- Research gaps.
- Retractions/corrections.

---

# 20. Feature #14 — Why Was This Paper Selected?

## Priority

**P0 / Must Have**

Every retrieved paper should explain its selection.

Example:

```text
WHY SELECTED?

Semantic similarity:       91%
Cross-Encoder relevance:   94%
Citation importance:       High
Recency:                   High
Direct evidence:           Yes
Open access:               Yes
Integrity status:          Active
```

This creates retrieval transparency.

---

# 21. Feature #15 — Research Evidence Matrix

## Priority

**P0 / Must Have**

The final dossier should contain an evidence matrix.

Example:

| Paper | Method | Dataset | Sample | Main Result | Limitation | Evidence |
|---|---|---|---|---|---|---|
| Paper A | CNN | Dataset X | 10k | +12% | Domain limitation | Strong |
| Paper B | ViT | Dataset Y | 50k | +8% | High compute | Strong |
| Paper C | Hybrid | Dataset Z | 2k | -2% | Small sample | Moderate |

This allows researchers to compare studies without opening every PDF.

---

# 22. Feature #16 — Research Question → Search Strategy Generator

## Goal

Convert a natural-language research question into a structured search plan.

---

## Example

User:

> "I want recent research on edge AI for agriculture."

System generates:

```text
Core terms:
edge AI
edge computing
on-device inference

Synonyms:
TinyML
embedded ML
resource-constrained inference

Domain:
agriculture
crop
plant disease
smart farming

Potential exclusions:
old reviews
non-experimental papers
irrelevant domains
```

---

## Search Strategy

The system should create multiple query variants rather than relying on one query.

---

# 23. Web Research & Scholarly Data Layer

## Recommended Principle

Do not build the system around uncontrolled web scraping.

Use:

```text
Structured Scholarly APIs
        |
        v
Open Repositories
        |
        v
Official Publisher Pages
        |
        v
Targeted Web Crawling
```

---

## 23.1 OpenAlex

Potential uses:

- Works.
- Authors.
- Institutions.
- Sources.
- Topics.
- Citations.
- Research relationships.

---

## 23.2 Crossref

Potential uses:

- DOI metadata.
- Publication information.
- Funding metadata.
- Licensing.
- Author identifiers.
- Post-publication updates.
- Retraction/correction-related metadata.

---

## 23.3 PubMed

Potential uses:

- Biomedical literature.
- Article metadata.
- Programmatic search.
- Publication identifiers.

---

## 23.4 Unpaywall

Potential use:

- Discovering legitimate open-access locations.

---

## 23.5 General Web Crawling

Use only when necessary.

Rules:

- Respect robots.txt where applicable.
- Respect website terms.
- Rate-limit requests.
- Identify the crawler.
- Cache results.
- Store source URL.
- Store retrieval timestamp.
- Avoid bypassing access controls.
- Prefer APIs when available.

---

# 24. Hybrid Retrieval Architecture

The current system uses FAISS and Cross-Encoder reranking.

The next retrieval architecture should be:

```text
                     QUERY
                       |
             +---------+---------+
             |                   |
             v                   v
      Semantic Retrieval    Keyword Retrieval
          FAISS                  BM25
             |                   |
             +---------+---------+
                       |
                       v
                Result Fusion
                       |
                       v
               Cross Encoder
                  Reranker
                       |
                       v
               Final Evidence
```

---

## Why Hybrid Search?

Semantic retrieval is strong for meaning.

Keyword retrieval is strong for:

- Exact terminology.
- Dataset names.
- Model names.
- Acronyms.
- DOI.
- Technical phrases.
- Formula-related terminology.

The combination should improve research retrieval robustness.

---

# 25. Provenance Model

Every evidence unit should store a provenance record.

Example:

```json
{
  "paper_id": "example-id",
  "doi": "10.xxxx/example",
  "source": "OpenAlex",
  "source_url": "https://example.org",
  "retrieved_at": "2026-10-05T00:00:00Z",
  "publication_date": "2026-03-01",
  "version": "publisher",
  "content_hash": "hash",
  "page": 8,
  "section": "Results",
  "evidence_span": "Relevant text...",
  "semantic_score": 0.91,
  "reranker_score": 0.94,
  "retraction_status": "active"
}
```

This creates an auditable evidence trail.

---

# 26. Recommended Agent Architecture

Current conceptual agents:

```text
Michael -> Boss
Jim     -> Academic
Kelly   -> Market
Dwight  -> Audit
```

Recommended upgraded architecture:

```text
                         BOSS
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
   DISCOVERY          EVIDENCE           INTEGRITY
     AGENT              AGENT              AGENT
        |                 |                  |
        |                 |                  +-- Retraction
        |                 |                  +-- Correction
        |                 |                  +-- COI
        |                 |                  +-- Methodology
        |                 |
        |                 +-- Claims
        |                 +-- Evidence
        |                 +-- Sources
        |
        +-- Search
        +-- Citation Graph
        +-- Related Papers
        +-- APIs
        |
        +-----------------+------------------+
                          |
                          v
                    GAP ANALYST
                          |
                +---------+---------+
                |         |         |
                v         v         v
             Method    Dataset    Deployment
               Gap       Gap        Gap
                          |
                          v
                  CONTRADICTION
                     ANALYST
                          |
                          v
                  SYNTHESIS AGENT
                          |
                          v
                  VERIFIED DOSSIER
```

---

# 27. Agent Responsibilities

## 27.1 Boss Agent

Responsibilities:

- Understand user research question.
- Build research plan.
- Assign tasks.
- Manage dependencies.
- Merge agent outputs.
- Decide when evidence is sufficient.
- Trigger human review when necessary.

---

## 27.2 Discovery Agent

Responsibilities:

- Search scholarly sources.
- Expand queries.
- Search synonyms.
- Citation chaining.
- Find related papers.
- Identify foundational and recent work.

---

## 27.3 Evidence Agent

Responsibilities:

- Extract claims.
- Extract quantitative findings.
- Identify datasets.
- Identify methodology.
- Map claims to evidence.

---

## 27.4 Integrity Agent

Responsibilities:

- Retraction detection.
- Correction detection.
- Version tracking.
- Funding extraction.
- COI extraction.
- Methodology checklist.
- Reproducibility inspection.

---

## 27.5 Gap Analyst

Responsibilities:

- Identify repeated limitations.
- Identify under-studied datasets.
- Identify method gaps.
- Identify geographic/population gaps.
- Identify evaluation gaps.
- Rank gap candidates.

---

## 27.6 Contradiction Analyst

Responsibilities:

- Compare claims.
- Detect opposing findings.
- Group supporting/contradicting papers.
- Identify possible reasons for disagreement.
- Produce consensus/uncertainty summary.

---

## 27.7 Synthesis Agent

Responsibilities:

- Build final dossier.
- Preserve uncertainty.
- Produce evidence matrix.
- Produce claim graph.
- Produce gap report.
- Produce references.
- Attach provenance.

---

# 28. Database Design

A relational database or document database can maintain metadata.

Recommended logical entities:

```text
ResearchProject
    |
    +-- ResearchQuestion
    |
    +-- SearchSession
    |
    +-- Paper
    |      |
    |      +-- Author
    |      +-- Source
    |      +-- Version
    |      +-- IntegrityStatus
    |
    +-- Evidence
    |      |
    |      +-- Claim
    |      +-- SourceLocation
    |
    +-- Gap
    |
    +-- Contradiction
    |
    +-- Audit
    |
    +-- FinalDossier
```

---

# 29. Suggested Paper Schema

```json
{
  "paper_id": "...",
  "title": "...",
  "authors": [],
  "doi": "...",
  "publication_year": 2026,
  "venue": "...",
  "abstract": "...",
  "source": "OpenAlex",
  "version": "publisher",
  "open_access": true,
  "citation_count": 100,
  "retraction_status": "active",
  "correction_status": "none",
  "funding": [],
  "conflicts_of_interest": [],
  "code_url": null,
  "dataset_url": null
}
```

---

# 30. Evidence Schema

```json
{
  "evidence_id": "...",
  "paper_id": "...",
  "claim_id": "...",
  "page": 8,
  "section": "Results",
  "text": "...",
  "evidence_type": "experimental_result",
  "semantic_score": 0.91,
  "reranker_score": 0.94,
  "support_level": "strong",
  "retrieved_at": "2026-10-05T00:00:00Z"
}
```

---

# 31. Claim Schema

```json
{
  "claim_id": "...",
  "text": "Method X improves accuracy.",
  "supporting_evidence": [],
  "contradicting_evidence": [],
  "confidence": "mixed",
  "status": "partially_supported"
}
```

---

# 32. Research Gap Schema

```json
{
  "gap_id": "...",
  "type": "dataset_gap",
  "description": "...",
  "supporting_papers": [],
  "evidence_count": 8,
  "importance": "high",
  "confidence": "moderate",
  "priority": "high"
}
```

---

# 33. User Interface Upgrade

The existing office UI should remain.

Add a research control panel.

Recommended tabs:

```text
[ OFFICE ]
[ RESEARCH ]
[ EVIDENCE ]
[ GAPS ]
[ CONTRADICTIONS ]
[ AUDIT ]
[ TIMELINE ]
[ DOSSIER ]
```

---

# 34. Research Tab

Display:

```text
Research Question
Search Strategy
Databases
Papers Found
Duplicates
Papers Screened
Included
Excluded
Uncertain
```

---

# 35. Evidence Tab

Display:

```text
Claim
Evidence
Source
Page
Support
Confidence
```

Clicking a claim should reveal its evidence.

---

# 36. Gaps Tab

Display:

```text
High Priority Gaps
------------------
1. Dataset gap
2. Evaluation gap
3. Deployment gap
4. Geographic gap

Evidence:
12 papers

Confidence:
High
```

---

# 37. Audit Tab

Display:

```text
Retractions:       0
Corrections:       2
COI flags:         3
Missing datasets:  7
Missing code:      9
Method warnings:   5
```

---

# 38. Contradictions Tab

Display:

```text
Claim A

Supporting:
12

Contradicting:
5

Uncertain:
3

Potential reasons:
- Dataset variation
- Method variation
- Sample size
```

---

# 39. Timeline Tab

Display:

```text
2019  Foundation
2020  Method A
2021  Dataset B
2022  Benchmark
2023  Method C
2024  Contradiction
2026  New research gap
```

---

# 40. Dossier Structure

The final dossier should be structured as:

```text
1. Executive Summary

2. Research Question

3. Search Strategy

4. Literature Overview

5. Evidence Matrix

6. Major Findings

7. Claim-to-Evidence Map

8. Consensus & Contradictions

9. Research Gaps

10. Reproducibility Audit

11. Research Integrity Audit

12. Funding / COI

13. Limitations

14. Recommended Future Research

15. References

16. Provenance / Audit Trail
```

---

# 41. Research Integrity Rules

The system should follow these rules.

## Rule 1

Never cite a source that was not actually retrieved.

## Rule 2

Never invent DOI, authors, results, or publication information.

## Rule 3

Never treat a retracted paper as normal evidence.

## Rule 4

Never silently remove contradictory evidence.

## Rule 5

Never convert uncertainty into certainty.

## Rule 6

Every important quantitative claim should have evidence.

## Rule 7

Scores must have explainable components.

## Rule 8

Human review should be available for uncertain decisions.

## Rule 9

Preserve original source information.

## Rule 10

Record when evidence was retrieved.

---

# 42. Web Scraping Rules

If web crawling is implemented:

### Prefer

1. Official APIs.
2. Scholarly APIs.
3. Open repositories.
4. Publisher metadata.
5. Targeted crawling.

### Avoid

- Aggressive crawling.
- Circumventing access controls.
- Ignoring robots.txt or site terms.
- Unbounded crawling.
- Repeated requests without rate limiting.

---

# 43. Recommended External Data Sources

## OpenAlex

Use for:

- Scholarly works.
- Authors.
- Institutions.
- Topics.
- Citations.
- Research graph.

## Crossref

Use for:

- DOI metadata.
- Publication metadata.
- Funding.
- Licensing.
- Author identifiers.
- Scholarly updates.

## PubMed

Use for:

- Biomedical literature.
- Programmatic literature search.

## Unpaywall

Use for:

- Open-access locations.

## Publisher Websites

Use for:

- Official article versions.
- Corrections.
- Version information.

---

# 44. Technical Stack Recommendation

## Backend

```text
Python
FastAPI
AsyncIO
SSE
Pydantic
```

## Retrieval

```text
FAISS
BM25
Cross-Encoder
Embedding Model
```

## Metadata

```text
MongoDB / PostgreSQL
```

## Caching

```text
Redis
```

Redis is optional and should only be introduced if the system requires distributed queues/caching.

## Frontend

```text
HTML
CSS
JavaScript
Canvas 2D
```

## Graph

Potential options:

```text
NetworkX
Neo4j
```

Start with NetworkX for local experimentation.

---

# 45. Queue Architecture for Scale

If many users submit research tasks:

```text
User
 |
 v
FastAPI
 |
 v
Job Queue
 |
 +---- Discovery Worker
 |
 +---- Evidence Worker
 |
 +---- Integrity Worker
 |
 +---- Gap Worker
 |
 +---- Synthesis Worker
 |
 v
Result Store
 |
 v
SSE
 |
 v
Frontend
```

Do not make one HTTP request execute the entire research process synchronously.

---

# 46. Caching Strategy

Cache:

- Paper metadata.
- Search results.
- Embeddings.
- Reranking results.
- Integrity status.
- Extracted evidence.
- Citation graph.

Store:

```text
source
retrieved_at
content_hash
version
```

This helps prevent unnecessary repeated work.

---

# 47. Testing Strategy

## Unit Tests

Test:

- DOI normalization.
- Deduplication.
- Evidence extraction.
- Score calculation.
- Retraction status parsing.
- Claim mapping.

---

## Integration Tests

Test:

```text
Query
 -> Search
 -> Retrieval
 -> Reranking
 -> Audit
 -> Synthesis
```

---

## Retrieval Evaluation

Create a manually verified benchmark:

```text
Query
Relevant papers
Non-relevant papers
Expected ranking
```

Measure:

- Precision@K.
- Recall@K.
- MRR.
- nDCG.

---

## Claim Verification Evaluation

Create:

```text
Supported claims
Contradicted claims
Unsupported claims
```

Measure classification accuracy.

---

# 48. Hallucination Evaluation

The system should be tested specifically for:

- Fake citations.
- Wrong DOI.
- Wrong author.
- Wrong publication year.
- Unsupported claims.
- Misquoted evidence.
- Incorrect numerical values.

Target behavior:

```text
If evidence is absent:

"Insufficient evidence."

NOT:

"According to research..."
```

---

# 49. Security & Reliability

Important protections:

- Validate URLs.
- Limit crawler domains.
- Prevent SSRF.
- Rate-limit APIs.
- Sanitize extracted HTML.
- Sanitize rendered markdown.
- Validate uploaded files.
- Restrict file sizes.
- Avoid executing downloaded code.
- Store secrets in environment variables.
- Log agent actions.
- Log external requests.

---

# 50. Observability

Every research job should have an ID.

Example:

```text
research_job_id:
RJ-2026-00127
```

Track:

```text
Search started
Search completed
Papers found
Deduplication completed
RAG started
Audit started
Gap analysis started
Synthesis completed
```

This is useful for debugging and reproducibility.

---

# 51. Recommended Development Roadmap

## Phase 0 — Existing System Stabilization

Before new features:

- Verify current RAG.
- Verify agent decorators.
- Verify SSE.
- Verify Canvas.
- Verify final dossier.
- Add structured logging.
- Add tests.

---

## Phase 1 — Research Integrity Core

Build:

1. Claim-to-Evidence Graph.
2. Evidence Matrix.
3. Retraction/Correction Guardian.
4. Provenance Store.
5. "Why selected?" retrieval explanation.

This is the highest-priority upgrade.

---

## Phase 2 — Better Retrieval

Build:

1. Hybrid FAISS + BM25.
2. Query expansion.
3. Citation chaining.
4. Deduplication.
5. Scholarly API connectors.

---

## Phase 3 — Research Analysis

Build:

1. Contradiction Engine.
2. Consensus Engine.
3. Reproducibility Inspector.
4. COI/Funding Analyzer.
5. Methodology Scanner.

---

## Phase 4 — Research Gap Intelligence

Build:

1. Research Gap Radar.
2. Gap classification.
3. Gap priority scoring.
4. Timeline.
5. Underrepresented dataset/domain detection.

---

## Phase 5 — Systematic Review

Build:

1. Review workspace.
2. Inclusion/exclusion criteria.
3. Screening.
4. Uncertain queue.
5. Citation chasing.
6. Evidence extraction.
7. Review synthesis.

---

## Phase 6 — Living Research

Build:

1. Saved research topics.
2. Scheduled searches.
3. New evidence detection.
4. Evidence-change detection.
5. Conclusion-change detection.
6. Notifications.

---

# 52. Feature Priority Matrix

| Feature | Value | Difficulty | Priority |
|---|---:|---:|---|
| Claim-Evidence Graph | Very High | Medium | P0 |
| Evidence Matrix | Very High | Low | P0 |
| Retraction Guardian | Very High | Medium | P0 |
| Provenance | Very High | Medium | P0 |
| Hybrid Search | Very High | Medium | P0 |
| Research Gap Radar | Very High | High | P0 |
| Why Selected | High | Low | P0 |
| Citation Chaining | High | Medium | P1 |
| Deduplication | High | Medium | P1 |
| Reproducibility Inspector | Very High | High | P1 |
| Contradiction Engine | Very High | High | P1 |
| Methodology Scanner | High | High | P1 |
| COI Analyzer | High | Medium | P1 |
| Systematic Review Mode | Very High | Very High | P1 |
| Timeline | Medium | Medium | P2 |
| Publication Bias Indicator | High | Very High | P2 |
| Living Research Monitor | Very High | Very High | P2 |

---

# 53. Recommended Final Agent Office

The virtual office can visually represent the research pipeline.

```text
                         [ BOSS CABIN ]
                              |
                      Research Planning
                              |
        +---------------------+--------------------+
        |                     |                    |
        v                     v                    v
 [DISCOVERY]             [EVIDENCE]           [INTEGRITY]
  Citation Scout         Evidence Analyst      Audit Agent
        |                     |                    |
        |                     |                    +-- Retraction
        |                     |                    +-- COI
        |                     |                    +-- Method
        |                     |
        +----------+----------+--------------------+
                   |
                   v
              [GAP LAB]
             Gap Analyst
                   |
                   v
           [CONTRADICTION]
             Analyst Room
                   |
                   v
             [BOARDROOM]
                   |
                   v
              [DOSSIER]
```

The existing office simulation becomes a visual metaphor for the actual architecture rather than merely decoration.

---

# 54. Example End-to-End Scenario

User asks:

> "What are the latest research gaps in lightweight vision models for agricultural disease detection?"

## Step 1 — Boss

Creates research plan:

```text
Academic literature
Datasets
Models
Deployment
Research gaps
```

## Step 2 — Discovery

Searches:

- OpenAlex.
- Crossref.
- Relevant domain databases.
- Citation graph.

## Step 3 — Deduplication

Finds:

```text
142 records
      |
      v
27 duplicates removed
      |
      v
115 unique works
```

## Step 4 — Retrieval

Hybrid search:

```text
Semantic + BM25
       |
       v
Cross Encoder
       |
       v
Top evidence
```

## Step 5 — Integrity

Checks:

```text
Retractions
Corrections
Funding
COI
Versions
```

## Step 6 — Evidence

Extracts:

```text
Model
Dataset
Accuracy
Latency
Hardware
Limitations
```

## Step 7 — Contradiction

Finds:

```text
Most papers:
Accuracy improvement

Contradicting:
Performance drops under domain shift
```

## Step 8 — Gap Radar

Detects:

```text
Gap 1:
Few real-world field datasets

Gap 2:
Limited cross-region validation

Gap 3:
Latency/accuracy trade-off poorly studied

Gap 4:
Limited edge-device benchmarking
```

## Step 9 — Reproducibility

Finds:

```text
Code:
8/20 available

Dataset:
11/20 available

Hardware:
14/20 described
```

## Step 10 — Final Dossier

Produces:

```text
Executive Summary
|
Literature Map
|
Evidence Matrix
|
Consensus
|
Contradictions
|
Research Gaps
|
Reproducibility Audit
|
Integrity Audit
|
Future Research Questions
|
References
|
Claim Provenance
```

---

# 55. Most Important Features to Build First

If development time is limited, implement these in this exact order:

## 1. Provenance

Every piece of evidence must be traceable.

## 2. Claim-Evidence Graph

Every major conclusion must map to evidence.

## 3. Retraction/Correction Guardian

Do not allow known problematic evidence to silently enter the final synthesis.

## 4. Hybrid Search

Improve retrieval quality.

## 5. Evidence Matrix

Give researchers a structured comparison.

## 6. Contradiction Engine

Do not hide disagreement.

## 7. Reproducibility Inspector

Identify missing code/data/method details.

## 8. Research Gap Radar

Convert literature analysis into research opportunities.

## 9. Citation Chaining

Expand beyond keyword search.

## 10. Systematic Review Mode

Turn the platform into a serious literature-review assistant.

---

# 56. What NOT to Prioritize

Avoid spending major development time on:

- More decorative animations.
- Generic chatbot functionality.
- Voice assistant.
- Random additional agents.
- Unnecessary AI-generated text.
- Generic dashboards.
- Features that do not improve research accuracy.

The current pixel-art office is already a strong differentiator.

The next differentiation should be:

> **Research reliability + evidence transparency + auditability.**

---

# 57. Final Product Definition

The final system should be described as:

> **An autonomous, locally deployable multi-agent research platform that discovers scholarly evidence, performs hybrid retrieval, verifies research integrity, maps claims to evidence, detects contradictions, evaluates reproducibility, identifies research gaps, and produces an auditable research dossier with complete provenance.**

---

# 58. Final Architecture

```text
                         USER
                           |
                           v
                  RESEARCH QUESTION
                           |
                           v
                    BOSS / PLANNER
                           |
         +-----------------+------------------+
         |                 |                  |
         v                 v                  v
     DISCOVERY          EVIDENCE          INTEGRITY
       AGENT              AGENT              AGENT
         |                 |                  |
         v                 v                  v
    Scholarly APIs     Claim Extraction   Retractions
    Citation Graph     Evidence Mapping   Corrections
    Query Expansion    Evidence Matrix    COI/Funding
         |                 |               Methodology
         +-----------------+------------------+
                           |
                           v
                     DEDUPLICATION
                           |
                           v
                    HYBRID RETRIEVAL
                    /              \
                 FAISS             BM25
                    \              /
                     \            /
                     CROSS-ENCODER
                         |
                         v
                  EVIDENCE STORE
                         |
           +-------------+-------------+
           |             |             |
           v             v             v
      CONTRADICTION   GAP RADAR   REPRODUCIBILITY
         ENGINE         ENGINE       INSPECTOR
           |             |             |
           +-------------+-------------+
                         |
                         v
                  SYNTHESIS AGENT
                         |
                         v
                 VERIFIED DOSSIER
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
          CLAIMS       GAPS       AUDIT
          GRAPH       REPORT      REPORT
             |
             v
        RESEARCH TIMELINE
             |
             v
      LIVING RESEARCH MONITOR
```

---

# 59. Success Criteria

The upgraded system should be considered successful when it can demonstrate:

### Retrieval

- Relevant papers are consistently retrieved.
- Exact technical terms are not lost.
- Citation chaining discovers useful additional evidence.

### Integrity

- Retracted/corrected records are flagged.
- Source versions are tracked.
- Evidence provenance is retained.

### Reasoning

- Claims are linked to evidence.
- Contradictory findings are surfaced.
- Uncertainty is preserved.

### Reproducibility

- Code/data availability is identified.
- Missing experimental details are surfaced.

### Research Discovery

- Repeated limitations are detected.
- Evidence-supported research gaps are generated.

### Usability

- A researcher can understand why each important paper was selected.
- A researcher can trace important conclusions to source evidence.
- A researcher can review uncertain cases manually.

### Engineering

- Agent tasks are observable.
- Research jobs are recoverable.
- Long-running tasks do not block the main HTTP request.
- External source failures do not crash the entire research job.

---

# 60. Bottom Line

The most important transformation is:

```text
CURRENT

Multi-Agent
     +
RAG
     +
Office Simulation
     =
Interesting AI Demo
```

into:

```text
UPGRADED

Multi-Agent
     +
Hybrid RAG
     +
Evidence Graph
     +
Research Integrity
     +
Contradiction Analysis
     +
Reproducibility
     +
Research Gap Detection
     +
Provenance
     +
Systematic Review
     +
Office Simulation
     =
Research Intelligence Platform
```

The retro office remains the presentation layer.

The real product becomes the **evidence intelligence and research integrity engine underneath it**.

---

# 61. Research Basis / Reference Direction

The feature recommendations in this document are based on the research problems identified in the preceding analysis, including:

- Systematic-review screening workload and automation.
- Citation and literature-search completeness.
- AI citation accuracy and literature-synthesis reliability.
- Retraction/correction detection.
- Reproducibility and data/code availability.
- Research-gap identification.
- Living systematic reviews.
- Evidence synthesis and risk-of-bias concepts.
- Scholarly metadata and citation graph infrastructure.

Recommended infrastructure/data sources for implementation:

- OpenAlex
- Crossref
- PubMed
- Unpaywall
- Publisher metadata
- EQUATOR reporting guidelines
- Retraction-related scholarly metadata

For implementation, each external source should be independently validated for its current API terms, limits, coverage, and licensing before integration.

---

# 62. Final Recommendation

Do not attempt to build every feature simultaneously.

The strongest MVP upgrade is:

```text
PHASE 1

1. Hybrid Search
2. Provenance
3. Claim-Evidence Graph
4. Evidence Matrix
5. Retraction/Correction Guardian
6. "Why Selected?" Explanation
7. Research Gap Radar
```

Then:

```text
PHASE 2

8. Citation Chaining
9. Deduplication
10. Contradiction Engine
11. Reproducibility Inspector
12. COI/Funding Analyzer
13. Methodology Scanner
```

Then:

```text
PHASE 3

14. Systematic Review Mode
15. Living Research Monitor
16. Publication Bias Indicators
17. Research Timeline
18. Continuous Evidence Updates
```

This sequence gives the project a clear technical evolution from a visually impressive multi-agent RAG demo into a credible research-assistance and evidence-auditing platform.
