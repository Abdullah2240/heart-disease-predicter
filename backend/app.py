import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import RandomOverSampler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all domains
    allow_credentials=True,
    allow_methods=["*"],   # allow all HTTP methods
    allow_headers=["*"],   # allow all headers
)


# ---------- Load & Train Model at Startup ----------

df = pd.read_csv("processed.cleveland.data", header=None)
df[13] = (df[13] > 0).astype(int)
df.columns = ["age","sex","cp","trestbps","chol","fbs","restecg",
              "thalach","exang","oldspeak","slope","ca","thal","num"]

df = df.replace('?', np.nan)
df['ca'] = pd.to_numeric(df['ca'])
df['thal'] = pd.to_numeric(df['thal'])

# Imputer
imputer = SimpleImputer()
df.iloc[:, :-1] = imputer.fit_transform(df.iloc[:, :-1])

X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

# Scale
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Oversample
ros = RandomOverSampler()
X, y = ros.fit_resample(X, y)

# Train KNN
knn_model = KNeighborsClassifier(n_neighbors=5)
knn_model.fit(X, y)

# ---------- API Schema ----------

class HeartInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldspeak: float
    slope: float
    ca: float
    thal: float

# ---------- Prediction Endpoint ----------

@app.post("/predict")
def predict(data: HeartInput):
    input_data = np.array([[ 
        data.age, data.sex, data.cp, data.trestbps, data.chol, data.fbs,
        data.restecg, data.thalach, data.exang, data.oldspeak,
        data.slope, data.ca, data.thal
    ]])

    input_data = imputer.transform(input_data)
    input_data = scaler.transform(input_data)

    prediction = knn_model.predict(input_data)
    prob = knn_model.predict_proba(input_data)
    prob = float(prob[0][1])
    return {"prediction": int(prediction[0]), "probability": prob}
