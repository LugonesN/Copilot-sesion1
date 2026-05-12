from fastapi import FastAPI

from app.auth.router import router as auth_router

app = FastAPI(
    title="JWT Auth API",
    description="FastAPI service implementing JWT authentication",
    version="0.1.0",
)

app.include_router(auth_router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
