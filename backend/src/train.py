import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline

from .data_ingestion import load_data
from .preprocessing import preprocess_data


def train_model():
    # Load data
    df = load_data()

    # Preprocess data
    X, y, preprocessor = preprocess_data(df)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Model
    model = GradientBoostingRegressor()

    # Pipeline
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    # Train model
    pipeline.fit(X_train, y_train)

    # Save model
    joblib.dump(pipeline, "backend/models/model.pkl")
    print("✅ Model trained & saved successfully")


if __name__ == "__main__":
    train_model()
