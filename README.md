# Customer Segmentation Model

This project implements a customer segmentation model using K-Means clustering on the provided customer dataset.

## Files

- `customers.csv`: Original dataset with annual income (k$) and spending score.
- `customer_segmentation.py`: Python script that performs the entire pipeline.
- `customer_segmentation_model.pkl`: Serialized model (Pickle format).
- `customer_segmentation_model.joblib`: Serialized model (Joblib format).
- `customers_with_clusters.csv`: Original data with added cluster labels.
- `elbow_plot.png`: Elbow method plot for selecting optimal K.
- `silhouette_plot.png`: Silhouette score plot for validating clusters.
- `clusters_scatter.png`: Scatter plot of original features colored by cluster.
- `clusters_scaled_scatter.png`: Scatter plot of scaled features colored by cluster.

## Steps Performed

1. **Data Loading**: Loaded the CSV file.
2. **Data Cleaning**: Checked for missing values and duplicates (none found).
3. **Preprocessing**: Selected the two features: annual_income_k and spending_score.
4. **Feature Scaling**: Applied StandardScaler to standardize features.
5. **Optimal K Selection**: Used the Elbow Method and Silhouette Score to determine optimal number of clusters (K=5).
6. **Model Training**: Trained K-Means clustering with K=5.
7. **Cluster Analysis**: Computed summary statistics for each cluster.
8. **Visualization**: Generated scatter plots and elbow/silhouette plots.
9. **Model Persistence**: Saved the trained model and scaler for later use.
10. **Output**: Saved clustered data and model files.

## How to Use the Model

To load and use the model in a Python application:

```python
import joblib
import numpy as np

# Load the saved model
model_data = joblib.load('customer_segmentation_model.pkl')
scaler = model_data['scaler']
kmeans = model_data['kmeans']

# For new data (same features)
new_data = np.array([[annual_income, spending_score]])  # shape (1, 2)
new_data_scaled = scaler.transform(new_data)
cluster = kmeans.predict(new_data_scaled)[0]

print(f"Customer belongs to cluster: {cluster}")
```

## Cluster Characteristics

Based on the analysis, the dataset was segmented into 5 clusters:

- **Cluster 0**: High income (~97k), low spending (~28)
- **Cluster 1**: Low income (~30k), medium spending (~66)
- **Cluster 2**: Medium-high income (~82k), very low spending (~18)
- **Cluster 3**: Medium-high income (~79k), medium spending (~70)
- **Cluster 4**: Very high income (~94k), high spending (~85)

(Refer to the printed cluster summary in the script output for detailed statistics.)

## Requirements

- Python 3.x
- Libraries: pandas, numpy, scikit-learn, matplotlib, seaborn, joblib

Install with:
```bash
pip install pandas numpy scikit-learn matplotlib seaborn joblib
```

## Notes

- The model is unsupervised; cluster labels are arbitrary and may change with different random seeds.
- For production, consider saving the random state or using a deterministic initialization.
- The elbow method suggested K=5 as a good balance between inertia reduction and complexity.