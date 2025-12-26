# 🏠 House Price Prediction System (Production Ready)

A full-stack machine learning application that predicts residential house prices using a trained Scikit-learn pipeline.  
The project demonstrates **end-to-end ML development**, including data preprocessing, model training, API deployment with FastAPI, and a live frontend hosted on GitHub Pages.

---

## 🚀 Live Demo

- **Frontend (GitHub Pages):**  
  https://amar-pandit.github.io/house-price-production/

- **Backend API (Render):**  
  https://house-price-production.onrender.com

- **API Docs (Swagger):**  
  https://house-price-production.onrender.com/docs

> ⚠️ Note: The backend is deployed on Render Free Tier.  
> On first request after inactivity, the server may take 20–30 seconds to warm up.

---

## 🧠 Project Overview

This system predicts house prices based on:
- Property area (sqft)
- Number of bedrooms
- Number of bathrooms
- Approximate location tier

The ML model is trained using a **Scikit-learn pipeline** with:
- Data preprocessing
- Feature scaling & encoding
- Gradient Boosting Regressor

The trained model is exposed via a **FastAPI backend** and consumed by a modern **JavaScript frontend dashboard**.

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- Scikit-learn
- Pandas
- Joblib
- Uvicorn
- Render (Deployment)

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages (Hosting)

---

## 📂 Project Structure

house-price-production/
│
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI app
│ │ ├── schema.py # Input schemas
│ │ └── utils.py
│ │
│ ├── data/
│ │ └── house_data.csv # Training data
│ │
│ ├── models/
│ │ └── model.pkl # Trained ML pipeline
│ │
│ ├── src/
│ │ ├── data_ingestion.py
│ │ ├── preprocessing.py
│ │ ├── train.py
│ │ └── evaluate.py
│ │
│ └── requirements.txt
│
├── docs/
│ ├── index.html # Frontend UI
│ ├── script.js # Frontend logic
│ └── style.css
│
├── .gitignore
└── README.md


---

## 🔌 API Usage

### Endpoint
`POST /predict`

### Sample Request
```json
{
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "location": "Tier-2"
}

Sample Response
{
  "predicted_price": 407985
}


📈 Features

End-to-end ML pipeline

Production-ready FastAPI backend

Live cloud deployment

Interactive frontend dashboard

Cold-start handling for free cloud tier

Clean project structure & version control

⚠️ Render Free Tier Note

The backend runs on Render Free Tier, which may sleep after inactivity.
On the first request, the UI displays a friendly “Server warming up” message instead of an error.

🎯 Learning Outcomes

ML pipeline design

Feature engineering

Model persistence

REST API development

Frontend–backend integration

Cloud deployment (Render & GitHub Pages)

Handling real-world deployment constraints

👨‍💻 Author

Amar Kumar Pandit
Computer Science & Engineering
Machine Learning | Full-Stack Projects

📜 License

This project is for educational and demonstration purposes.

