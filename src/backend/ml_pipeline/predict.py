"""
Generate predictions with a saved energy-efficiency model.

The module supports prediction from a CSV file, a pandas DataFrame, or the
processed test split as a fallback when no new input is supplied.
"""

from __future__ import annotations

import argparse
import logging
from pathlib import Path
from typing import Optional, Tuple, Union

import numpy as np
import pandas as pd

try:
	from .load_data import DataLoader
	from .settings import PROJECT_ROOT, TARGET_COLUMNS
except ImportError:  # pragma: no cover - allows running the file directly
	from load_data import DataLoader  # type: ignore
	from settings import PROJECT_ROOT, TARGET_COLUMNS  # type: ignore

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def _split_features_and_actuals(frame: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[pd.DataFrame]]:
	"""Return feature columns and optional actual target columns from an input frame."""
	available_target_columns = [column for column in TARGET_COLUMNS if column in frame.columns]
	if not available_target_columns:
		return frame.copy(), None

	actuals = frame[available_target_columns].copy()
	features = frame.drop(columns=available_target_columns)
	return features, actuals


def load_input_data(
	input_data: Optional[Union[str, Path, pd.DataFrame]] = None,
) -> Tuple[pd.DataFrame, Optional[pd.DataFrame]]:
	"""Load prediction input and optional actual targets from a DataFrame, CSV file, or test split."""
	if isinstance(input_data, pd.DataFrame):
		return _split_features_and_actuals(input_data)

	loader = DataLoader()

	if input_data is None:
		logger.info("No input file supplied. Using the processed test split as a fallback.")
		_, X_test, _, y_test = loader.load_processed_data()
		return X_test, y_test

	input_path = Path(input_data)
	if not input_path.exists():
		raise FileNotFoundError(f"Input file not found: {input_path}")

	logger.info("Loading prediction input from %s", input_path)
	input_frame = pd.read_csv(input_path)
	return _split_features_and_actuals(input_frame)


def align_features_to_model(feature_frame: pd.DataFrame, model: object) -> pd.DataFrame:
	"""Align the feature columns to the order expected by the fitted model."""
	expected_features = list(getattr(model, "feature_names_in_", feature_frame.columns.tolist()))

	missing_features = [column for column in expected_features if column not in feature_frame.columns]
	if missing_features:
		raise ValueError(f"Missing required feature columns: {missing_features}")

	aligned_frame = feature_frame.reindex(columns=expected_features)
	return aligned_frame


def predict(
	input_data: Optional[Union[str, Path, pd.DataFrame]] = None,
	model_name: Optional[str] = None,
) -> pd.DataFrame:
	"""Run inference and return a DataFrame with actual (if available) and predicted values."""
	logger.info("Starting prediction pipeline")
	loader = DataLoader()
	model = loader.load_model(model_name)
	features, actuals = load_input_data(input_data)
	features = align_features_to_model(features, model)

	predictions = np.asarray(model.predict(features))
	if predictions.ndim == 1:
		predictions = predictions.reshape(-1, 1)

	prediction_columns = [f"{target_name}_prediction" for target_name in TARGET_COLUMNS[: predictions.shape[1]]]
	prediction_frame = pd.DataFrame(predictions, columns=prediction_columns, index=features.index)

	if actuals is not None:
		actual_columns = [column for column in TARGET_COLUMNS if column in actuals.columns][: predictions.shape[1]]
		actual_frame = actuals[actual_columns].copy()
		actual_frame.columns = [f"{column}_actual" for column in actual_columns]
		prediction_frame = pd.concat([actual_frame, prediction_frame], axis=1)

	logger.info("Prediction completed for %s rows", len(prediction_frame))
	return prediction_frame


def save_predictions(predictions: pd.DataFrame, output_path: Union[str, Path]) -> Path:
	"""Persist predictions to disk as a CSV file."""
	output_path = Path(output_path)
	output_path.parent.mkdir(parents=True, exist_ok=True)
	predictions.to_csv(output_path, index=False)
	logger.info("Predictions saved to %s", output_path)
	return output_path


def get_default_output_path() -> Path:
	"""Return the default path where prediction output should be saved."""
	return PROJECT_ROOT / "dataset" / "prediction" / "predictions.csv"


def main() -> None:
	"""Command-line entry point for prediction."""
	parser = argparse.ArgumentParser(description="Generate predictions with the trained energy-efficiency model.")
	parser.add_argument(
		"--input",
		type=Path,
		default=None,
		help="Optional CSV file containing feature rows to score.",
	)
	parser.add_argument(
		"--model-name",
		type=str,
		default=None,
		help="Optional model filename to load from the model directory.",
	)
	parser.add_argument(
		"--output",
		type=Path,
		default=None,
		help="CSV path where predictions should be written. Defaults to dataset/prediction/predictions.csv.",
	)
	args = parser.parse_args()

	prediction_frame = predict(args.input, args.model_name)
	output_path = args.output if args.output is not None else get_default_output_path()
	save_predictions(prediction_frame, output_path)


if __name__ == "__main__":
	main()
