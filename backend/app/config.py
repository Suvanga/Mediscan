import os
from pathlib import Path

# Base Directory: Points to "backend/"
BASE_DIR = Path(__file__).resolve().parent.parent

# Model Path 
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "mediscan_v1.pth"

# Model Settings
NUM_CLASSES = 15
CONFIDENCE_THRESHOLD = 5.0  # Percentage

# Class Names
CLASS_NAMES = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion', 
    'Emphysema', 'Fibrosis', 'Hernia', 'Infiltration', 'Mass', 
    'No Finding', 'Nodule', 'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]