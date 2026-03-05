from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from .services import load_model, predict
from .config import CLASS_NAMES

@asynccontextmanager
async def lifespan(app: FastAPI):
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