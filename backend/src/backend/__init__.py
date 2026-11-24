import os


def main() -> None:
    import uvicorn

    port = int(os.environ.get("BACKEND_PORT", "8000"))
    uvicorn.run("backend.main:app", host="127.0.0.1", port=port)
