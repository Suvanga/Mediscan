import torch
from .model import DenseNet121
from .utils import process_image
from .config import MODEL_PATH, CLASS_NAMES, CONFIDENCE_THRESHOLD

model = None
device = torch.device("cpu") 

def load_model():
    global model
    print(f"🔄 Loading model from: {MODEL_PATH}")
    try:
        # 1. Load the dictionary of weights first
        state_dict = torch.load(MODEL_PATH, map_location=device)
        
        # 2. Dynamically extract the hidden dimension from Layer 0!
        # shape[0] gives us the exact number of neurons you used in your notebook
        hidden_dim = state_dict['densenet.classifier.0.weight'].shape[0]
        print(f"🔍 Dynamically detected hidden layer size: {hidden_dim}")
        
        # 3. Initialize Model with the correct dimension
        model = DenseNet121(num_classes=len(CLASS_NAMES), hidden_dim=hidden_dim)
        
        # 4. Load weights into the model
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval() # Set to inference mode
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise e

def predict(image_bytes):
    if model is None:
        load_model()
        
    tensor = process_image(image_bytes).to(device)
    
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.sigmoid(outputs).squeeze().tolist()
        
    results = []
    for i, prob in enumerate(probabilities):
        percentage = prob * 100
        if percentage > CONFIDENCE_THRESHOLD:
            results.append({
                "disease": CLASS_NAMES[i],
                "confidence": round(percentage, 2)
            })
            
    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results