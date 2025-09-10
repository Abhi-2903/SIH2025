"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, XCircle, Info, Droplets, Plus, Trash2 } from "lucide-react"
import { assessWaterQuality, type HeavyMetalInput, type QualityAssessment } from "@/lib/quality-categorization"
import { STANDARD_LIMITS } from "@/lib/hmpi-calculations"

const heavyMetals = [
  { name: "Lead (Pb)", symbol: "Pb" as const },
  { name: "Cadmium (Cd)", symbol: "Cd" as const },
  { name: "Chromium (Cr)", symbol: "Cr" as const },
  { name: "Arsenic (As)", symbol: "As" as const },
  { name: "Mercury (Hg)", symbol: "Hg" as const },
  { name: "Copper (Cu)", symbol: "Cu" as const },
  { name: "Zinc (Zn)", symbol: "Zn" as const },
  { name: "Nickel (Ni)", symbol: "Ni" as const },
]

const concentrationUnits = ["mg/L", "μg/L", "ppm", "ppb"]

export function QualityCategorization() {
  const [inputs, setInputs] = useState<Array<HeavyMetalInput & { id: string }>>([
    { id: "1", element: "Pb", concentration: 0, unit: "mg/L" },
  ])
  const [assessment, setAssessment] = useState<QualityAssessment | null>(null)
  const [isAssessing, setIsAssessing] = useState(false)

  const addInput = () => {
    const newId = (inputs.length + 1).toString()
    setInputs([...inputs, { id: newId, element: "Pb", concentration: 0, unit: "mg/L" }])
  }

  const removeInput = (id: string) => {
    setInputs(inputs.filter((input) => input.id !== id))
  }

  const updateInput = (id: string, field: keyof HeavyMetalInput, value: any) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)))
  }

  const handleAssess = async () => {
    setIsAssessing(true)

    // Filter out inputs with zero concentration
    const validInputs = inputs.filter((input) => input.concentration > 0)

    if (validInputs.length === 0) {
      alert("Please enter at least one heavy metal concentration greater than 0")
      setIsAssessing(false)
      return
    }

    try {
      // Simulate assessment delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = assessWaterQuality(validInputs)
      setAssessment(result)
    } catch (error) {
      console.error("Assessment error:", error)
      alert("Error assessing water quality. Please check your inputs.")
    }

    setIsAssessing(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Excellent":
        return "text-green-700 bg-green-50 border-green-200"
      case "Good":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "Fair":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "Poor":
        return "text-orange-700 bg-orange-50 border-orange-200"
      case "Unacceptable":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Excellent":
      case "Good":
        return <CheckCircle className="h-5 w-5" />
      case "Fair":
        return <Info className="h-5 w-5" />
      case "Poor":
        return <AlertTriangle className="h-5 w-5" />
      case "Unacceptable":
        return <XCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Water Quality Assessment
          </CardTitle>
          <CardDescription>
            Enter heavy metal concentrations to assess groundwater quality according to international standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.map((input, index) => (
            <div key={input.id} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Heavy Metal</Label>
                <Select
                  value={input.element}
                  onValueChange={(value) => updateInput(input.id, "element", value as keyof typeof STANDARD_LIMITS)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {heavyMetals.map((metal) => (
                      <SelectItem key={metal.symbol} value={metal.symbol}>
                        {metal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Concentration</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  value={input.concentration || ""}
                  onChange={(e) => updateInput(input.id, "concentration", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Unit</Label>
                <Select value={input.unit} onValueChange={(value) => updateInput(input.id, "unit", value)}>
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
              <div className="text-xs text-muted-foreground w-20">Limit: {STANDARD_LIMITS[input.element]} mg/L</div>
              {inputs.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeInput(input.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={addInput} className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Heavy Metal
            </Button>
            <Button onClick={handleAssess} disabled={isAssessing}>
              {isAssessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Assessing...
                </>
              ) : (
                <>
                  <Droplets className="h-4 w-4 mr-2" />
                  Assess Water Quality
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Results */}
      {assessment && (
        <div className="space-y-6">
          {/* Overall Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Assessment Results</CardTitle>
              <CardDescription>Comprehensive quality evaluation based on heavy metal analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-foreground">{assessment.score}/100</div>
                  <div className="text-sm text-muted-foreground">Quality Score</div>
                </div>
                <Badge
                  className={`${getCategoryColor(assessment.category)} flex items-center gap-2 text-base px-4 py-2`}
                >
                  {getCategoryIcon(assessment.category)}
                  {assessment.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quality Level</span>
                  <span>{assessment.score}/100</span>
                </div>
                <Progress value={assessment.score} className="h-3" />
              </div>

              {/* Standards Compliance */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${assessment.compliance.WHO ? "text-green-600" : "text-red-600"}`}
                  >
                    {assessment.compliance.WHO ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-muted-foreground">WHO Standards</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${assessment.compliance.EPA ? "text-green-600" : "text-red-600"}`}
                  >
                    {assessment.compliance.EPA ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-muted-foreground">EPA Standards</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${assessment.compliance.national ? "text-green-600" : "text-red-600"}`}
                  >
                    {assessment.compliance.national ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-muted-foreground">National Standards</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${assessment.compliance.overallCompliance ? "text-green-600" : "text-red-600"}`}
                  >
                    {assessment.compliance.overallCompliance ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="restrictions">Usage Restrictions</TabsTrigger>
              <TabsTrigger value="treatment">Treatment Options</TabsTrigger>
              <TabsTrigger value="exceedances">Limit Exceedances</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Quality-Based Recommendations</CardTitle>
                  <CardDescription>Action items based on water quality assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessment.recommendations.map((recommendation, index) => (
                      <Alert key={index}>
                        <AlertDescription>{recommendation}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="restrictions">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Restrictions</CardTitle>
                  <CardDescription>Permitted and prohibited uses based on quality category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessment.usageRestrictions.map((restriction, index) => (
                      <Alert
                        key={index}
                        className={assessment.category === "Unacceptable" ? "border-red-200 bg-red-50" : ""}
                      >
                        <AlertDescription>{restriction}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Options</CardTitle>
                  <CardDescription>Recommended treatment methods for quality improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessment.treatmentOptions.map((treatment, index) => (
                      <Alert key={index}>
                        <AlertDescription>{treatment}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exceedances">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Limit Exceedances</CardTitle>
                  <CardDescription>Heavy metals exceeding safe concentration limits</CardDescription>
                </CardHeader>
                <CardContent>
                  {assessment.exceedingMetals.length > 0 ? (
                    <div className="space-y-4">
                      {assessment.exceedingMetals.map((metal, index) => (
                        <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-red-800">{metal.element}</div>
                            <Badge className="bg-red-100 text-red-800">
                              {metal.exceedanceRatio.toFixed(1)}x over limit
                            </Badge>
                          </div>
                          <div className="text-sm text-red-700">
                            Concentration: {metal.concentration.toFixed(4)} mg/L (Limit: {metal.limit} mg/L)
                          </div>
                          <Progress value={Math.min(metal.exceedanceRatio * 100, 500)} className="h-2 mt-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-green-600">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>All heavy metals are within safe limits</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
