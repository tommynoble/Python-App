import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis-service';
import { ApiError } from '../utils/api-error';

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  analyze = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new ApiError('No image provided', 400);
      }

      const result = await this.analysisService.analyzeImage(req.file);
      res.json(result);
    } catch (error) {
      throw new ApiError(error.message, 500);
    }
  };
}