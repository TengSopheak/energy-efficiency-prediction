import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from .prediction import get_artifact_status, router as prediction_router
except ImportError:
    from prediction import get_artifact_status, router as prediction_router

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