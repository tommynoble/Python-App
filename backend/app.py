from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from damage_analyzer import analyze_damage
from vehicle_detector import detect_vehicle
from report_generator import generate_report

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)
    
    try:
        # Detect vehicle make/model
        vehicle_info = detect_vehicle(image_path)
        
        # Analyze damage
        damage_analysis = analyze_damage(image_path)
        
        # Combine results
        result = {
            **vehicle_info,
            **damage_analysis
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup uploaded file
        if os.path.exists(image_path):
            os.remove(image_path)

@app.route('/api/generate-report', methods=['POST'])
def create_report():
    data = request.json
    try:
        report_path = generate_report(data)
        return jsonify({'report_url': f'/reports/{os.path.basename(report_path)}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)