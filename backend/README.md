## Vehicle Damage Analyzer Backend

A Node.js backend service for analyzing vehicle damage using AI models.

### Directory Structure
```
backend/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── app.ts            # Express app setup
├── uploads/              # Temporary file uploads
└── models/              # AI model files
```

### Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

### API Documentation
- POST `/api/analyze` - Analyze vehicle damage from uploaded images
- POST `/api/generate-report` - Generate PDF report from analysis results