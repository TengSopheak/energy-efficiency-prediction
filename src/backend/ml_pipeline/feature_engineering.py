"""
Feature engineering pipeline for the energy efficiency dataset.

This module mirrors the notebook workflow step by step:
1. Load the raw dataset
2. Rename the columns to descriptive names
3. Create additional multicollinearity-reduction features
4. Split the data before preprocessing to avoid leakage
5. Inspect missing values
6. Inspect outliers
7. Scale selected features
8. Select features based on correlation with the targets
9. Save processed datasets and the fitted scaler
"""

from __future__ import annotations

import logging
import importlib
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from .load_data import DataLoader
from .settings import (
    PROCESSED_DIR,
    MODELS_DIR,
    X_TRAIN_PATH,
    Y_TRAIN_PATH,
    X_TEST_PATH,
    Y_TEST_PATH,
    SCALER_PATH,
	TARGET_COLUMNS,
	NUMERICAL_COLUMNS,
	SCALE_COLUMNS,
	TEST_SIZE,
	RANDOM_STATE,
	CORRELATION_THRESHOLD
)

RENAME_MAP: Dict[str, str] = {
	# Features
	"X1": "relative_compactness",
	"X2": "surface_area",
	"X3": "wall_area",
	"X4": "roof_area",
	"X5": "overall_height",
	"X6": "orientation",
	"X7": "glazing_area",
	"X8": "glazing_distribution",
	# Targets
	"Y1": "heating_load",
	"Y2": "cooling_load",
}

logging.basicConfig(
	level=logging.INFO,
	format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

def rename_columns(df: pd.DataFrame) -> pd.DataFrame:
	"""Rename the raw columns to descriptive names."""
	logger.info("Renaming raw columns to descriptive feature names")
	renamed_df = df.rename(columns=RENAME_MAP)
	logger.info("Column renaming completed")
	return renamed_df


def create_comprehensive_features(df: pd.DataFrame) -> pd.DataFrame:
	"""Create the additional ratio-based features."""
	logger.info("Creating engineered ratio features")
	engineered_df = df.copy()

	roof_area_safe = engineered_df["roof_area"].replace(0, np.nan)

	# Surface-to-Roof ratio: helps capture multi-story and envelope structure.
	engineered_df["envelope_surface_ratio"] = engineered_df["surface_area"] / roof_area_safe

	# Wall-to-Roof ratio: helps describe thermal envelope distribution.
	engineered_df["wall_roof_ratio"] = engineered_df["wall_area"] / roof_area_safe

	# Surface-to-Volume ratio: proxy for heat-loss efficiency.
	engineered_df["surface_to_volume"] = engineered_df["surface_area"] / (
		(engineered_df["roof_area"] * engineered_df["overall_height"]).replace(0, np.nan)
	)

	# Aspect efficiency: tall and compact buildings score higher.
	engineered_df["aspect_efficiency"] = engineered_df["overall_height"] ** 2 / roof_area_safe

	logger.info(
		"Engineered features created: %s",
		[
			"envelope_surface_ratio",
			"wall_roof_ratio",
			"surface_to_volume",
			"aspect_efficiency",
		],
	)
	return engineered_df


def split_features_and_targets(
	df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
	"""Split the full dataset into features and targets."""
	logger.info("Separating features from targets")
	X = df.drop(columns=TARGET_COLUMNS)
	y = df[TARGET_COLUMNS].copy()
	return X, y


def split_train_test(
	X: pd.DataFrame,
	y: pd.DataFrame,
	test_size: float = TEST_SIZE,
	random_state: int = RANDOM_STATE,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
	"""Split the data into train and test sets before preprocessing."""
	logger.info("Splitting data into train and test sets")
	X_train, X_test, y_train, y_test = train_test_split(
		X,
		y,
		test_size=test_size,
		random_state=random_state,
	)
	logger.info("X_train shape: %s", X_train.shape)
	logger.info("X_test shape: %s", X_test.shape)
	logger.info("y_train shape: %s", y_train.shape)
	logger.info("y_test shape: %s", y_test.shape)
	return X_train, X_test, y_train, y_test


def log_missing_values(
	X_train: pd.DataFrame,
	X_test: pd.DataFrame,
	y_train: pd.DataFrame,
	y_test: pd.DataFrame,
) -> None:
	"""Log missing-value counts for every dataset split."""
	logger.info("Missing values in X_train:\n%s", X_train.isnull().sum().to_string())
	logger.info("Missing values in X_test:\n%s", X_test.isnull().sum().to_string())
	logger.info("Missing values in y_train:\n%s", y_train.isnull().sum().to_string())
	logger.info("Missing values in y_test:\n%s", y_test.isnull().sum().to_string())


def plot_outliers(X_train: pd.DataFrame, numerical_cols: List[str] = NUMERICAL_COLUMNS) -> None:
	"""Create the box plots for visual outlier inspection."""
	try:
		plt = importlib.import_module("matplotlib.pyplot")
		sns = importlib.import_module("seaborn")
	except ModuleNotFoundError as exc:
		logger.warning("Skipping outlier plots because a plotting dependency is missing: %s", exc)
		return

	logger.info("Generating outlier box plots for training features")
	plt.figure(figsize=(15, 10))

	for index, column in enumerate(numerical_cols):
		plt.subplot(2, 4, index + 1)
		sns.boxplot(data=X_train, y=column)
		plt.title(f"Box plot of {column}")

	plt.tight_layout()
	plt.show()
	logger.info("Outlier inspection plots rendered")


def scale_features(
	X_train: pd.DataFrame,
	X_test: pd.DataFrame,
	scale_columns: List[str] = SCALE_COLUMNS,
) -> Tuple[pd.DataFrame, pd.DataFrame, StandardScaler]:
	"""Fit the scaler on training data and apply it to train and test sets."""
	logger.info("Scaling selected feature columns with StandardScaler")
	scaler = StandardScaler()

	X_train_scaled = X_train.copy()
	X_test_scaled = X_test.copy()

	X_train_scaled[scale_columns] = scaler.fit_transform(X_train_scaled[scale_columns])
	X_test_scaled[scale_columns] = scaler.transform(X_test_scaled[scale_columns])

	logger.info("Feature scaling completed")
	return X_train_scaled, X_test_scaled, scaler


def select_features_by_correlation(
	X_train: pd.DataFrame,
	X_test: pd.DataFrame,
	y_train: pd.DataFrame,
	y_test: pd.DataFrame,
	threshold: float = CORRELATION_THRESHOLD,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, List[str]]:
	"""Select features whose absolute correlation with the targets exceeds the threshold."""
	logger.info("Running correlation-based feature selection")

	X_train_for_selection = X_train.copy()
	X_train_for_selection[["Y1", "Y2"]] = y_train.values

	correlation_with_targets = (
		X_train_for_selection.corr(numeric_only=True)[["Y1", "Y2"]]
		.drop(["Y1", "Y2"])
		.sort_values(by="Y1", ascending=False)
	)

	logger.info("Correlation of features with Y1 and Y2:\n%s", correlation_with_targets.to_string())

	selected_features = correlation_with_targets[abs(correlation_with_targets) > threshold].index.tolist()
	original_column_order = X_train.columns.tolist()
	selected_features_ordered = [column for column in original_column_order if column in selected_features]

	logger.info(
		"Features selected using absolute correlation > %s: %s",
		threshold,
		selected_features_ordered,
	)

	X_train_selected = X_train[selected_features_ordered].copy()
	X_test_selected = X_test[selected_features_ordered].copy()

	return X_train_selected, X_test_selected, correlation_with_targets, selected_features_ordered


def save_processed_data(
	X_train: pd.DataFrame,
	X_test: pd.DataFrame,
	y_train: pd.DataFrame,
	y_test: pd.DataFrame,
	scaler: StandardScaler,
) -> None:
	"""Persist the processed datasets and fitted scaler to disk."""
	logger.info("Saving processed datasets to %s", PROCESSED_DIR)
	PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
	MODELS_DIR.mkdir(parents=True, exist_ok=True)

	X_train.to_csv(X_TRAIN_PATH, index=False)
	y_train.to_csv(Y_TRAIN_PATH, index=False)
	X_test.to_csv(X_TEST_PATH, index=False)
	y_test.to_csv(Y_TEST_PATH, index=False)
	joblib.dump(scaler, SCALER_PATH)

	logger.info("Saved %s", X_TRAIN_PATH)
	logger.info("Saved %s", Y_TRAIN_PATH)
	logger.info("Saved %s", X_TEST_PATH)
	logger.info("Saved %s", Y_TEST_PATH)
	logger.info("Saved %s", SCALER_PATH)


def run_feature_engineering_pipeline() -> Dict[str, pd.DataFrame]:
	"""Run the full feature engineering pipeline end to end."""
	logger.info("Starting feature engineering pipeline")

	energy_df = DataLoader.load_raw_data()
	energy_df = rename_columns(energy_df)
	energy_df = create_comprehensive_features(energy_df)

	X, y = split_features_and_targets(energy_df)
	X_train, X_test, y_train, y_test = split_train_test(X, y)

	log_missing_values(X_train, X_test, y_train, y_test)
	plot_outliers(X_train)

	X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
	X_train_selected, X_test_selected, correlation_with_targets, selected_features = select_features_by_correlation(
		X_train_scaled,
		X_test_scaled,
		y_train,
		y_test,
	)

	save_processed_data(X_train_selected, X_test_selected, y_train, y_test, scaler)
	logger.info("All processed datasets saved")

	return {
		"raw_data": energy_df,
		"X_train": X_train_selected,
		"X_test": X_test_selected,
		"y_train": y_train,
		"y_test": y_test,
		"correlation_with_targets": correlation_with_targets,
		"selected_features": pd.DataFrame({"selected_feature": selected_features}),
	}


if __name__ == "__main__":
	run_feature_engineering_pipeline()
