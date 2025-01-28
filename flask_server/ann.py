import torch
from PIL import Image
import torchvision.transforms as transforms
import torch.nn as nn

# Define the model architecture
class NeuralNetwork(nn.Module):
    def __init__(self, input_size):
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, 32)
        self.fc2 = nn.Linear(32, 16)
        self.fc3 = nn.Linear(16, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.sigmoid(self.fc3(x))
        return x

# Load the model once
input_size = 400  # Based on your model's input size (20x20 flattened)
model = NeuralNetwork(input_size)
model.load_state_dict(torch.load('model2.pth'))
model.eval()  # Set the model to evaluation mode

# Define the transformation for image preprocessing
transform = transforms.Compose([
    transforms.Resize((20, 20)),  # Resize to the size expected by the model
    transforms.Grayscale(num_output_channels=1),  # Convert image to grayscale (1 channel)
    transforms.ToTensor(),  # Convert image to tensor
    transforms.Normalize(mean=[0.485], std=[0.229])  # Normalize image
])

# Function to process image and predict result
def process_image_ann(image):
    try:
        # Open the image file using PIL
        image = Image.open(image)

        # Apply the transformations to the image
        image = transform(image).unsqueeze(0)  # Add batch dimension
        image = image.view(-1, 400)  # Flatten the image to match input size

        # Perform inference (prediction) without tracking gradients
        with torch.no_grad():
            output = model(image)

        # Apply sigmoid for binary classification
        output = torch.sigmoid(output)

        # Get the prediction label and probability
        pothole_prob = output.item()  # Since it's a single output, get the scalar value
        normal_prob = 1 - pothole_prob  # For binary classification, the second class is the complement

        # Determine the prediction label
        prediction = "Pothole" if pothole_prob > normal_prob else "Normal"

        # Return the result
        return {
            "prediction": prediction,
            "class_probabilities": {
                "Pothole": pothole_prob,
                "Normal": normal_prob
            }
        }

    except Exception as e:
        raise Exception(f"Error processing the image: {e}")
