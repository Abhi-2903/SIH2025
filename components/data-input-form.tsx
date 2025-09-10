"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Beaker, Save, Plus, Trash2 } from "lucide-react"

interface HeavyMetalData {
  element: string
  concentration: string
  unit: string
}

interface SampleData {
  sampleId: string
  collectionDate: string
  latitude: string
  longitude: string
  depth: string
  pH: string
  temperature: string
  heavyMetals: HeavyMetalData[]
  notes: string
}

const commonHeavyMetals = [
  { name: "Lead (Pb)", symbol: "Pb" },
  { name: "Cadmium (Cd)", symbol: "Cd" },
  { name: "Chromium (Cr)", symbol: "Cr" },
  { name: "Arsenic (As)", symbol: "As" },
  { name: "Mercury (Hg)", symbol: "Hg" },
  { name: "Copper (Cu)", symbol: "Cu" },
  { name: "Zinc (Zn)", symbol: "Zn" },
  { name: "Nickel (Ni)", symbol: "Ni" },
]

const concentrationUnits = ["mg/L", "μg/L", "ppm", "ppb"]

export function DataInputForm() {
  const [sampleData, setSampleData] = useState<SampleData>({
    sampleId: "",
    collectionDate: "",
    latitude: "",
    longitude: "",
    depth: "",
    pH: "",
    temperature: "",
    heavyMetals: [{ element: "", concentration: "", unit: "mg/L" }],
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addHeavyMetal = () => {
    setSampleData((prev) => ({
      ...prev,
      heavyMetals: [...prev.heavyMetals, { element: "", concentration: "", unit: "mg/L" }],
    }))
  }

  const removeHeavyMetal = (index: number) => {
    setSampleData((prev) => ({
      ...prev,
      heavyMetals: prev.heavyMetals.filter((_, i) => i !== index),
    }))
  }

  const updateHeavyMetal = (index: number, field: keyof HeavyMetalData, value: string) => {
    setSampleData((prev) => ({
      ...prev,
      heavyMetals: prev.heavyMetals.map((metal, i) => (i === index ? { ...metal, [field]: value } : metal)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Sample data submitted:", sampleData)
    setIsSubmitting(false)

    // Reset form
    setSampleData({
      sampleId: "",
      collectionDate: "",
      latitude: "",
      longitude: "",
      depth: "",
      pH: "",
      temperature: "",
      heavyMetals: [{ element: "", concentration: "", unit: "mg/L" }],
      notes: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sample Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sample Information
          </CardTitle>
          <CardDescription>Basic identification and collection details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sampleId">Sample ID *</Label>
              <Input
                id="sampleId"
                placeholder="e.g., GW-2024-001"
                value={sampleData.sampleId}
                onChange={(e) => setSampleData((prev) => ({ ...prev, sampleId: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionDate">Collection Date *</Label>
              <Input
                id="collectionDate"
                type="date"
                value={sampleData.collectionDate}
                onChange={(e) => setSampleData((prev) => ({ ...prev, collectionDate: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Coordinates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Location
          </CardTitle>
          <CardDescription>Precise coordinates for geospatial analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                placeholder="e.g., 40.7128"
                value={sampleData.latitude}
                onChange={(e) => setSampleData((prev) => ({ ...prev, latitude: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                placeholder="e.g., -74.0060"
                value={sampleData.longitude}
                onChange={(e) => setSampleData((prev) => ({ ...prev, longitude: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="depth">Depth (m)</Label>
              <Input
                id="depth"
                placeholder="e.g., 15.5"
                value={sampleData.depth}
                onChange={(e) => setSampleData((prev) => ({ ...prev, depth: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pH">pH Level</Label>
              <Input
                id="pH"
                placeholder="e.g., 7.2"
                value={sampleData.pH}
                onChange={(e) => setSampleData((prev) => ({ ...prev, pH: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                placeholder="e.g., 18.5"
                value={sampleData.temperature}
                onChange={(e) => setSampleData((prev) => ({ ...prev, temperature: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heavy Metal Concentrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Heavy Metal Concentrations
          </CardTitle>
          <CardDescription>Enter concentration values for detected heavy metals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleData.heavyMetals.map((metal, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Heavy Metal</Label>
                <Select value={metal.element} onValueChange={(value) => updateHeavyMetal(index, "element", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select heavy metal" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonHeavyMetals.map((element) => (
                      <SelectItem key={element.symbol} value={element.symbol}>
                        {element.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Concentration</Label>
                <Input
                  placeholder="e.g., 0.05"
                  value={metal.concentration}
                  onChange={(e) => updateHeavyMetal(index, "concentration", e.target.value)}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Unit</Label>
                <Select value={metal.unit} onValueChange={(value) => updateHeavyMetal(index, "unit", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {concentrationUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {sampleData.heavyMetals.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeHeavyMetal(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addHeavyMetal} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Heavy Metal
          </Button>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Optional notes and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional observations, sampling conditions, or relevant information..."
              value={sampleData.notes}
              onChange={(e) => setSampleData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Submit Sample Data
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
