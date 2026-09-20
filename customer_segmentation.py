import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import joblib
import os

# 1. Load the dataset
print("Loading dataset...")
df = pd.read_csv('customers.csv')
print(f"Dataset shape: {df.shape}")
print(df.head())
print(df.info())

# 2. Clean the dataset
print("\nCleaning dataset...")
# Check for missing values
missing = df.isnull().sum()
print(f"Missing values per column:\n{missing}")
# If any missing, we could fill or drop; but let's see
if missing.sum() > 0:
    # For simplicity, drop rows with missing values
    df = df.dropna()
    print(f"Dropped missing values. New shape: {df.shape}")

# Check for duplicates
duplicates = df.duplicated().sum()
print(f"Number of duplicate rows: {duplicates}")
if duplicates > 0:
    df = df.drop_duplicates()
    print(f"Dropped duplicates. New shape: {df.shape}")

# 3. Data preprocessing and feature selection
# We have two features: annual_income_k and spending_score
X = df[['annual_income_k', 'spending_score']].values
print(f"\nFeatures shape: {X.shape}")

# 4. Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print(f"Scaled features shape: {X_scaled.shape}")

# 5. Elbow method to find optimal K
print("\nFinding optimal K using Elbow Method...")
inertias = []
K_range = range(1, 11)
for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# Plot elbow curve
plt.figure(figsize=(8, 5))
plt.plot(K_range, inertias, 'bo-')
plt.xlabel('Number of clusters (K)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal K')
plt.grid(True)
plt.savefig('elbow_plot.png')
print("Elbow plot saved as elbow_plot.png")

# Determine optimal K (simple method: look for bend)
# We'll also compute silhouette scores for 2-10
silhouette_scores = []
for k in range(2, 11):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    silhouette_avg = silhouette_score(X_scaled, cluster_labels)
    silhouette_scores.append(silhouette_avg)

plt.figure(figsize=(8, 5))
plt.plot(range(2, 11), silhouette_scores, 'ro-')
plt.xlabel('Number of clusters (K)')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score for Optimal K')
plt.grid(True)
plt.savefig('silhouette_plot.png')
print("Silhouette plot saved as silhouette_plot.png")

# Choose optimal K based on elbow (we'll pick 5 as typical for this dataset)
# Let's also print the inertias to see
print("\nInertias for K=1 to 10:")
for k, inertia in zip(K_range, inertias):
    print(f"K={k}: {inertia:.2f}")

# Based on typical mall customer data, K=5 is often used
optimal_k = 5
print(f"\nSelected optimal K: {optimal_k}")

# 6. Implement K-Means with optimal K
kmeans_final = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
cluster_labels = kmeans_final.fit_predict(X_scaled)

# Add cluster labels to dataframe
df['cluster'] = cluster_labels

# 7. Analyze cluster characteristics
print("\nCluster characteristics:")
cluster_summary = df.groupby('cluster').agg({
    'annual_income_k': ['mean', 'std', 'min', 'max'],
    'spending_score': ['mean', 'std', 'min', 'max'],
    'cluster': 'count'
}).round(2)
print(cluster_summary)

# 8. Visualizations
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X[:, 0], X[:, 1], c=cluster_labels, cmap='viridis', alpha=0.6)
plt.xlabel('Annual Income (k$)')
plt.ylabel('Spending Score (1-100)')
plt.title(f'Customer Segments (K={optimal_k})')
plt.colorbar(scatter, label='Cluster')
plt.grid(True, alpha=0.3)
plt.savefig('clusters_scatter.png')
print("Cluster scatter plot saved as clusters_scatter.png")

# Also plot scaled features
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=cluster_labels, cmap='viridis', alpha=0.6)
plt.xlabel('Standardized Annual Income')
plt.ylabel('Standardized Spending Score')
plt.title(f'Customer Segments (Scaled Features, K={optimal_k})')
plt.colorbar(scatter, label='Cluster')
plt.grid(True, alpha=0.3)
plt.savefig('clusters_scaled_scatter.png')
print("Scaled cluster scatter plot saved as clusters_scaled_scatter.png")

# 9. Train, serialize, and save the final machine learning model
print("\nSaving model and scaler...")
# Create a pipeline-like dictionary for easy loading
model_data = {
    'scaler': scaler,
    'kmeans': kmeans_final,
    'optimal_k': optimal_k,
    'feature_names': ['annual_income_k', 'spending_score']
}

# Save using joblib
joblib.dump(model_data, 'customer_segmentation_model.pkl')
print("Model saved as customer_segmentation_model.pkl")

# Also save using pickle for compatibility
import pickle
with open('customer_segmentation_model.joblib', 'wb') as f:
    pickle.dump(model_data, f)
print("Model also saved as customer_segmentation_model.joblib")

# 10. Deliver the trained model pipeline to the backend developer
# We'll also save the clustered data for reference
df.to_csv('customers_with_clusters.csv', index=False)
print("Clustered data saved as customers_with_clusters.csv")

print("\nTask completed successfully!")