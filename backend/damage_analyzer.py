import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

class DamageAnalyzer:
    def __init__(self):
        self.model = load_model('models/damage_detection.h5')
        self.severity_thresholds = {
            'minor': 0.3,
            'moderate': 0.6,
            'severe': 0.8
        }

    def preprocess_image(self, image_path):
        img = cv2.imread(image_path)
        img = cv2.resize(img, (224, 224))
        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = img / 255.0
        return img

    def analyze(self, image_path):
        # Preprocess image
        processed_img = self.preprocess_image(image_path)
        
        # Get model predictions
        predictions = self.model.predict(processed_img)
        
        # Process predictions to determine severity and affected areas
        severity_score = np.max(predictions)
        severity = self._determine_severity(severity_score)
        
        affected_areas = self._detect_affected_areas(image_path)
        estimated_cost = self._estimate_repair_cost(severity, affected_areas)
        
        return {
            'severity': severity,
            'affected_areas': affected_areas,
            'estimated_cost': estimated_cost,
            'confidence': float(severity_score)
        }

    def _determine_severity(self, score):
        if score >= self.severity_thresholds['severe']:
            return 'severe'
        elif score >= self.severity_thresholds['moderate']:
            return 'moderate'
        return 'minor'

    def _detect_affected_areas(self, image_path):
        # Implement segmentation to detect affected areas
        # This is a simplified example
        return ['front_bumper', 'hood']

    def _estimate_repair_cost(self, severity, areas):
        # Basic cost estimation logic
        base_costs = {
            'minor': 500,
            'moderate': 1500,
            'severe': 3000
        }
        return base_costs[severity] * len(areas)

def analyze_damage(image_path):
    analyzer = DamageAnalyzer()
    return analyzer.analyze(image_path)