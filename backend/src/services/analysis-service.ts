import { VehicleDetectionService } from './vehicle-detection-service';
import { DamageAnalysisService } from './damage-analysis-service';
import { AnalysisResult } from '../models/analysis-result';

export class AnalysisService {
  private vehicleDetection: VehicleDetectionService;
  private damageAnalysis: DamageAnalysisService;

  constructor() {
    this.vehicleDetection = new VehicleDetectionService();
    this.damageAnalysis = new DamageAnalysisService();
  }

  async analyzeImage(file: Express.Multer.File): Promise<AnalysisResult> {
    const vehicleInfo = await this.vehicleDetection.detect(file.path);
    const damageInfo = await this.damageAnalysis.analyze(file.path);

    return {
      ...vehicleInfo,
      ...damageInfo
    };
  }
}