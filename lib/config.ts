export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  analyze: `${API_BASE_URL}/api/analyze`,
  generateReport: `${API_BASE_URL}/api/generate-report`
} as const

export const AI_CONFIG = {
  maxImageSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['image/jpeg', 'image/png'],
  maxImages: 5
} as const