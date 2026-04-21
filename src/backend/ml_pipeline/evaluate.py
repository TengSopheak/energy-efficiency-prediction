"""
Evaluate a saved energy-efficiency model against the processed test split.

This module keeps the notebook's metric calculation logic but applies it to the
final saved model so it can be used independently from training.
"""

from __future__ import annotations

import argparse
import logging
from typing import Dict, Optional

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
	from .load_data import DataLoader
	from .settings import TARGET_COLUMNS
except ImportError:  # pragma: no cover - allows running the file directly
	from load_data import DataLoader  # type: ignore
	from settings import TARGET_COLUMNS  # type: ignore

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def safe_mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
	"""Compute MAPE while guarding against division by zero."""
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


def evaluate_saved_model(model_name: Optional[str] = None) -> pd.DataFrame:
	"""Load the saved model and evaluate it on the processed test split."""
	logger.info("Starting model evaluation")
	loader = DataLoader()
	_, X_test, _, y_test = loader.load_processed_data()
	model = loader.load_model(model_name)

	y_pred = np.asarray(model.predict(X_test))
	if y_pred.ndim == 1:
		y_pred = y_pred.reshape(-1, 1)

	target_names = list(TARGET_COLUMNS) if len(TARGET_COLUMNS) == y_pred.shape[1] else y_test.columns.tolist()
	evaluation_metrics: Dict[str, object] = {"Model": model_name or type(model).__name__}

	mae_scores = []
	mse_scores = []
	rmse_scores = []
	r2_scores = []
	mape_scores = []

	for index, target_name in enumerate(target_names):
		metrics = calculate_metrics(y_test.values[:, index], y_pred[:, index])
		evaluation_metrics[f"Validation MAE ({target_name})"] = metrics["MAE"]
		evaluation_metrics[f"Validation MSE ({target_name})"] = metrics["MSE"]
		evaluation_metrics[f"Validation RMSE ({target_name})"] = metrics["RMSE"]
		evaluation_metrics[f"Validation R-squared ({target_name})"] = metrics["R-squared"]
		evaluation_metrics[f"Validation MAPE ({target_name})"] = metrics["MAPE"]

		mae_scores.append(metrics["MAE"])
		mse_scores.append(metrics["MSE"])
		rmse_scores.append(metrics["RMSE"])
		r2_scores.append(metrics["R-squared"])
		mape_scores.append(metrics["MAPE"])

	evaluation_metrics["Mean MAE"] = float(np.mean(mae_scores))
	evaluation_metrics["Mean MSE"] = float(np.mean(mse_scores))
	evaluation_metrics["Mean RMSE"] = float(np.mean(rmse_scores))
	evaluation_metrics["Mean R-squared"] = float(np.mean(r2_scores))
	evaluation_metrics["Mean MAPE"] = float(np.mean(mape_scores))

	evaluation_df = pd.DataFrame([evaluation_metrics])
	logger.info("Evaluation completed")
	logger.info("Evaluation metrics:\n%s", evaluation_df.to_string(index=False))
	return evaluation_df


def main() -> None:
	"""Command-line entry point for evaluation."""
	parser = argparse.ArgumentParser(description="Evaluate a saved energy-efficiency model.")
	parser.add_argument(
		"--model-name",
		type=str,
		default=None,
		help="Optional model filename to load from the model directory.",
	)
	args = parser.parse_args()

	evaluate_saved_model(args.model_name)


if __name__ == "__main__":
	main()
