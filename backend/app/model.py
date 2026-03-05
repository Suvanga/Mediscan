import torch
import torch.nn as nn
from torchvision import models

class DenseNet121(nn.Module):
    def __init__(self, num_classes=15, hidden_dim=512):
        super(DenseNet121, self).__init__()
        # Load the base model
        self.densenet = models.densenet121(weights=None)
        
        # Get the input features (1024 for DenseNet121)
        num_features = self.densenet.classifier.in_features
        
        # Recreate the exact Sequential block used during your training
        self.densenet.classifier = nn.Sequential(
            nn.Linear(num_features, hidden_dim), # Index 0
            nn.ReLU(),                           # Index 1
            nn.Dropout(0.2),                     # Index 2 (Rate doesn't matter for evaluation)
            nn.Linear(hidden_dim, num_classes)   # Index 3 (The final layer!)
        )

    def forward(self, x):
        return self.densenet(x)