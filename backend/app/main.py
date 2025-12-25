from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

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

# -------- Load Pipeline Model --------
model = joblib.load("backend/models/model.pkl")

# -------- Input Schema (Frontend Simple) --------
class HouseInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: float
    location: str   # not used directly, but kept for UI

@app.get("/")
def home():
    return {"message": "API running 🚀"}

@app.post("/predict")
def predict_price(data: HouseInput):
    try:
        # 🔥 FULL FEATURE SET (MATCH TRAINING)
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

        prediction = model.predict(input_df)[0]

        return {
            "predicted_price": round(float(prediction), 2)
        }

    except Exception as e:
        print("❌ BACKEND ERROR:", e)
        return {"error": str(e)}
