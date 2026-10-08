"""
Decorator-Driven Multi-Agent Framework
Provides specialized decorators for Autonomous Research Intelligence & Integrity:
- @boss: Executive Director, Task Decomposition & Unified Dossier Synthesis
- @discovery_agent: Scientific literature retrieval, deduplication & hybrid search (FAISS + BM25Okapi + RRF)
- @integrity_guardian: Retraction Watch, correction flags & provenance audit
- @gap_analyst: Research Gap Radar, limitation synthesis & gap priority scores
- @reproducibility_inspector: 5-factor code/dataset/hyperparameter/hardware reproducibility rubric
- @contradiction_engine: Consensus vs divergence analysis & claim-to-evidence matrix
"""
import asyncio
import inspect
from dataclasses import dataclass, field
from functools import wraps
from typing import Any, Callable, Dict, List, Optional
import time

@dataclass
class AgentEvent:
    agent_id: str
    status: str       # 'idle' | 'walking' | 'thinking' | 'retrieving' | 'auditing' | 'gaps' | 'contradictions' | 'done'
    action_log: str
    desk_id: int
    progress: float = 0.0          # Agent individual progress 0.0 - 100.0
    overall_progress: float = 0.0  # Hive overall research progress 0.0 - 100.0
    data: Optional[Dict[str, Any]] = None
    timestamp: float = field(default_factory=time.time)

class OfficeEventBus:
    """Pub/Sub event bus streaming real-time agent updates and progress percentages to connected UI frontends."""
    def __init__(self, queue_maxsize: int = 200):
        self._subscribers: List[asyncio.Queue] = []
        self._queue_maxsize = queue_maxsize

    async def emit(self, event: AgentEvent):
        for q in list(self._subscribers):
            try:
                if q.full():
                    try:
                        q.get_nowait()
                    except (asyncio.QueueEmpty, ValueError):
                        pass
                await q.put(event)
            except Exception:
                pass

    def subscribe(self) -> asyncio.Queue:
        q = asyncio.Queue(maxsize=self._queue_maxsize)
        self._subscribers.append(q)
        return q

    def unsubscribe(self, q: asyncio.Queue):
        if q in self._subscribers:
            self._subscribers.remove(q)

# Export both standard EventBus and OfficeEventBus
EventBus = OfficeEventBus
event_bus = OfficeEventBus()

@dataclass
class AgentMetadata:
    name: str
    role: str
    desk_id: int
    avatar: str
    capability: str
    func: Callable
    collection: Optional[str] = None
    is_boss: bool = False

class AgentRegistry:
    """Central registry for decorator-bound autonomous research agents."""
    def __init__(self):
        self.boss_agent: Optional[AgentMetadata] = None
        self.employees: Dict[str, AgentMetadata] = {}

    def boss(self, name_or_func: Any = None, name: Optional[str] = None, role: str = "Research Director", desk_id: int = 0, avatar: str = "👔"):
        """Decorator for executive agent orchestrating research briefs and synthesizing dossiers."""
        actual_name = name or (name_or_func if isinstance(name_or_func, str) else "The_Boss")
        def decorator(func: Callable):
            is_async = asyncio.iscoroutinefunction(func) or inspect.iscoroutinefunction(func)
            @wraps(func)
            async def wrapper(*args, **kwargs):
                if is_async:
                    return await func(*args, **kwargs)
                return func(*args, **kwargs)

            meta = AgentMetadata(
                name=actual_name, role=role, desk_id=desk_id, avatar=avatar,
                capability="synthesis", func=wrapper, is_boss=True
            )
            self.boss_agent = meta
            return wrapper

        if callable(name_or_func):
            return decorator(name_or_func)
        return decorator

    def employee(self, name_or_func: Any = None, name: Optional[str] = None, role: str = "Research Specialist",
                 desk_id: int = 1, avatar: str = "💼", capability: str = "general", collection: Optional[str] = None):
        """General decorator for specialized research employees."""
        actual_name = name or (name_or_func if isinstance(name_or_func, str) else (getattr(name_or_func, "__name__", "Employee") if callable(name_or_func) else "Employee"))
        def decorator(func: Callable):
            is_async = asyncio.iscoroutinefunction(func) or inspect.iscoroutinefunction(func)
            @wraps(func)
            async def wrapper(*args, **kwargs):
                if is_async:
                    return await func(*args, **kwargs)
                return func(*args, **kwargs)

            meta = AgentMetadata(
                name=actual_name, role=role, desk_id=desk_id, avatar=avatar,
                capability=capability, func=wrapper, collection=collection, is_boss=False
            )
            self.employees[actual_name] = meta
            return wrapper

        if callable(name_or_func):
            return decorator(name_or_func)
        return decorator

    def discovery_agent(self, name: str = "Dr_Arxiv", role: str = "Scientific Discovery Specialist",
                        desk_id: int = 1, avatar: str = "🔬", collection: Optional[str] = None):
        """Decorator for scientific discovery, deduplication and hybrid retrieval."""
        return self.employee(name=name, role=role, desk_id=desk_id, avatar=avatar,
                             capability="discovery", collection=collection)

    def integrity_guardian(self, name: str = "Vera_Audit", role: str = "Retraction Guardian & Auditor",
                           desk_id: int = 2, avatar: str = "⚖️", collection: Optional[str] = None):
        """Decorator for Retraction & Correction Guardian, COI and provenance verification."""
        return self.employee(name=name, role=role, desk_id=desk_id, avatar=avatar,
                             capability="integrity", collection=collection)

    def gap_analyst(self, name: str = "Data_Dex", role: str = "Market Intelligence & Gap Analyst",
                    desk_id: int = 3, avatar: str = "📊", collection: Optional[str] = None):
        """Decorator for Market Intelligence & Research Gap Radar."""
        return self.employee(name=name, role=role, desk_id=desk_id, avatar=avatar,
                             capability="gaps", collection=collection)

    def reproducibility_inspector(self, name: str = "Pam_Reproduce", role: str = "Reproducibility Inspector",
                                 desk_id: int = 4, avatar: str = "📋", collection: Optional[str] = None):
        """Decorator for 5-factor explainable Reproducibility Rubric (/100)."""
        return self.employee(name=name, role=role, desk_id=desk_id, avatar=avatar,
                             capability="reproducibility", collection=collection)

    def contradiction_engine(self, name: str = "Ryan_Consensus", role: str = "Contradiction & Consensus Engine",
                             desk_id: int = 5, avatar: str = "⚡", collection: Optional[str] = None):
        """Decorator for Empirical Polarity, Divergence Analysis & Claim-to-Evidence Matrix."""
        return self.employee(name=name, role=role, desk_id=desk_id, avatar=avatar,
                             capability="contradictions", collection=collection)

registry = AgentRegistry()
boss = registry.boss
employee = registry.employee
discovery_agent = registry.discovery_agent
integrity_guardian = registry.integrity_guardian
gap_analyst = registry.gap_analyst
reproducibility_inspector = registry.reproducibility_inspector
contradiction_engine = registry.contradiction_engine
