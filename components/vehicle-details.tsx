"use client"

import { useState } from "react"
import { Car, Info } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"

interface VehicleDetailsProps {
  onSubmit: (details: VehicleDetails) => void
}

export interface VehicleDetails {
  vin: string
  color: string
  trim: string
  bodyType: string
  mileage: string
}

const bodyTypes = [
  "Sedan",
  "SUV",
  "Truck",
  "Van",
  "Coupe",
  "Wagon",
  "Convertible",
  "Hatchback",
]

const trimLevels = [
  "Base",
  "Sport",
  "Limited",
  "Premium",
  "Luxury",
  "Performance",
]

export function VehicleDetails({ onSubmit }: VehicleDetailsProps) {
  const [details, setDetails] = useState<VehicleDetails>({
    vin: "",
    color: "",
    trim: "",
    bodyType: "",
    mileage: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(details)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="vin">VIN Number</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  The Vehicle Identification Number (VIN) is a 17-character code that
                  uniquely identifies your vehicle. It can usually be found on your
                  dashboard near the windshield or in your door jamb.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Input
            id="vin"
            placeholder="Enter VIN (17 characters)"
            value={details.vin}
            onChange={(e) => setDetails({ ...details, vin: e.target.value })}
            maxLength={17}
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Vehicle Color</Label>
          <Input
            id="color"
            placeholder="e.g., Midnight Blue"
            value={details.color}
            onChange={(e) => setDetails({ ...details, color: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            value={details.bodyType}
            onValueChange={(value) => setDetails({ ...details, bodyType: value })}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level</Label>
          <Select
            value={details.trim}
            onValueChange={(value) => setDetails({ ...details, trim: value })}
          >
            <SelectTrigger id="trim">
              <SelectValue placeholder="Select trim level" />
            </SelectTrigger>
            <SelectContent>
              {trimLevels.map((trim) => (
                <SelectItem key={trim} value={trim.toLowerCase()}>
                  {trim}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Current Mileage</Label>
          <Input
            id="mileage"
            placeholder="e.g., 50000"
            value={details.mileage}
            onChange={(e) => setDetails({ ...details, mileage: e.target.value })}
            type="number"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Car className="mr-2 h-4 w-4" />
        Continue with Vehicle Details
      </Button>
    </form>
  )
}