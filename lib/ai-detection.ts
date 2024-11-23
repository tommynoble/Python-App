"use client"

import * as tf from '@tensorflow/tfjs'
import { createCanvas, loadImage } from 'canvas'

export interface AIDetectionResult {
  make: string
  model: string
  year: number
  confidence: number
  damages: {
    type: string
    severity: number
    location: string
    confidence: number
  }[]
}

export async function analyzeImage(imageFile: File): Promise<AIDetectionResult> {
  // Load and preprocess the image
  const img = await loadImageFromFile(imageFile)
  const tensor = await preprocessImage(img)
  
  // Load the models
  const [vehicleModel, damageModel] = await Promise.all([
    tf.loadGraphModel('/models/vehicle-detection/model.json'),
    tf.loadGraphModel('/models/damage-detection/model.json')
  ])

  // Run inference
  const vehiclePrediction = await vehicleModel.predict(tensor)
  const damagePrediction = await damageModel.predict(tensor)

  // Process results
  return {
    make: "Range Rover", // Replace with actual prediction
    model: "Sport",
    year: 2023,
    confidence: 0.92,
    damages: [
      {
        type: "scratch",
        severity: 0.7,
        location: "front_bumper",
        confidence: 0.85
      }
    ]
  }
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

async function preprocessImage(img: HTMLImageElement) {
  const canvas = createCanvas(224, 224) // Standard input size
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, 224, 224)
  
  // Convert to tensor and normalize
  let tensor = tf.browser.fromPixels(canvas)
  tensor = tensor.expandDims(0)
  tensor = tensor.toFloat().div(255.0)
  
  return tensor
}