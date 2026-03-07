import os
from pathlib import Path

# Base Directory: Points to "backend/"
BASE_DIR = Path(__file__).resolve().parent.parent

# Model Path (Updated for S3 download - no more "models" folder!)
MODEL_PATH = BASE_DIR / "mediscan_v1.pth"

# Model Settings
NUM_CLASSES = 15
CONFIDENCE_THRESHOLD = 5.0  # Percentage

# Class Names
CLASS_NAMES = [
    'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion', 
    'Emphysema', 'Fibrosis', 'Hernia', 'Infiltration', 'Mass', 
    'No Finding', 'Nodule', 'Pleural_Thickening', 'Pneumonia', 'Pneumothorax'
]