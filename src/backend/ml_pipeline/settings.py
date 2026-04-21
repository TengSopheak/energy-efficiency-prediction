"""
Configuration settings for the energy efficiency prediction pipeline.
Centralizes all hyperparameters, file paths, and constants.
"""

from pathlib import Path
from typing import Dict, List

# Project root directory
# settings.py is in src/backend/ml_pipeline, so four parents up is the repo root.
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

DATA_DIR = PROJECT_ROOT / "dataset" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "dataset" / "processed"
MODELS_DIR = PROJECT_ROOT / "model"

# Ensure directories exist
for dir_path in [DATA_DIR, PROCESSED_DIR, MODELS_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

# File paths
RAW_DATA_PATH = DATA_DIR / "ENB2012_data.csv"
X_TRAIN_PATH = PROCESSED_DIR / "X_train_processed.csv"
Y_TRAIN_PATH = PROCESSED_DIR / "y_train.csv"
X_TEST_PATH = PROCESSED_DIR / "X_test.csv"
Y_TEST_PATH = PROCESSED_DIR / "y_test.csv"
SCALER_PATH = MODELS_DIR / "scaler.pkl"
BEST_MODEL_PATH = MODELS_DIR / "best_ee_model.pkl"

# Data split configuration
TEST_SIZE: float = 0.20
RANDOM_STATE: int = 42

# Feature engineering configuration
NUMERICAL_COLUMNS: List[str] = [
    "relative_compactness",
    "surface_area",
    "wall_area",
    "roof_area",
    "overall_height",
    "orientation",
    "glazing_area",
    "glazing_distribution",
]
CATEGORICAL_COLUMNS: List[str] = []
SCALE_COLUMNS: List[str] = [
	"relative_compactness",
	"surface_area",
	"wall_area",
	"roof_area",
	"envelope_surface_ratio",
	"wall_roof_ratio",
	"surface_to_volume",
	"aspect_efficiency",
]
TARGET_COLUMNS: List[str] = ["heating_load", "cooling_load"]

# Outlier handling configuration
OUTLIER_COLUMNS: List[str] = ['relative_compactness', 'surface_area',
                              'wall_area', 'roof_area', 'overall_height',
                              'orientation', 'glazing_area', 'glazing_distribution']

# Feature selection configuration
CORRELATION_THRESHOLD: float = 0.01

# Model configuration
MODELS_CONFIG: Dict[str, Dict] = {
    "Linear Regression": {
        "class": "sklearn.linear_model.LinearRegression",
        "params": {}
    },
    "Decision Tree": {
        "class": "sklearn.tree.DecisionTreeRegressor",
        "params": {"random_state": 42}
    },
    "Random Forest": {
        "class": "sklearn.ensemble.RandomForestRegressor",
        "params": {"n_estimators": 100, "random_state": 42}
    },
    "Gradient Boosting": {
        "class": "sklearn.ensemble.GradientBoostingRegressor",
        "params": {"random_state": 42}
    },
    "K-Neighbors": {
        "class": "sklearn.neighbors.KNeighborsRegressor",
        "params": {}
    },
    "Gaussian NB": {
        "class": "sklearn.naive_bayes.GaussianNB",
        "params": {}
    },
    "XGBoost": {
        "class": "xgboost.XGBRegressor",
        "params": {"random_state": 42}
    },
    "LightGBM": {
        "class": "lightgbm.LGBMRegressor",
        "params": {"random_state": 42, "verbose": -1}
    },
    "Neural Network": {
        "class": "sklearn.neural_network.MLPRegressor",
        "params": {"random_state": 42, "max_iter": 2000}
    }
}

# Evaluation configuration
METRICS_TO_TRACK: List[str] = [
    "mae",
    "mse",
    "rmse",
    "r2",
    "mape"
]

# Primary metric for model selection
PRIMARY_METRIC: str = "r2"
