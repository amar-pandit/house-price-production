from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(
    title="House Price Prediction API",
    description="Production-ready ML API",
    version="1.0"
)

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Load Pipeline Model (SAFE PATH) --------
MODEL_PATH = os.path.join("backend", "models", "model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", e)
    model = None

# -------- Input Schema --------
class HouseInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: float
    location: str  # kept for UI / future use

@app.get("/")
def home():
    return {"message": "API running 🚀"}

@app.post("/predict")
def predict_price(data: HouseInput):

    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # 🔥 FULL FEATURE SET (MATCH TRAINING DATA)
        input_df = pd.DataFrame([{
            "sqft_living": data.area,
            "sqft_lot": data.area * 3,
            "bedrooms": data.bedrooms,
            "bathrooms": data.bathrooms,
            "floors": 1,
            "sqft_above": data.area,
            "sqft_basement": 0,
            "yr_built": 2015,
            "city": "Seattle",
            "statezip": "WA 98103"
        }])

        prediction = model.predict(input_df)

        return {
            "predicted_price": float(prediction[0])
        }

    except Exception as e:
        print("❌ BACKEND PREDICTION ERROR:", e)
        raise HTTPException(status_code=500, detail="Prediction failed")
