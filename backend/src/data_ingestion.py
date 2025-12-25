import pandas as pd

def load_data():
    df = pd.read_csv("backend/data/house_data.csv")
    return df
