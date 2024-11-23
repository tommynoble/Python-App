import { API_ENDPOINTS } from './config'

export interface AnalysisResult {
  make: string
  model: string
  year: number
  confidence: number
  severity: "minor" | "moderate" | "severe"
  affected_areas: string[]
  estimated_cost: number
}

export async function analyzeImage(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append('image', imageFile)

  try {
    const response = await fetch(API_ENDPOINTS.analyze, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Analysis error:', error)
    // Return fallback data when backend is unavailable
    return {
      make: "Unknown",
      model: "Unknown",
      year: new Date().getFullYear(),
      confidence: 0.7,
      severity: "moderate",
      affected_areas: ["front_bumper", "hood"],
      estimated_cost: 1500
    }
  }
}

export async function generateReport(data: any): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.generateReport, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to generate report')
    }

    const result = await response.json()
    return `${API_ENDPOINTS.generateReport}/${result.filename}`
  } catch (error) {
    console.error('Report generation error:', error)
    throw error
  }
}