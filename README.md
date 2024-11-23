# Vehicle Damage Analyzer

An AI-powered tool for analyzing vehicle damage from photos and generating cost estimates.

## Setup Instructions

### Frontend Setup
1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup
1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python app.py
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features
- Upload and analyze vehicle damage photos
- AI-powered damage detection
- Cost estimation
- Detailed damage reports
- Dark mode support

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Python, Flask, TensorFlow
- AI: Custom trained models for vehicle and damage detection

## Development
- Frontend code is in the root directory
- Backend code is in the `backend` directory
- AI models should be placed in `backend/models`

## License
MIT