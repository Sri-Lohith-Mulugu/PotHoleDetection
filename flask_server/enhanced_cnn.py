import torch
import torch.nn as nn
from torchvision.transforms import ToTensor, Normalize, Compose
from PIL import Image
import io
import os

# Device Configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define CNN Model
class EnhancedCNN(nn.Module):
    def __init__(self):
        super(EnhancedCNN, self).__init__()
        self.conv1 = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.conv2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.conv3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.conv4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.fc1 = nn.Sequential(
            nn.Linear(256 * 4 * 4, 512),
            nn.ReLU(),
            nn.Dropout(0.5)
        )
        self.fc2 = nn.Linear(512, 1)

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = self.conv4(x)
        x = x.view(-1, 256 * 4 * 4)
        x = self.fc1(x)
        x = self.fc2(x)
        return x

# Load Model
model_path = os.path.join(os.getcwd(), "model.pth")
model = EnhancedCNN().to(device)

if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
else:
    raise FileNotFoundError("Model file not found.")

# Define Transform
transform = Compose([
    ToTensor(),
    Normalize(mean=[0.5], std=[0.5])
])

# Prediction Function
def process_image_enhanced_cnn(image_file):
    try:
        # Read the image file
        image = Image.open(image_file).convert('L').resize((64, 64))
        image_tensor = transform(image).unsqueeze(0).to(device)

        # Predict
        output = model(image_tensor)
        confidence = torch.sigmoid(output).item()
        prediction = "Pothole" if confidence > 0.5 else "Normal"

        return {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "class_probabilities": {
                "Pothole": round(confidence, 2),
                "Normal": round(1 - confidence, 2)
            }
        }

    except Exception as e:
        raise RuntimeError(f"Error during prediction: {str(e)}")
