"""
Data loading functionality for the energy-efficiency prediction pipeline.
Handles reading raw data first, then loading feature engineering processed datasets.
"""

import logging
from pathlib import Path
from typing import Optional, Tuple

import joblib
import pandas as pd

try:
    from .settings import (
        BEST_MODEL_PATH,
        MODELS_DIR,
        PROJECT_ROOT,
        PROCESSED_DIR,
        RAW_DATA_PATH,
    )
except ImportError:  # pragma: no cover - allows running the file directly
    from settings import (  # type: ignore
        BEST_MODEL_PATH,
        MODELS_DIR,
        PROJECT_ROOT,
        PROCESSED_DIR,
        RAW_DATA_PATH,
    )

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DataLoader:
    @staticmethod
    def load_raw_data() -> pd.DataFrame:
        """
        Step 1: Load the raw energy-efficiency dataset from CSV.
        
        Args:
            file_path: Path to the CSV file. Uses default if None.
            
        Returns:
            Raw DataFrame with all data
            
        Raises:
            FileNotFoundError: If the file does not exist
            pd.errors.EmptyDataError: If the file is empty
        """
        try:
            logger.info("Loading raw data from %s", RAW_DATA_PATH)
            df = pd.read_csv(RAW_DATA_PATH)
            logger.info(f"Successfully loaded {len(df)} rows and {len(df.columns)} columns")
            return df
        except FileNotFoundError:
            logger.error("File not found: %s", RAW_DATA_PATH)
            raise
        except pd.errors.EmptyDataError:
            logger.error("File is empty: %s", RAW_DATA_PATH)
            raise

    @staticmethod
    def load_processed_data() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Step 2: Load preprocessed datasets from disk.
        
        Returns:
            Tuple of (X_train, X_test, y_train, y_test)
            
        Raises:
            FileNotFoundError: If any processed file is missing
        """
        processed_dir_candidates = []
        for candidate in (PROJECT_ROOT / "dataset" / "processed", PROCESSED_DIR):
            if candidate not in processed_dir_candidates:
                processed_dir_candidates.append(candidate)

        logger.info("Loading preprocessed datasets")
        for processed_dir in processed_dir_candidates:
            x_train_path = processed_dir / "X_train_processed.csv"
            y_train_path = processed_dir / "y_train.csv"
            x_test_path = processed_dir / "X_test.csv"
            y_test_path = processed_dir / "y_test.csv"

            if all(path.exists() for path in [x_train_path, y_train_path, x_test_path, y_test_path]):
                logger.info("Using processed files from: %s", processed_dir)
                X_train = pd.read_csv(x_train_path)
                y_train = pd.read_csv(y_train_path)
                X_test = pd.read_csv(x_test_path)
                y_test = pd.read_csv(y_test_path)

                logger.info("All datasets loaded successfully")
                return X_train, X_test, y_train, y_test

        message = (
            "Processed data files were not found in any expected location. "
            f"Looked in: {', '.join(str(path) for path in processed_dir_candidates)}"
        )
        logger.error(message)
        raise FileNotFoundError(message)

    @staticmethod
    def load_model(model_name: Optional[str] = None):
        """
        Step 3: Load a trained model from MODELS_DIR.

        Args:
            model_name: Specific model filename (e.g., "XGBoost_ee_model.pkl").
                If None, the first .pkl file in MODELS_DIR is loaded.

        Returns:
            Loaded model object.

        Raises:
            FileNotFoundError: If model file does not exist.
        """
        if model_name:
            model_path = Path(model_name)
            if not model_path.is_absolute():
                model_path = MODELS_DIR / model_name
        else:
            candidate_paths = [
                BEST_MODEL_PATH,
                *sorted(MODELS_DIR.glob("*.pkl"))
            ]

            model_path = None
            for candidate in candidate_paths:
                if candidate.exists():
                    model_path = candidate
                    break

            if model_path is None:
                raise FileNotFoundError(f"No model files found in {MODELS_DIR}")

        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")

        logger.info("Loading model from %s", model_path)
        model = joblib.load(model_path)
        logger.info("Model loaded successfully")
        return model

if __name__ == "__main__":
    # Example usage
    loader = DataLoader()
    raw_df = loader.load_raw_data()
    logger.info("Raw dataframe shape: %s", raw_df.shape)

    # Step 2 in the notebook flow (after feature engineering has run)
    try:
        X_train, X_test, y_train, y_test = loader.load_processed_data()
        logger.info("Processed X_train shape: %s", X_train.shape)
        logger.info("Processed y_train shape: %s", y_train.shape)
        logger.info("Processed X_test shape: %s", X_test.shape)
        logger.info("Processed y_test shape: %s", y_test.shape)

        # Step 3: load trained model (if available)
        model = loader.load_model()
        logger.info("Loaded model type: %s", type(model).__name__)
    except FileNotFoundError:
        logger.warning("Processed files or model not found yet. Run feature engineering/training first.")
    
    # X_train, X_test, y_train, y_test = loader.split_data(raw_df)
    # save_split_data(X_train, X_test, y_train, y_test)
