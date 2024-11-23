"use client"

export interface OllamaResponse {
  damage: {
    severity: "minor" | "moderate" | "severe"
    locations: string[]
    description: string
  }
  vehicle: {
    make: string
    model: string
    year: number
    confidence: number
  }
}

export async function analyzeWithOllama(imageBase64: string): Promise<OllamaResponse> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava',
        prompt: 'Analyze this vehicle damage image and provide: 1) Damage severity (minor/moderate/severe), 2) Affected areas, 3) Vehicle make, model, and year if visible. Respond in JSON format.',
        images: [imageBase64],
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama analysis failed')
    }

    const data = await response.json()
    return parseOllamaResponse(data.response)
  } catch (error) {
    console.error('Ollama analysis error:', error)
    throw error
  }
}

function parseOllamaResponse(response: string): OllamaResponse {
  try {
    // Attempt to parse JSON from Ollama's response
    const parsed = JSON.parse(response)
    return {
      damage: {
        severity: parsed.severity || "moderate",
        locations: parsed.affected_areas || [],
        description: parsed.description || ""
      },
      vehicle: {
        make: parsed.vehicle?.make || "Unknown",
        model: parsed.vehicle?.model || "Unknown",
        year: parsed.vehicle?.year || 0,
        confidence: parsed.vehicle?.confidence || 0
      }
    }
  } catch (error) {
    // If JSON parsing fails, attempt to extract information from text
    console.warn('Failed to parse Ollama JSON response, falling back to text parsing')
    return {
      damage: {
        severity: response.toLowerCase().includes('severe') ? 'severe' 
          : response.toLowerCase().includes('minor') ? 'minor' 
          : 'moderate',
        locations: extractLocations(response),
        description: response
      },
      vehicle: {
        make: "Unknown",
        model: "Unknown",
        year: 0,
        confidence: 0
      }
    }
  }
}

function extractLocations(text: string): string[] {
  const commonLocations = [
    'front bumper', 'rear bumper', 'hood', 'trunk', 'door', 
    'fender', 'windshield', 'headlight', 'taillight', 'mirror'
  ]
  return commonLocations.filter(location => 
    text.toLowerCase().includes(location)
  )
}