// WHO/EPA Standard limits for heavy metals in drinking water (mg/L)
export const STANDARD_LIMITS = {
  Pb: 0.01, // Lead
  Cd: 0.003, // Cadmium
  Cr: 0.05, // Chromium
  As: 0.01, // Arsenic
  Hg: 0.006, // Mercury
  Cu: 2.0, // Copper
  Zn: 3.0, // Zinc
  Ni: 0.07, // Nickel
} as const

// Relative weights for different heavy metals based on toxicity
export const METAL_WEIGHTS = {
  Pb: 0.25, // Lead - highest toxicity
  Cd: 0.25, // Cadmium - highest toxicity
  Cr: 0.15, // Chromium
  As: 0.2, // Arsenic - high toxicity
  Hg: 0.25, // Mercury - highest toxicity
  Cu: 0.05, // Copper - lower toxicity
  Zn: 0.05, // Zinc - lower toxicity
  Ni: 0.1, // Nickel
} as const

export interface HeavyMetalInput {
  element: keyof typeof STANDARD_LIMITS
  concentration: number
  unit: string
}

export interface HMPIResult {
  overallHMPI: number
  riskLevel: "Low" | "Moderate" | "High" | "Very High"
  subIndices: Array<{
    element: string
    concentration: number
    standardLimit: number
    subIndex: number
    contributionPercent: number
  }>
  recommendations: string[]
}

// Convert concentration to mg/L if needed
function convertToMgL(concentration: number, unit: string): number {
  switch (unit) {
    case "mg/L":
      return concentration
    case "μg/L":
      return concentration / 1000
    case "ppm":
      return concentration
    case "ppb":
      return concentration / 1000
    default:
      return concentration
  }
}

// Calculate sub-index for individual heavy metal
function calculateSubIndex(concentration: number, standardLimit: number): number {
  return (concentration / standardLimit) * 100
}

// Determine risk level based on HMPI value
function determineRiskLevel(hmpi: number): HMPIResult["riskLevel"] {
  if (hmpi <= 100) return "Low"
  if (hmpi <= 200) return "Moderate"
  if (hmpi <= 300) return "High"
  return "Very High"
}

// Generate recommendations based on results
function generateRecommendations(result: HMPIResult): string[] {
  const recommendations: string[] = []

  if (result.riskLevel === "Low") {
    recommendations.push("Water quality is within acceptable limits for heavy metals.")
    recommendations.push("Continue regular monitoring to maintain safety standards.")
  } else if (result.riskLevel === "Moderate") {
    recommendations.push("Increased monitoring frequency is recommended.")
    recommendations.push("Consider implementing basic treatment measures.")
    recommendations.push("Investigate potential contamination sources.")
  } else if (result.riskLevel === "High") {
    recommendations.push("Immediate action required - water treatment necessary.")
    recommendations.push("Restrict water usage until treatment is implemented.")
    recommendations.push("Conduct comprehensive source investigation.")
    recommendations.push("Implement advanced treatment technologies.")
  } else {
    recommendations.push("CRITICAL: Water is unsafe for consumption.")
    recommendations.push("Immediate cessation of water usage required.")
    recommendations.push("Emergency treatment measures must be implemented.")
    recommendations.push("Comprehensive environmental assessment needed.")
  }

  // Add specific metal recommendations
  result.subIndices.forEach((metal) => {
    if (metal.subIndex > 200) {
      recommendations.push(
        `${metal.element} levels are critically high - specific treatment for ${metal.element} removal required.`,
      )
    } else if (metal.subIndex > 100) {
      recommendations.push(`${metal.element} exceeds safe limits - monitoring and treatment recommended.`)
    }
  })

  return recommendations
}

// Main HMPI calculation function
export function calculateHMPI(inputs: HeavyMetalInput[]): HMPIResult {
  if (inputs.length === 0) {
    throw new Error("No heavy metal data provided")
  }

  const subIndices = inputs.map((input) => {
    const concentrationMgL = convertToMgL(input.concentration, input.unit)
    const standardLimit = STANDARD_LIMITS[input.element]
    const subIndex = calculateSubIndex(concentrationMgL, standardLimit)

    return {
      element: input.element,
      concentration: concentrationMgL,
      standardLimit,
      subIndex,
      contributionPercent: 0, // Will be calculated after HMPI
    }
  })

  // Calculate weighted HMPI using arithmetic mean method
  const totalWeightedIndex = subIndices.reduce((sum, metal) => {
    const weight = METAL_WEIGHTS[metal.element as keyof typeof METAL_WEIGHTS] || 0.1
    return sum + metal.subIndex * weight
  }, 0)

  const totalWeight = subIndices.reduce((sum, metal) => {
    return sum + (METAL_WEIGHTS[metal.element as keyof typeof METAL_WEIGHTS] || 0.1)
  }, 0)

  const overallHMPI = totalWeightedIndex / totalWeight

  // Calculate contribution percentages
  subIndices.forEach((metal) => {
    const weight = METAL_WEIGHTS[metal.element as keyof typeof METAL_WEIGHTS] || 0.1
    metal.contributionPercent = ((metal.subIndex * weight) / totalWeightedIndex) * 100
  })

  const riskLevel = determineRiskLevel(overallHMPI)

  const result: HMPIResult = {
    overallHMPI: Math.round(overallHMPI * 100) / 100,
    riskLevel,
    subIndices: subIndices.sort((a, b) => b.subIndex - a.subIndex),
    recommendations: [],
  }

  result.recommendations = generateRecommendations(result)

  return result
}

// Batch calculation for multiple samples
export function calculateBatchHMPI(
  samples: Array<{ id: string; metals: HeavyMetalInput[] }>,
): Array<{ id: string; result: HMPIResult }> {
  return samples.map((sample) => ({
    id: sample.id,
    result: calculateHMPI(sample.metals),
  }))
}
