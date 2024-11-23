"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload, X, Car, Zap } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { AnalysisResult } from "./analysis-result"
import { VehicleDetails } from "./vehicle-details"
import { detectVehicle } from "@/lib/vehicle-detection"

interface AnalysisResponse {
  severity: "minor" | "moderate" | "severe"
  estimated_cost: number
  affected_areas: string[]
  recommendation: string
  vehicle_info: {
    make: string
    model: string
    year: number
    confidence: number
    alternativeMatches?: {
      make: string
      model: string
      year: number
      confidence: number
    }[]
    color?: string
    trim?: string
    bodyType?: string
    mileage?: string
    vin?: string
  }
}

export function UploadZone() {
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showVehicleDetails, setShowVehicleDetails] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 5 - files.length)
    if (newFiles.length < acceptedFiles.length) {
      toast({
        title: "Maximum files reached",
        description: "You can only upload up to 5 images at a time.",
        variant: "destructive",
      })
    }

    setFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }, [files.length, toast])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"]
    },
    maxFiles: 5,
    maxSize: 10485760 // 10MB
  })

  const handleVehicleDetails = async (details: any) => {
    setShowVehicleDetails(false)
    await performAnalysis(details)
  }

  const performAnalysis = async (details?: any) => {
    if (files.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Detect vehicle from the first image
      const detectionResult = await detectVehicle(files[0])
      
      // Combine detection with user-provided details
      const result: AnalysisResponse = {
        severity: detectionResult.severity,
        estimated_cost: detectionResult.estimated_cost,
        affected_areas: detectionResult.affected_areas,
        recommendation: "Professional repair recommended",
        vehicle_info: {
          make: detectionResult.make,
          model: detectionResult.model,
          year: detectionResult.year,
          confidence: detectionResult.confidence,
          ...details
        }
      }

      setAnalysisResults(result)
      setShowResults(true)
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your photos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop your images here..."
              : "Drag & drop vehicle damage photos here, or click to select"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Supports JPEG and PNG up to 10MB (max 5 files)
          </p>
        </div>

        {previews.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt={`Upload preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => performAnalysis()}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Quick Analysis
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setShowVehicleDetails(true)}
                disabled={isAnalyzing}
              >
                <Car className="mr-2 h-4 w-4" />
                Add Vehicle Details
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Quick Analysis provides instant results, while adding vehicle details improves accuracy
            </p>
          </div>
        )}
      </div>

      <Dialog open={showVehicleDetails} onOpenChange={setShowVehicleDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>
              Please provide additional information about your vehicle for more accurate analysis
            </DialogDescription>
          </DialogHeader>
          <VehicleDetails onSubmit={handleVehicleDetails} />
        </DialogContent>
      </Dialog>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Damage Analysis Results</DialogTitle>
            <DialogDescription>
              Here's what our AI detected in your photos
            </DialogDescription>
          </DialogHeader>
          {analysisResults && (
            <AnalysisResult
              result={{
                severity: analysisResults.severity,
                estimatedCost: analysisResults.estimated_cost,
                affectedAreas: analysisResults.affected_areas,
                recommendation: analysisResults.recommendation,
                vehicleInfo: analysisResults.vehicle_info
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}