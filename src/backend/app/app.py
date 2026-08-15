from pathlib import Path

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

try:
    from .prediction import get_artifact_status, router as prediction_router
except ImportError:
    from prediction import get_artifact_status, router as prediction_router

BASE_DIR = Path(__file__).resolve().parents[1]
STATIC_DIR = BASE_DIR / "static"

# Initialize FastAPI app
app = FastAPI(title="Energy Efficiency Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include prediction routes
app.include_router(prediction_router)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    favicon_path = STATIC_DIR / "favicon.svg"
    if not favicon_path.exists():
        return JSONResponse(status_code=404, content={"detail": "Favicon not found"})
    return FileResponse(favicon_path, media_type="image/svg+xml")

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Not found",
            "path": request.url.path,
        },
    )

# Root endpoint
@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Energy Efficiency Prediction API is up and running."
    }

# Health check endpoint
@app.get("/health")
def health():
    artifact_status = get_artifact_status()
    return {
        "status": "healthy",
        "model_loaded": artifact_status["model_loaded"],
        "scaler_loaded": artifact_status["scaler_loaded"],
    }

if __name__ == "__main__":
    uvicorn.run("app:app", port=8000, reload=True)