from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(title="Customer Segmentation API")

# Load the trained model pipeline
MODEL_PATH = "customer_segmentation_model.pkl"
model_data = joblib.load(MODEL_PATH)
scaler = model_data["scaler"]
kmeans = model_data["kmeans"]


class CustomerPayload(BaseModel):
    annual_income_k: float = Field(..., gt=0)
    spending_score: float = Field(..., ge=0, le=100)


CLUSTER_DESCRIPTIONS = {
    0: "High-income, low-spending customer",
    1: "Low-income, high-spending customer",
    2: "Medium-income, low-spending customer",
    3: "Medium-high income, high-spending customer",
    4: "Very high income, very high-spending customer",
}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict")
def predict_customer_segment(payload: CustomerPayload):
    try:
        features = np.array([[payload.annual_income_k, payload.spending_score]], dtype=float)
        scaled_features = scaler.transform(features)
        cluster = int(kmeans.predict(scaled_features)[0])

        return {
            "cluster": cluster,
            "message": CLUSTER_DESCRIPTIONS.get(cluster, "Customer segment identified"),
            "input": {
                "annual_income_k": payload.annual_income_k,
                "spending_score": payload.spending_score,
            },
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}") from exc
