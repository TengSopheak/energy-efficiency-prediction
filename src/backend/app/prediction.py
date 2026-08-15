"""
Energy efficiency prediction API endpoints.

Handles model inference for heating and cooling load predictions
based on building characteristics.
"""

import logging
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

logger = logging.getLogger(__name__)
router = APIRouter()

# Configuration
MODEL_ARTIFACT_DIR = Path("../models")
MODEL_PATH = MODEL_ARTIFACT_DIR / "best_ee_model.pkl"
SCALER_PATH = MODEL_ARTIFACT_DIR / "scaler.pkl"

# Feature names for scaling and prediction
SCALE_FEATURES = [
    "relative_compactness",
    "surface_area",
    "wall_area",
    "roof_area",
    "envelope_surface_ratio",
    "wall_roof_ratio",
    "surface_to_volume",
    "aspect_efficiency",
]

FEATURE_ORDER = [
    "relative_compactness",
    "surface_area",
    "wall_area",
    "roof_area",
    "overall_height",
    "orientation",
    "glazing_area",
    "glazing_distribution",
    "envelope_surface_ratio",
    "wall_roof_ratio",
    "surface_to_volume",
    "aspect_efficiency",
]


class BuildingCharacteristics(BaseModel):
    """Input schema for building energy prediction."""

    relative_compactness: float = Field(..., gt=0, description="Building compactness ratio")
    surface_area: float = Field(..., gt=0, description="Total surface area in m²")
    wall_area: float = Field(..., gt=0, description="Wall area in m²")
    roof_area: float = Field(..., gt=0, description="Roof area in m²")
    overall_height: float = Field(..., gt=0, description="Building height in m")
    orientation: int = Field(..., ge=0, le=3, description="Orientation (0=N, 1=E, 2=S, 3=W)")
    glazing_area: float = Field(..., ge=0, description="Glazing area in m²")
    glazing_area_distribution: int = Field(..., ge=0, le=4, description="Glazing distribution (0-4)")

    @field_validator("wall_area", "roof_area")
    @classmethod
    def validate_areas(cls, v):
        """Ensure areas are reasonable (not excessively large)."""
        if v > 100000:  # 100,000 m² is ~23 acres
            raise ValueError("Building area exceeds reasonable dimensions")
        return v


class PredictionResponse(BaseModel):
    """Output schema for prediction response."""

    heating_load_prediction: float = Field(..., description="Predicted heating load in kWh/m²")
    cooling_load_prediction: float = Field(..., description="Predicted cooling load in kWh/m²")


class ArtifactManager:
    """Manages loading and validation of model artifacts."""

    _instance = None
    model = None
    scaler = None

    def __new__(cls):
        """Implement singleton pattern for artifact management."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def initialize(self) -> bool:
        """
        Load and validate model artifacts at startup.

        Returns:
            bool: True if all artifacts loaded successfully, False otherwise.
        """
        success = True

        # Load model
        if not self._load_model():
            success = False

        # Load scaler
        if not self._load_scaler():
            success = False

        return success

    def _load_model(self) -> bool:
        """Load the prediction model."""
        try:
            if not MODEL_PATH.exists():
                logger.error(f"Model file not found at {MODEL_PATH}")
                return False

            with open(MODEL_PATH, "rb") as f:
                self.model = joblib.load(f)

            logger.info("Model loaded successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to load model: {e}", exc_info=True)
            return False

    def _load_scaler(self) -> bool:
        """Load the feature scaler."""
        try:
            if not SCALER_PATH.exists():
                logger.error(f"Scaler file not found at {SCALER_PATH}")
                return False

            self.scaler = joblib.load(SCALER_PATH)

            logger.info("Scaler loaded successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to load scaler: {e}", exc_info=True)
            return False

    def is_ready(self) -> bool:
        """Check if all artifacts are loaded and ready."""
        return self.model is not None and self.scaler is not None


def compute_derived_features(data: BuildingCharacteristics) -> dict:
    """
    Compute derived features to address multicollinearity.

    These features are calculated from raw building characteristics
    to provide alternative representations of building geometry.

    Args:
        data: Building characteristics input.

    Returns:
        Dictionary with all raw and derived features.
    """
    features = {
        "relative_compactness": data.relative_compactness,
        "surface_area": data.surface_area,
        "wall_area": data.wall_area,
        "roof_area": data.roof_area,
        "overall_height": data.overall_height,
        "orientation": data.orientation,
        "glazing_area": data.glazing_area,
        "glazing_area_distribution": data.glazing_area_distribution,
    }

    # Derived features to address multicollinearity
    features["envelope_surface_ratio"] = (
        data.surface_area / data.roof_area
        if data.roof_area != 0
        else np.nan
    )
    features["wall_roof_ratio"] = (
        data.wall_area / data.roof_area
        if data.roof_area != 0
        else np.nan
    )
    features["surface_to_volume"] = (
        data.surface_area / (data.roof_area * data.overall_height)
        if data.roof_area != 0 and data.overall_height != 0
        else np.nan
    )
    features["aspect_efficiency"] = (
        (data.overall_height ** 2) / data.roof_area
        if data.roof_area != 0
        else np.nan
    )

    return features


# Initialize artifact manager at module load
_artifact_manager = ArtifactManager()

# Try to load artifacts; log warning if unsuccessful
if not _artifact_manager.initialize():
    logger.warning(
        "Model artifacts not fully loaded. Predictions will fail until artifacts are available."
    )


def get_artifact_status() -> dict:
    """Return model artifact availability for health checks."""
    return {
        "model_loaded": _artifact_manager.model is not None,
        "scaler_loaded": _artifact_manager.scaler is not None,
    }


@router.post("/predict", response_model=PredictionResponse)
def predict(data: BuildingCharacteristics) -> PredictionResponse:
    """
    Predict heating and cooling loads for a building.

    Args:
        data: Building characteristics input.

    Returns:
        PredictionResponse with heating and cooling load predictions.

    Raises:
        HTTPException: If artifacts are not loaded or prediction fails.
    """
    # Check artifact availability
    if not _artifact_manager.is_ready():
        logger.error("Attempt to predict with unavailable artifacts")
        raise HTTPException(
            status_code=503,
            detail="Prediction service is not available. Model artifacts not loaded.",
        )

    try:
        # Compute all features including derived ones
        features_dict = compute_derived_features(data)

        # Prepare DataFrame with features in scale order
        scale_df = pd.DataFrame([features_dict], columns=SCALE_FEATURES)

        # Scale features
        scaled_data = _artifact_manager.scaler.transform(scale_df)

        # Build final feature vector in model's expected order
        final_features = {}
        for i, feature in enumerate(SCALE_FEATURES):
            final_features[feature] = scaled_data[0][i]

        # Add unscaled categorical/ordinal features
        final_features["overall_height"] = data.overall_height
        final_features["orientation"] = data.orientation
        final_features["glazing_area"] = data.glazing_area
        # Model was trained with legacy feature name "glazing_distribution".
        final_features["glazing_distribution"] = data.glazing_area_distribution

        # Create DataFrame with features in the correct order
        X_df = pd.DataFrame([final_features], columns=FEATURE_ORDER)

        # Make prediction
        predictions = _artifact_manager.model.predict(X_df)

        return PredictionResponse(
            heating_load_prediction=float(predictions[0][0]),
            cooling_load_prediction=float(predictions[0][1]),
        )

    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred during prediction. Please check input values.",
        )