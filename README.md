# 🔋 Energy Efficiency Prediction

A machine learning project for predicting heating load and cooling load from building design features.
This is a multi-target regression workflow built end to end, from data exploration and feature engineering to model testing and final deployment.

The project uses:
* **NextJS** for the frontend
* **FastAPI** for the backend
* **Python** for the machine learning pipeline
* **XGBoost** as the final best model

---

## 💡 Overview

Energy use in buildings depends on several design choices, such as compactness, surface area, height, orientation, and glazing. This project studies those inputs and predicts two outputs:
* Heating load
* Cooling load

The goal is to build a clean and reusable machine learning pipeline that can:
* explore the dataset
* prepare the data correctly
* test multiple regression models
* compare the models with clear metrics
* save the best model for reuse

---
## 📂 Dataset

This project uses the Energy Efficiency Dataset from the UCI Machine Learning Repository.

* Dataset source: https://archive.ics.uci.edu/dataset/242/energy+efficiency
* Features: The dataset contains 8 input features:
  * X1: relative_compactness (Compactness ratio, surface area divided by volume)
  * X2: surface_area (Total surface area in m²)
  * X3: wall_area (Wall surface area in m²)
  * X4: roof_area (Roof surface area in m²)
  * X5: overall_height (Building height in meters)
  * X6: orientation (Building orientation, categorical values 2 to 5)
  * X7: glazing_area (Window or glazing area ratio from 0 to 0.4)
  * X8: glazing_distribution (Window distribution pattern, values 0 to 5)
* Targets: The model predicts 2 outputs:
  * Y1: heating_load (Heating energy load in kWh/m²)
  * Y2: cooling_load (Cooling energy load in kWh/m²)

---

## 🛠️ Tech Stack
* Frontend: NextJS
* Backend: FastAPI
* Machine Learning: scikit-learn, XGBoost, LightGBM, and other regression models
* Notebook Workflow: Jupyter Notebook
* Model Output: .pkl file

---

## 📓 Methodology
### 1. Exploratory Data Analysis
The first notebook focuses on understanding the dataset. This step helps identify:
* feature types
* target distribution
* relationships between variables
* possible issues such as missing values or outliers

### 2. Feature Engineering  
The feature engineering pipeline was designed carefully to keep the data clean and avoid leakage.
* Pre-processing steps
  * Load the dataset from CSV
  * Rename all columns to readable names
  * Split the data into train and test sets first, using an 80/20 split
  * Check for missing values
  * Check for outliers
  * Scale numerical features using StandardScaler()
  * Select features using absolute correlation greater than 0.01
  * Save the preprocessed train and test datasets
* Notes on preprocessing
  * No missing values were found
  * No outliers were found
  * Scaling was applied to both train and test data
  * Feature selection helped keep only useful inputs for training
  * Splitting before preprocessing helped prevent data leakage

### 3. Model Experimentation  
After preprocessing, the saved datasets were loaded and used to train 8 models:
* Linear Regression
* Decision Tree
* Random Forest
* Gradient Boosting
* K-Neighbors
* XGBoost
* LightGBM
* Neural Network

Each model was evaluated using:
* MAE Mean Absolute Error
* MSE Mean Squared Error
* RMSE Root Mean Squared Error
* R-squared
* MAPE Mean Absolute Percentage Error

### 4. Final Model Training
After comparison, the best model, XGBoost, was retrained on the full dataset and saved as a .pkl file for future use.
Model Performance (Detailed Results):

| Model                 | MAE              | MSE                | RMSE             | R-squared        | MAPE               | Mean MAE | Mean MSE | Mean RMSE | Mean R-squared | Mean MAPE |
| --------------------- | ---------------- | ------------------ | ---------------- | ---------------- | ------------------ | -------- | -------- | --------- | -------------- | --------- |
| **XGBoost**           | [0.2499, 0.4496] | [0.1394, 0.9259]   | [0.3733, 0.9622] | [0.9987, 0.9900] | [1.2365, 1.6056]   | 0.3498   | 0.5326   | 0.6678    | 0.9943         | 1.4210    |
| **LightGBM**          | [0.3112, 0.6846] | [0.1806, 1.1716]   | [0.4249, 1.0824] | [0.9983, 0.9874] | [1.4104, 2.4047]   | 0.4979   | 0.6761   | 0.7537    | 0.9928         | 1.9076    |
| **Gradient Boosting** | [0.3666, 0.9773] | [0.2362, 2.1407]   | [0.4860, 1.4631] | [0.9977, 0.9769] | [1.6768, 3.5062]   | 0.6719   | 1.1885   | 0.9746    | 0.9873         | 2.5915    |
| **Random Forest**     | [0.3511, 1.0734] | [0.2376, 2.9866]   | [0.4874, 1.7282] | [0.9977, 0.9678] | [1.4585, 3.5443]   | 0.7122   | 1.6121   | 1.1078    | 0.9827         | 2.5014    |
| **Neural Network**    | [0.6217, 1.1953] | [0.7137, 3.1219]   | [0.8448, 1.7669] | [0.9932, 0.9663] | [2.8068, 4.1018]   | 0.9085   | 1.9178   | 1.3058    | 0.9797         | 3.4543    |
| **Decision Tree**     | [0.4238, 1.1567] | [0.3849, 4.0697]   | [0.6204, 2.0173] | [0.9963, 0.9561] | [1.7402, 4.0713]   | 0.7903   | 2.2273   | 1.3189    | 0.9762         | 2.9058    |
| **Linear Regression** | [1.7824, 2.0087] | [5.1697, 7.0962]   | [2.2737, 2.6639] | [0.9504, 0.9234] | [9.3323, 8.2321]   | 1.8955   | 6.1330   | 2.4688    | 0.9369         | 8.7822    |
| **K-Neighbors**       | [2.6898, 2.4950] | [13.2094, 11.8416] | [3.6345, 3.4412] | [0.8733, 0.8722] | [12.5752, 10.0318] | 2.5924   | 12.5255  | 3.5378    | 0.8727         | 11.3035   |

**Best Model:** XGBoost was the best model overall.
It gave:
* the lowest average error values
* the highest average R-squared
* the strongest balance across both targets

**Worst Model:** K-Neighbors was the weakest model overall.
It gave:
* the highest errors
* the lowest R-squared values
* the least reliable predictions across both targets

**Other Strong Models**
* LightGBM performed very well and was the second best model
* Gradient Boosting and Random Forest also gave strong results
* Neural Network performed reasonably well, but it was not as strong as the tree-based boosting models

**Baseline Models**
* Linear Regression worked as a simple baseline, but it was clearly weaker than the ensemble models
* Decision Tree improved over Linear Regression, but it still lagged behind the boosted models

---

## ♻️ Reproducibility Notes
* The train and test split is done before scaling and feature selection
* The same preprocessing flow should be used whenever new data is added
* The saved .pkl model should be loaded for prediction, not retrained every time
* The exported Python scripts can be used to automate the workflow outside notebooks

## 💻 What This Project Shows
This project shows a complete machine learning workflow:
* dataset understanding
* clean preprocessing
* feature selection
* model comparison
* final model saving
* app-ready structure with frontend and backend support

---

## 🗂️ Repository
GitHub: https://github.com/TengSopheak/energy-efficiency-prediction
