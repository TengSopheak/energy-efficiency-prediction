"""
Pipeline entry point for the energy-efficiency project.

This script runs the workflow in sequence:
1. Load raw data
2. Perform feature engineering
3. Train and save the best model
"""

from __future__ import annotations

import logging

try:
    from .load_data import DataLoader
    from .feature_engineering import run_feature_engineering_pipeline
    from .train import run_training_pipeline
except ImportError:  # pragma: no cover - allows running the file directly
    from load_data import DataLoader  # type: ignore
    from feature_engineering import run_feature_engineering_pipeline  # type: ignore
    from train import run_training_pipeline  # type: ignore


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def main() -> None:
    """Run load-data, feature-engineering, and training stages end to end."""
    logger.info("Starting end-to-end ML pipeline")

    logger.info("Step 1/3: Loading raw data")
    raw_df = DataLoader.load_raw_data()
    logger.info("Raw data loaded with shape: %s", raw_df.shape)

    logger.info("Step 2/3: Running feature engineering")
    fe_outputs = run_feature_engineering_pipeline()
    logger.info(
        "Feature engineering completed. X_train shape: %s, X_test shape: %s",
        fe_outputs["X_train"].shape,
        fe_outputs["X_test"].shape,
    )

    logger.info("Step 3/3: Training model")
    _, best_model_name, model_path = run_training_pipeline()
    logger.info("Training completed. Best model: %s", best_model_name)
    logger.info("Model saved at: %s", model_path)

    logger.info("Pipeline completed successfully")


if __name__ == "__main__":
    main()
