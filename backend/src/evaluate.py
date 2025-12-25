import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split

from .data_ingestion import load_data
from .preprocessing import preprocess_data


def evaluate_model():
    df = load_data()
    X, y, _ = preprocess_data(df)

    model = joblib.load("backend/models/model.pkl")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    predictions = model.predict(X_test)

    # ⚠️ squared=False ERROR FIX (see Issue-2)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    mae = mean_absolute_error(y_test, predictions)

    print(f"RMSE: {rmse}")
    print(f"MAE : {mae}")


if __name__ == "__main__":
    evaluate_model()
