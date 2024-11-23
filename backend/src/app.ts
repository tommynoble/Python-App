import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import analysisRoutes from './routes/analysis-routes';
import reportRoutes from './routes/report-routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/analyze', analysisRoutes);
app.use('/api/generate-report', reportRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});