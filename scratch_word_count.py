from backend.agents import build_17_part_academic_dossier

# Mock 6 academic items and 6 market items
acad = [
    {
        "chunk": {
            "doc_id": f"ARX-2026-{i:02d}",
            "title": f"Empirical Multi-Agent Coordination with Sparse Graph Attention Vol {i}",
            "authors": "Dr. Sarah Chen, Dr. Michael Marcus, et al.",
            "url": f"https://arxiv.org/abs/2601.{i:05d}",
            "platform": "arXiv Repository",
            "doi": f"10.48550/arXiv.2601.{i:05d}",
            "text": f"Rigorous multi-agent benchmark demonstrates scalable O(N) communication complexity under sparse attention graph topology with sub-10ms latency across 64 distributed nodes in trial {i}."
        }
    } for i in range(1, 7)
]

mkt = [
    {
        "chunk": {
            "doc_id": f"DOC-2026-{i:02d}",
            "title": f"Distributed Framework Architecture Specification Manual {i}",
            "authors": "Open Source Engineering Consortium",
            "url": f"https://github.com/ray-project/ray-core-{i}",
            "platform": "Official Technical Documentation",
            "doi": f"10.5281/zenodo.repo.{i:05d}",
            "text": f"Production architecture manual detailing zero-copy shared memory object store serialization, asynchronous actor task scheduling, and fault recovery under high-throughput concurrency in cluster {i}."
        }
    } for i in range(1, 7)
]

gaps = [
    {"gap_id": f"GAP-0{i}", "category": "METHOD_GAP", "priority_score": 85, "evidence_scarcity": "High", "title": f"Empirical Hardware Sizing Gap {i}"} for i in range(1, 4)
]
contradictions = [
    {"topic": "JIT vs AOT Compilation", "consensus_status": "MIXED_EVIDENCE", "divergence_reason": "Varies by task lifespan"}
]
integrity = [{"doc_id": f"REF-{i:02d}", "retraction_detected": False} for i in range(12)]

m, s = build_17_part_academic_dossier('Scalable Multi-Agent Autonomous Coordination with Sparse Graph Attention', acad, mkt, gaps, integrity, {}, [{"total_score": 88, "rating": "HIGH"}], contradictions, [])
print(f"TOTAL WORDS (WITH 12 PRIMARY SOURCES): {len(m.split())}")
for x in s:
    words = len(x['markdown'].split())
    status = "PASSED" if words >= 800 else ("NEEDS MORE" if x['part_num'] not in [1, 15, 17] else "METADATA")
    print(f"Part {x['part_num']} ({x['title']}): {words} words [{status}]")
