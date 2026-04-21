"""
Train and compare regression models for the energy efficiency dataset.

This module mirrors the notebook workflow:
1. Load processed train/test splits
2. Train several candidate models on the training set
3. Evaluate each model on the holdout test set
4. Select the best model by mean R-squared
5. Retrain that best model on the full processed dataset
6. Save the fitted model artifact
"""

from __future__ import annotations

import argparse
import importlib
import logging
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.multioutput import MultiOutputRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.tree import DecisionTreeRegressor

def _load_optional_regressor(module_name: str, class_name: str) -> object | None:
	"""Load an optional estimator without triggering static import errors."""
	try:
		module = importlib.import_module(module_name)
	except ImportError:
		return None
	return getattr(module, class_name, None)


XGBRegressor = _load_optional_regressor("xgboost", "XGBRegressor")
LGBMRegressor = _load_optional_regressor("lightgbm", "LGBMRegressor")

try:
	from .load_data import DataLoader
	from .settings import MODELS_DIR
except ImportError:  # pragma: no cover - allows running the file directly
	from load_data import DataLoader  # type: ignore
	from settings import MODELS_DIR  # type: ignore

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

MODEL_FILENAME_PREFIX = "best_ee_model_"


def build_model_registry() -> Dict[str, object]:
	"""Create fresh model instances for each training run."""
	models: Dict[str, object] = {
		"Linear Regression": LinearRegression(),
		"Decision Tree": DecisionTreeRegressor(random_state=42),
		"Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
		"Gradient Boosting": GradientBoostingRegressor(random_state=42),
		"K-Neighbors": KNeighborsRegressor(),
		"Neural Network": MLPRegressor(random_state=42, max_iter=2000),
	}

	if XGBRegressor is not None:
		models["XGBoost"] = XGBRegressor(random_state=42)
	else:
		logger.warning("xgboost is not installed. Skipping the XGBoost model.")

	if LGBMRegressor is not None:
		models["LightGBM"] = LGBMRegressor(random_state=42, verbose=-1)
	else:
		logger.warning("lightgbm is not installed. Skipping the LightGBM model.")

	return models


def requires_multioutput_wrapper(model: object) -> bool:
	"""Return True when the estimator needs MultiOutputRegressor."""
	return not isinstance(model, (LinearRegression, MLPRegressor))


def prepare_model(model: object) -> object:
	"""Wrap single-output estimators so they can handle both targets."""
	if requires_multioutput_wrapper(model):
		return MultiOutputRegressor(model)
	return model


def safe_mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
	"""Compute MAPE with a small epsilon to avoid division by zero."""
	return float(np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100)


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
	"""Calculate the regression metrics."""
	mae = mean_absolute_error(y_true, y_pred)
	mse = mean_squared_error(y_true, y_pred)
	rmse = float(np.sqrt(mse))
	r2 = r2_score(y_true, y_pred)
	mape = safe_mape(y_true, y_pred)

	return {
		"MAE": float(mae),
		"MSE": float(mse),
		"RMSE": rmse,
		"R-squared": float(r2),
		"MAPE": mape,
	}


def evaluate_candidate_models(
	X_train: pd.DataFrame,
	X_test: pd.DataFrame,
	y_train: pd.DataFrame,
	y_test: pd.DataFrame,
) -> pd.DataFrame:
	"""Train each candidate model and evaluate it on the holdout test set."""
	logger.info("Training and validating models")
	target_names = y_train.columns.tolist()
	results: List[Dict[str, object]] = []

	for model_name, model in build_model_registry().items():
		logger.info("Training %s", model_name)
		trained_model = prepare_model(model)
		trained_model.fit(X_train, y_train.values)

		y_pred = np.asarray(trained_model.predict(X_test))
		if y_pred.ndim == 1:
			y_pred = y_pred.reshape(-1, 1)

		model_metrics: Dict[str, object] = {"Model": model_name}
		mae_scores: List[float] = []
		mse_scores: List[float] = []
		rmse_scores: List[float] = []
		r2_scores: List[float] = []
		mape_scores: List[float] = []

		for index, target_name in enumerate(target_names):
			target_metrics = calculate_metrics(y_test.values[:, index], y_pred[:, index])

			model_metrics[f"Validation MAE ({target_name})"] = target_metrics["MAE"]
			model_metrics[f"Validation MSE ({target_name})"] = target_metrics["MSE"]
			model_metrics[f"Validation RMSE ({target_name})"] = target_metrics["RMSE"]
			model_metrics[f"Validation R-squared ({target_name})"] = target_metrics["R-squared"]
			model_metrics[f"Validation MAPE ({target_name})"] = target_metrics["MAPE"]

			mae_scores.append(target_metrics["MAE"])
			mse_scores.append(target_metrics["MSE"])
			rmse_scores.append(target_metrics["RMSE"])
			r2_scores.append(target_metrics["R-squared"])
			mape_scores.append(target_metrics["MAPE"])

		model_metrics["MAE"] = mae_scores
		model_metrics["MSE"] = mse_scores
		model_metrics["RMSE"] = rmse_scores
		model_metrics["R-squared"] = r2_scores
		model_metrics["MAPE"] = mape_scores
		model_metrics["Mean MAE"] = float(np.mean(mae_scores))
		model_metrics["Mean MSE"] = float(np.mean(mse_scores))
		model_metrics["Mean RMSE"] = float(np.mean(rmse_scores))
		model_metrics["Mean R-squared"] = float(np.mean(r2_scores))
		model_metrics["Mean MAPE"] = float(np.mean(mape_scores))

		results.append(model_metrics)

	results_df = pd.DataFrame(
		results,
		columns=[
			"Model",
			"MAE",
			"MSE",
			"RMSE",
			"R-squared",
			"MAPE",
			"Mean MAE",
			"Mean MSE",
			"Mean RMSE",
			"Mean R-squared",
			"Mean MAPE",
		],
	)
	results_df = results_df.sort_values(by="Mean R-squared", ascending=False).reset_index(drop=True)

	logger.info("Model comparison complete")
	logger.info("Model performance on validation set:\n%s", results_df.to_string(index=False))
	return results_df


def retrain_best_model(
	best_model_name: str,
	X_full: pd.DataFrame,
	y_full: pd.DataFrame,
) -> object:
	"""Retrain the selected model on the full processed dataset."""
	logger.info("Retraining the best model on the full dataset: %s", best_model_name)
	fresh_model = build_model_registry()[best_model_name]
	retrained_model = prepare_model(fresh_model)
	retrained_model.fit(X_full, y_full.values)
	logger.info("Best model successfully retrained on the full dataset")
	return retrained_model


def save_model(model: object, best_model_name: str, output_dir: Path | None = None) -> Path:
	"""Persist the final fitted model."""
	model_directory = output_dir or MODELS_DIR
	model_directory.mkdir(parents=True, exist_ok=True)
	model_filename = f"{MODEL_FILENAME_PREFIX}{best_model_name.replace(' ', '_')}.pkl"
	model_path = model_directory / model_filename
	joblib.dump(model, model_path)
	logger.info("Best model saved as %s", model_path)
	return model_path


def run_training_pipeline(output_dir: Path | None = None) -> Tuple[pd.DataFrame, str, Path]:
	"""Run the workflow end to end for model comparison and training."""
	logger.info("Starting training pipeline")
	loader = DataLoader()
	X_train, X_test, y_train, y_test = loader.load_processed_data()

	results_df = evaluate_candidate_models(X_train, X_test, y_train, y_test)
	best_model_name = str(results_df.iloc[0]["Model"])
	logger.info("Best model selected: %s", best_model_name)

	X_full = pd.concat([X_train, X_test], axis=0)
	y_full = pd.concat([y_train, y_test], axis=0)
	logger.info("X_full shape: %s", X_full.shape)
	logger.info("y_full shape: %s", y_full.shape)

	retrained_best_model = retrain_best_model(best_model_name, X_full, y_full)
	model_path = save_model(retrained_best_model, best_model_name, output_dir)

	logger.info("Training pipeline completed successfully")
	return results_df, best_model_name, model_path


def main() -> None:
	"""Command-line entry point for training."""
	parser = argparse.ArgumentParser(description="Train and compare energy-efficiency regression models.")
	parser.add_argument(
		"--output-dir",
		type=Path,
		default=MODELS_DIR,
		help="Directory where the fitted model will be saved.",
	)
	args = parser.parse_args()

	run_training_pipeline(args.output_dir)


if __name__ == "__main__":
	main()
