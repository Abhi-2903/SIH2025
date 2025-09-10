import { STANDARD_LIMITS, type HeavyMetalInput } from "./hmpi-calculations"

// Quality categories based on international standards
export type QualityCategory = "Excellent" | "Good" | "Fair" | "Poor" | "Unacceptable"

// Standards compliance frameworks
export interface StandardsCompliance {
  WHO: boolean
  EPA: boolean
  national: boolean
  overallCompliance: boolean
}

// Quality assessment result
export interface QualityAssessment {
  category: QualityCategory
  score: number // 0-100 quality score
  compliance: StandardsCompliance
  exceedingMetals: Array<{
    element: string
    concentration: number
    limit: number
    exceedanceRatio: number
  }>
  recommendations: string[]
  usageRestrictions: string[]
  treatmentOptions: string[]
}

// Quality thresholds based on percentage of standard limits
const QUALITY_THRESHOLDS = {
  Excellent: 0.25, // ≤25% of standard limits
  Good: 0.5, // ≤50% of standard limits
  Fair: 0.75, // ≤75% of standard limits
  Poor: 1.0, // ≤100% of standard limits (at limit)
  Unacceptable: Number.POSITIVE_INFINITY, // >100% of standard limits
} as const

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

// Calculate quality score (0-100, higher is better)
function calculateQualityScore(inputs: HeavyMetalInput[]): number {
  if (inputs.length === 0) return 100

  const ratios = inputs.map((input) => {
    const concentrationMgL = convertToMgL(input.concentration, input.unit)
    const standardLimit = STANDARD_LIMITS[input.element]
    return concentrationMgL / standardLimit
  })

  // Use the worst (highest) ratio as the primary indicator
  const maxRatio = Math.max(...ratios)

  // Convert ratio to quality score (inverse relationship)
  if (maxRatio <= 0.25) return 100 - maxRatio * 100 // Excellent range: 75-100
  if (maxRatio <= 0.5) return 75 - (maxRatio - 0.25) * 100 // Good range: 50-75
  if (maxRatio <= 0.75) return 50 - (maxRatio - 0.5) * 100 // Fair range: 25-50
  if (maxRatio <= 1.0) return 25 - (maxRatio - 0.75) * 100 // Poor range: 0-25

  // Unacceptable: negative score capped at 0
  return Math.max(0, 25 - (maxRatio - 1.0) * 25)
}

// Determine quality category based on metal concentrations
function determineQualityCategory(inputs: HeavyMetalInput[]): QualityCategory {
  if (inputs.length === 0) return "Excellent"

  const maxRatio = Math.max(
    ...inputs.map((input) => {
      const concentrationMgL = convertToMgL(input.concentration, input.unit)
      const standardLimit = STANDARD_LIMITS[input.element]
      return concentrationMgL / standardLimit
    }),
  )

  if (maxRatio <= QUALITY_THRESHOLDS.Excellent) return "Excellent"
  if (maxRatio <= QUALITY_THRESHOLDS.Good) return "Good"
  if (maxRatio <= QUALITY_THRESHOLDS.Fair) return "Fair"
  if (maxRatio <= QUALITY_THRESHOLDS.Poor) return "Poor"
  return "Unacceptable"
}

// Check compliance with various standards
function checkStandardsCompliance(inputs: HeavyMetalInput[]): StandardsCompliance {
  const exceedingWHO = inputs.some((input) => {
    const concentrationMgL = convertToMgL(input.concentration, input.unit)
    return concentrationMgL > STANDARD_LIMITS[input.element]
  })

  // For this example, WHO and EPA limits are the same
  // In real implementation, you'd have separate limit sets
  const exceedingEPA = exceedingWHO
  const exceedingNational = exceedingWHO // Assuming national standards align with WHO

  return {
    WHO: !exceedingWHO,
    EPA: !exceedingEPA,
    national: !exceedingNational,
    overallCompliance: !exceedingWHO && !exceedingEPA && !exceedingNational,
  }
}

// Identify metals exceeding limits
function getExceedingMetals(inputs: HeavyMetalInput[]) {
  return inputs
    .map((input) => {
      const concentrationMgL = convertToMgL(input.concentration, input.unit)
      const limit = STANDARD_LIMITS[input.element]
      const exceedanceRatio = concentrationMgL / limit

      return {
        element: input.element,
        concentration: concentrationMgL,
        limit,
        exceedanceRatio,
      }
    })
    .filter((metal) => metal.exceedanceRatio > 1.0)
    .sort((a, b) => b.exceedanceRatio - a.exceedanceRatio)
}

// Generate recommendations based on quality category
function generateRecommendations(category: QualityCategory, exceedingMetals: any[]): string[] {
  const recommendations: string[] = []

  switch (category) {
    case "Excellent":
      recommendations.push("Water quality is excellent and safe for all uses.")
      recommendations.push("Continue regular monitoring to maintain high standards.")
      recommendations.push("Consider this site as a reference for best practices.")
      break

    case "Good":
      recommendations.push("Water quality is good and suitable for most uses.")
      recommendations.push("Maintain current monitoring frequency.")
      recommendations.push("Monitor trends to prevent quality degradation.")
      break

    case "Fair":
      recommendations.push("Water quality is acceptable but requires attention.")
      recommendations.push("Increase monitoring frequency to track changes.")
      recommendations.push("Consider preventive measures to improve quality.")
      recommendations.push("Investigate potential contamination sources.")
      break

    case "Poor":
      recommendations.push("Water quality is poor and requires immediate action.")
      recommendations.push("Implement treatment measures before use.")
      recommendations.push("Conduct comprehensive source investigation.")
      recommendations.push("Consider alternative water sources if available.")
      break

    case "Unacceptable":
      recommendations.push("CRITICAL: Water is unsafe and must not be used.")
      recommendations.push("Immediate cessation of water usage required.")
      recommendations.push("Emergency treatment or alternative sources needed.")
      recommendations.push("Comprehensive environmental remediation required.")
      break
  }

  // Add specific metal recommendations
  exceedingMetals.forEach((metal) => {
    recommendations.push(
      `${metal.element} levels are ${metal.exceedanceRatio.toFixed(1)}x above safe limits - specific treatment required.`,
    )
  })

  return recommendations
}

// Generate usage restrictions
function generateUsageRestrictions(category: QualityCategory): string[] {
  switch (category) {
    case "Excellent":
    case "Good":
      return ["No restrictions - suitable for all uses including drinking water."]

    case "Fair":
      return [
        "Suitable for drinking with basic treatment (boiling, filtration).",
        "Safe for irrigation and industrial uses.",
        "Monitor regularly if used for sensitive applications.",
      ]

    case "Poor":
      return [
        "NOT suitable for drinking without advanced treatment.",
        "Limited use for irrigation (monitor soil accumulation).",
        "Industrial use only with appropriate precautions.",
        "Avoid contact with food preparation.",
      ]

    case "Unacceptable":
      return [
        "PROHIBITED for drinking water use.",
        "PROHIBITED for food preparation or cooking.",
        "PROHIBITED for irrigation of food crops.",
        "Limited industrial use only with strict safety measures.",
        "Avoid all human contact where possible.",
      ]

    default:
      return []
  }
}

// Generate treatment options
function generateTreatmentOptions(category: QualityCategory, exceedingMetals: any[]): string[] {
  const treatments: string[] = []

  if (category === "Excellent" || category === "Good") {
    treatments.push("No treatment required - water meets quality standards.")
    return treatments
  }

  // Basic treatments for Fair quality
  if (category === "Fair") {
    treatments.push("Basic filtration and disinfection recommended.")
    treatments.push("Activated carbon filtration for organic contaminants.")
    treatments.push("Regular monitoring during treatment.")
  }

  // Advanced treatments for Poor and Unacceptable
  if (category === "Poor" || category === "Unacceptable") {
    treatments.push("Advanced treatment required before any use.")
    treatments.push("Reverse osmosis for comprehensive contaminant removal.")
    treatments.push("Ion exchange for specific metal removal.")
    treatments.push("Chemical precipitation and coagulation.")
  }

  // Specific treatments based on exceeding metals
  exceedingMetals.forEach((metal) => {
    switch (metal.element) {
      case "Pb":
        treatments.push("Lead-specific: Corrosion control, phosphate treatment, pipe replacement.")
        break
      case "As":
        treatments.push("Arsenic-specific: Oxidation followed by coagulation/filtration.")
        break
      case "Hg":
        treatments.push("Mercury-specific: Activated carbon adsorption, ion exchange.")
        break
      case "Cd":
        treatments.push("Cadmium-specific: Ion exchange, reverse osmosis, lime softening.")
        break
      case "Cr":
        treatments.push("Chromium-specific: Reduction followed by precipitation.")
        break
    }
  })

  return treatments
}

// Main quality assessment function
export function assessWaterQuality(inputs: HeavyMetalInput[]): QualityAssessment {
  const category = determineQualityCategory(inputs)
  const score = calculateQualityScore(inputs)
  const compliance = checkStandardsCompliance(inputs)
  const exceedingMetals = getExceedingMetals(inputs)

  return {
    category,
    score: Math.round(score * 100) / 100,
    compliance,
    exceedingMetals,
    recommendations: generateRecommendations(category, exceedingMetals),
    usageRestrictions: generateUsageRestrictions(category),
    treatmentOptions: generateTreatmentOptions(category, exceedingMetals),
  }
}

// Batch assessment for multiple samples
export function batchAssessWaterQuality(
  samples: Array<{ id: string; metals: HeavyMetalInput[] }>,
): Array<{ id: string; assessment: QualityAssessment }> {
  return samples.map((sample) => ({
    id: sample.id,
    assessment: assessWaterQuality(sample.metals),
  }))
}
