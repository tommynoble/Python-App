"use client"

import { AlertCircle, CheckCircle2, CircleDollarSign, Download, Gauge, Car, MapPin } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { generatePDF } from "@/lib/pdf-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VehicleInfo {
  make: string
  model: string
  year: number
  confidence: number
  color?: string
  trim?: string
  bodyType?: string
  mileage?: string
  vin?: string
}

interface AnalysisResult {
  severity: "minor" | "moderate" | "severe"
  estimatedCost: number
  affectedAreas: string[]
  recommendation: string
  vehicleInfo: VehicleInfo
}

interface AnalysisResultProps {
  result: AnalysisResult
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const severityColor = {
    minor: "text-green-500",
    moderate: "text-yellow-500",
    severe: "text-red-500",
  }

  const handleDownloadPDF = () => {
    generatePDF(result)
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 min-h-[300px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Information</CardTitle>
              <Car className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold">
                    {result.vehicleInfo.make} {result.vehicleInfo.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Year: {result.vehicleInfo.year}
                    {result.vehicleInfo.trim && ` • ${result.vehicleInfo.trim} trim`}
                    {result.vehicleInfo.bodyType && ` • ${result.vehicleInfo.bodyType}`}
                  </p>
                  {result.vehicleInfo.vin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      VIN: {result.vehicleInfo.vin}
                    </p>
                  )}
                </div>
                <div className="text-left md:text-right">
                  <div className="text-sm text-muted-foreground">
                    Detection Confidence: {(result.vehicleInfo.confidence * 100).toFixed(1)}%
                  </div>
                  {result.vehicleInfo.mileage && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Mileage: {parseInt(result.vehicleInfo.mileage).toLocaleString()} miles
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Damage Severity</CardTitle>
                <Gauge className={cn("h-4 w-4", severityColor[result.severity])} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{result.severity}</div>
                <p className="text-xs text-muted-foreground">
                  Based on visual analysis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${result.estimatedCost.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approximate repair cost
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affected Areas</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.affectedAreas.length}</div>
                <p className="text-xs text-muted-foreground">
                  {result.affectedAreas.join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommendation</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-md font-medium">{result.recommendation}</div>
                <p className="text-xs text-muted-foreground">
                  Professional assessment
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 min-h-[300px]">
          <Card>
            <CardHeader>
              <CardTitle>Repair Shop Estimates</CardTitle>
              <CardDescription>
                Based on local repair shops in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Premium Auto Body",
                    distance: "2.3 miles",
                    estimate: result.estimatedCost * 1.1,
                    rating: 4.8,
                  },
                  {
                    name: "City Auto Repair",
                    distance: "3.1 miles",
                    estimate: result.estimatedCost * 0.95,
                    rating: 4.6,
                  },
                  {
                    name: "Expert Car Care",
                    distance: "4.5 miles",
                    estimate: result.estimatedCost * 1.05,
                    rating: 4.9,
                  },
                ].map((shop) => (
                  <div
                    key={shop.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div>
                      <div className="font-medium">{shop.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {shop.distance} • ⭐ {shop.rating}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="font-bold">
                        ${shop.estimate.toLocaleString()}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                        Get Quote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parts & Labor Breakdown</CardTitle>
              <CardDescription>
                Estimated costs for repairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.affectedAreas.map((area) => {
                  const partCost = Math.round(result.estimatedCost * 0.4 / result.affectedAreas.length)
                  const laborCost = Math.round(result.estimatedCost * 0.6 / result.affectedAreas.length)
                  return (
                    <div key={area} className="space-y-2">
                      <div className="font-medium capitalize">
                        {area.replace(/_/g, " ")}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between p-3 bg-muted rounded">
                          <span>Parts:</span>
                          <span className="font-medium">${partCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-muted rounded">
                          <span>Labor:</span>
                          <span className="font-medium">${laborCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-center sticky bottom-0 pt-6 pb-2 bg-background">
          <Button
            onClick={handleDownloadPDF}
            className="w-full max-w-xs"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>
      </Tabs>
    </ScrollArea>
  )
}