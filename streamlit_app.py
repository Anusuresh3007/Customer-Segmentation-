import joblib
import numpy as np
import streamlit as st

MODEL_PATH = "customer_segmentation_model.pkl"

CLUSTER_DESCRIPTIONS = {
    0: "High-income, low-spending customer",
    1: "Low-income, high-spending customer",
    2: "Medium-income, low-spending customer",
    3: "Medium-high income, high-spending customer",
    4: "Very high income, very high-spending customer",
}


@st.cache_resource
def load_model():
    model_data = joblib.load(MODEL_PATH)
    return model_data["scaler"], model_data["kmeans"]


def predict_cluster(annual_income_k: float, spending_score: float):
    scaler, kmeans = load_model()
    features = np.array([[annual_income_k, spending_score]], dtype=float)
    scaled_features = scaler.transform(features)
    cluster = int(kmeans.predict(scaled_features)[0])
    return cluster, CLUSTER_DESCRIPTIONS.get(cluster, "Customer segment identified")


st.set_page_config(page_title="Customer Segmentation App", page_icon="📊", layout="centered")
st.title("Customer Segmentation Dashboard")
st.caption("Predict a customer segment using the trained K-Means model")

with st.form("segmentation_form"):
    annual_income_k = st.number_input("Annual income (k$)", min_value=15.0, max_value=120.0, value=80.0, step=0.1, format="%.1f")
    spending_score = st.slider("Spending score", min_value=0.0, max_value=100.0, value=50.0, step=0.1)

    submitted = st.form_submit_button("Predict Segment")

if submitted:
    cluster, message = predict_cluster(annual_income_k, spending_score)

    st.success(f"Predicted cluster: {cluster}")
    st.markdown(f"### {message}")

    st.write({
        "annual_income_k": annual_income_k,
        "spending_score": spending_score,
        "cluster": cluster,
        "segment_description": message,
    })
else:
    st.info("Enter customer details and click Predict Segment.")
