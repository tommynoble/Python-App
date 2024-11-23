import tensorflow as tf
import cv2
import numpy as np

class VehicleDetector:
    def __init__(self):
        self.model = tf.keras.models.load_model('models/vehicle_recognition.h5')
        self.make_model_labels = self._load_labels()

    def _load_labels(self):
        # Load make/model labels from file
        # This is a simplified example
        return {
            0: {'make': 'Toyota', 'model': 'Camry'},
            1: {'make': 'Honda', 'model': 'Civic'},
            2: {'make': 'Range Rover', 'model': 'Sport'},
            # Add more makes/models
        }

    def preprocess_image(self, image_path):
        img = cv2.imread(image_path)
        img = cv2.resize(img, (224, 224))
        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = img / 255.0
        return img

    def detect(self, image_path):
        # Preprocess image
        processed_img = self.preprocess_image(image_path)
        
        # Get model predictions
        predictions = self.model.predict(processed_img)
        
        # Get top prediction
        top_pred_idx = np.argmax(predictions)
        confidence = float(predictions[0][top_pred_idx])
        
        # Get make/model info
        vehicle_info = self.make_model_labels[top_pred_idx]
        
        return {
            'make': vehicle_info['make'],
            'model': vehicle_info['model'],
            'year': 2023,  # This would come from a more sophisticated model
            'confidence': confidence
        }

def detect_vehicle(image_path):
    detector = VehicleDetector()
    return detector.detect(image_path)