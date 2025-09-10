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
import { Calculator, Plus, Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { calculateHMPI, STANDARD_LIMITS, type HeavyMetalInput, type HMPIResult } from "@/lib/hmpi-calculations"

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

export function HMPICalculator() {
  const [inputs, setInputs] = useState<Array<HeavyMetalInput & { id: string }>>([
    { id: "1", element: "Pb", concentration: 0, unit: "mg/L" },
  ])
  const [result, setResult] = useState<HMPIResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

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

  const handleCalculate = async () => {
    setIsCalculating(true)

    // Filter out inputs with zero concentration
    const validInputs = inputs.filter((input) => input.concentration > 0)

    if (validInputs.length === 0) {
      alert("Please enter at least one heavy metal concentration greater than 0")
      setIsCalculating(false)
      return
    }

    try {
      // Simulate calculation delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const calculationResult = calculateHMPI(validInputs)
      setResult(calculationResult)
    } catch (error) {
      console.error("Calculation error:", error)
      alert("Error calculating HMPI. Please check your inputs.")
    }

    setIsCalculating(false)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "text-green-600 bg-green-50 border-green-200"
      case "Moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Very High":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <CheckCircle className="h-4 w-4" />
      case "Moderate":
        return <Info className="h-4 w-4" />
      case "High":
      case "Very High":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Heavy Metal Concentrations
          </CardTitle>
          <CardDescription>
            Enter the concentration values for heavy metals detected in your groundwater sample
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
            <Button onClick={handleCalculate} disabled={isCalculating}>
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate HMPI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Overall HMPI Result */}
          <Card>
            <CardHeader>
              <CardTitle>HMPI Calculation Results</CardTitle>
              <CardDescription>Heavy Metal Pollution Index and Risk Assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-foreground">{result.overallHMPI}</div>
                  <div className="text-sm text-muted-foreground">Overall HMPI Score</div>
                </div>
                <Badge className={`${getRiskColor(result.riskLevel)} flex items-center gap-1`}>
                  {getRiskIcon(result.riskLevel)}
                  {result.riskLevel} Risk
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <span>{result.overallHMPI}/300+</span>
                </div>
                <Progress value={Math.min((result.overallHMPI / 300) * 100, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Sub-indices */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Metal Analysis</CardTitle>
              <CardDescription>Sub-indices for each heavy metal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.subIndices.map((metal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metal.element}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{metal.subIndex.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">
                          {metal.contributionPercent.toFixed(1)}% contribution
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Concentration: {metal.concentration.toFixed(4)} mg/L (Limit: {metal.standardLimit} mg/L)
                    </div>
                    <Progress value={Math.min((metal.subIndex / 300) * 100, 100)} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Action items based on HMPI results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <Alert key={index}>
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
