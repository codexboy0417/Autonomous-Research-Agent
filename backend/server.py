"""
FastAPI Server: SSE Event Streaming, Research API, Document Ingestion, and Static Frontend Serving
"""
import asyncio
import json
import os
from typing import Dict, Any, List
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

try:
    from backend.decorators import event_bus, registry
    from backend.rag_engine import rag_store
    from backend.agents import run_full_office_research
except ImportError:
    from decorators import event_bus, registry
    from rag_engine import rag_store
    from agents import run_full_office_research

app = FastAPI(title="Munder Difflin Research Hive", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

class ResearchRequest(BaseModel):
    query: str

class IngestRequest(BaseModel):
    doc_id: str
    title: str
    content: str
    collection: str = "academic_papers"

# ─────────────────────────────────────────────────────────────────────────────
# 1. Server-Sent Events (SSE) Endpoint for Real-time UI updates
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/office/events")
async def stream_office_events(request: Request):
    """Pushes agent movements, thoughts, and retrieval logs to the UI in real time."""
    async def event_generator():
        queue = event_bus.subscribe()
        try:
            while True:
                # Check client disconnect
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=20.0)
                    payload = {
                        "agent_id": event.agent_id,
                        "status": event.status,
                        "action_log": event.action_log,
                        "desk_id": event.desk_id,
                        "progress": event.progress,
                        "overall_progress": event.overall_progress,
                        "data": event.data,
                        "timestamp": event.timestamp
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat
                    yield ": heartbeat\n\n"
        finally:
            event_bus.unsubscribe(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ─────────────────────────────────────────────────────────────────────────────
# 2. Research Trigger & Latest Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/research")
async def trigger_research(req: ResearchRequest, background_tasks: BackgroundTasks):
    query = req.query.strip()
    if not query:
        return {"error": "Query cannot be empty"}
    # Run pipeline in background task so UI immediately sees the event stream
    background_tasks.add_task(run_full_office_research, query)
    return {"status": "started", "query": query}

@app.get("/api/research/latest")
async def get_latest_research():
    try:
        from backend import agents as ag
    except ImportError:
        import agents as ag
    if ag.latest_research_payload:
        return ag.latest_research_payload
    return {"status": "none", "message": "No research run yet"}

# ─────────────────────────────────────────────────────────────────────────────
# 3. Agents & Hive Status Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/agents")
async def list_agents():
    hive_agents = []
    if registry.boss_agent:
        b = registry.boss_agent
        hive_agents.append({
            "name": b.name,
            "role": b.role,
            "desk_id": b.desk_id,
            "avatar": b.avatar,
            "is_boss": True
        })
    for e in registry.employees.values():
        hive_agents.append({
            "name": e.name,
            "role": e.role,
            "desk_id": e.desk_id,
            "avatar": e.avatar,
            "collection": e.collection,
            "is_boss": False
        })
    return {"agents": hive_agents}

# ─────────────────────────────────────────────────────────────────────────────
# 4. Custom Document Ingestion into RAG Collections
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/documents")
@app.post("/api/ingest")
async def ingest_document(doc: IngestRequest):
    col = rag_store.get_collection(doc.collection)
    col.add_document(doc_id=doc.doc_id, title=doc.title, content=doc.content)
    return {
        "status": "ingested",
        "doc_id": doc.doc_id,
        "collection": doc.collection,
        "total_chunks_in_collection": len(col.chunks)
    }

@app.get("/api/collections")
async def list_collections():
    cols = {}
    for name, c in rag_store.collections.items():
        cols[name] = {
            "chunk_count": len(c.chunks),
            "documents": list(set(chunk.doc_id for chunk in c.chunks))
        }
    return cols

# ─────────────────────────────────────────────────────────────────────────────
# 5. Static Frontend Serving
# ─────────────────────────────────────────────────────────────────────────────

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
