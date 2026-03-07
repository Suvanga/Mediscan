import os
import boto3
from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from .services import load_model, predict
from .config import CLASS_NAMES

MODEL_PATH = "mediscan_v1.pth"
BUCKET_NAME = "mediscan-models-version-1"

def download_model_from_s3():
    # Only download if it doesn't already exist on the server
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading {MODEL_PATH} from S3...")
        # Explicitly setting the region where your bucket lives
        s3 = boto3.client('s3', region_name='us-west-2') 
        s3.download_file(BUCKET_NAME, MODEL_PATH, MODEL_PATH)
        print("Download complete!")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Download the model FIRST
    download_model_from_s3()
    # Then load it into PyTorch memory
    load_model()
    yield

app = FastAPI(title="MediScan AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "healthy", "available_classes": CLASS_NAMES}

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Use JPEG or PNG.")
    
    try:
        contents = await file.read()
        prediction_results = predict(contents)
        return {
            "filename": file.filename,
            "predictions": prediction_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))