import { NextResponse } from 'next/server'
import { analyzeWithOllama } from '@/lib/ollama-client'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Analyze with Ollama
    const analysis = await analyzeWithOllama(base64Image)

    return NextResponse.json({
      make: analysis.vehicle.make,
      model: analysis.vehicle.model,
      year: analysis.vehicle.year,
      confidence: analysis.vehicle.confidence,
      damage: analysis.damage
    })
  } catch (error) {
    console.error('Vehicle detection error:', error)
    return NextResponse.json(
      { error: 'Vehicle detection failed' },
      { status: 500 }
    )
  }
}