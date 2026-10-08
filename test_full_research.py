import asyncio
from backend.agents import run_full_office_research

async def main():
    print("Testing full research query...")
    query = "Scalable Multi-Agent Autonomous Coordination with Sparse Graph Attention"
    result = await run_full_office_research(query)
    
    print("\n--- RESULTS ---")
    print(f"Query: {result['query']}")
    print(f"Total Citations: {len(result['citations'])}")
    print(f"Total Gaps: {len(result['gaps'])}")
    print(f"Total Claims: {len(result['claims'])}")
    print(f"Total Reproducibility Cards: {len(result['reproducibility'])}")
    print(f"Total Contradictions: {len(result['contradictions'])}")
    
    sections = result.get('dossier_sections', [])
    print(f"Total Dossier Sections: {len(sections)}")
    total_words = 0
    for s in sections:
        words = len(s['markdown'].split())
        total_words += words
        status = "PASSED" if words >= 800 else ("METADATA" if s['part_num'] in [1, 15, 17] else "NEEDS MORE")
        print(f"Part {s['part_num']}: {words} words [{status}] - {s['title']}")
        
    print(f"\nTOTAL DOSSIER WORDS: {total_words}")
    
    # Check sample URLs in citations
    print("\nSample Primary Source Links:")
    for c in result['citations'][:6]:
        print(f"[{c.get('doc_id')}] ({c.get('platform')}) -> {c.get('url')}")

asyncio.run(main())
