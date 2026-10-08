"""
Munder Difflin Research Hive — Launch Script
Runs FastAPI server on http://127.0.0.1:8000 and serves the interactive visual office.
"""
import sys
import os
import webbrowser

# Ensure utf-8 encoding on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend directory to module search path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 65)
    print("[MUNDER DIFFLIN] AUTONOMOUS RAG RESEARCH FLOOR")
    print("=" * 65)
    print("  * Boss & Employee Decorator Engine: ACTIVE")
    print("  * Vector RAG & FAISS Semantic Index: READY")
    print("  * SSE Real-time Office Event Bus: LISTENING")
    print("\n-> Launching UI at: http://127.0.0.1:8000")
    print("=" * 65 + "\n")

    # Launch browser after a brief delay so server has bound to port 8000
    import threading
    import time
    def _open_browser():
        time.sleep(1.5)
        try:
            webbrowser.open("http://127.0.0.1:8000")
        except Exception:
            pass
    threading.Thread(target=_open_browser, daemon=True).start()

    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
