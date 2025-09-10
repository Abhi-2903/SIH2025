"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Filter, Search, AlertTriangle, CheckCircle, Info, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for demonstration - in real app this would come from database
const mockSampleData = [
  {
    id: "GW-2024-001",
    latitude: 40.7128,
    longitude: -74.006,
    location: "Manhattan Financial District",
    hmpi: 85.2,
    riskLevel: "Low" as const,
    dominantMetal: "Pb",
    collectionDate: "2024-01-15",
    depth: 15.5,
    metalConcentrations: { Pb: 0.008, Cd: 0.002, As: 0.003, Hg: 0.001, Cr: 0.015, Cu: 0.045 },
    waterQuality: { pH: 7.2, temperature: 18.5, dissolvedOxygen: 6.8, turbidity: 2.1 },
  },
  {
    id: "GW-2024-002",
    latitude: 40.7589,
    longitude: -73.9851,
    location: "Central Park East",
    hmpi: 145.8,
    riskLevel: "Moderate" as const,
    dominantMetal: "Cd",
    collectionDate: "2024-01-16",
    depth: 22.3,
    metalConcentrations: { Pb: 0.012, Cd: 0.007, As: 0.004, Hg: 0.002, Cr: 0.018, Cu: 0.032 },
    waterQuality: { pH: 6.8, temperature: 19.2, dissolvedOxygen: 5.9, turbidity: 3.4 },
  },
  {
    id: "GW-2024-003",
    latitude: 40.6892,
    longitude: -74.0445,
    location: "Brooklyn Industrial Zone",
    hmpi: 275.4,
    riskLevel: "High" as const,
    dominantMetal: "As",
    collectionDate: "2024-01-17",
    depth: 18.7,
    metalConcentrations: { Pb: 0.025, Cd: 0.015, As: 0.022, Hg: 0.008, Cr: 0.045, Cu: 0.078 },
    waterQuality: { pH: 6.5, temperature: 20.1, dissolvedOxygen: 4.2, turbidity: 5.8 },
  },
  {
    id: "GW-2024-004",
    latitude: 40.7282,
    longitude: -73.7949,
    location: "Queens Residential Area",
    hmpi: 95.1,
    riskLevel: "Low" as const,
    dominantMetal: "Cu",
    collectionDate: "2024-01-18",
    depth: 12.1,
    metalConcentrations: { Pb: 0.006, Cd: 0.001, As: 0.002, Hg: 0.001, Cr: 0.012, Cu: 0.048 },
    waterQuality: { pH: 7.0, temperature: 18.8, dissolvedOxygen: 7.1, turbidity: 1.8 },
  },
  {
    id: "GW-2024-005",
    latitude: 40.6782,
    longitude: -73.9442,
    location: "Brooklyn Waterfront",
    hmpi: 320.7,
    riskLevel: "Very High" as const,
    dominantMetal: "Hg",
    collectionDate: "2024-01-19",
    depth: 25.8,
    metalConcentrations: { Pb: 0.035, Cd: 0.018, As: 0.028, Hg: 0.012, Cr: 0.052, Cu: 0.089 },
    waterQuality: { pH: 5.9, temperature: 21.5, dissolvedOxygen: 3.8, turbidity: 7.2 },
  },
  {
    id: "GW-2024-006",
    latitude: 40.8176,
    longitude: -73.9782,
    location: "Bronx Urban Park",
    hmpi: 165.3,
    riskLevel: "Moderate" as const,
    dominantMetal: "Cr",
    collectionDate: "2024-01-20",
    depth: 19.4,
    metalConcentrations: { Pb: 0.015, Cd: 0.008, As: 0.006, Hg: 0.003, Cr: 0.033, Cu: 0.041 },
    waterQuality: { pH: 6.7, temperature: 19.8, dissolvedOxygen: 5.5, turbidity: 3.9 },
  },
  {
    id: "GW-2024-007",
    latitude: 40.7505,
    longitude: -73.9934,
    location: "Times Square Underground",
    hmpi: 198.6,
    riskLevel: "Moderate" as const,
    dominantMetal: "Pb",
    collectionDate: "2024-01-21",
    depth: 28.2,
    metalConcentrations: { Pb: 0.02, Cd: 0.009, As: 0.008, Hg: 0.004, Cr: 0.025, Cu: 0.055 },
    waterQuality: { pH: 6.4, temperature: 20.5, dissolvedOxygen: 4.8, turbidity: 4.6 },
  },
  {
    id: "GW-2024-008",
    latitude: 40.6643,
    longitude: -73.9385,
    location: "Prospect Park South",
    hmpi: 78.3,
    riskLevel: "Low" as const,
    dominantMetal: "Cu",
    collectionDate: "2024-01-22",
    depth: 14.8,
    metalConcentrations: { Pb: 0.005, Cd: 0.001, As: 0.002, Hg: 0.001, Cr: 0.01, Cu: 0.039 },
    waterQuality: { pH: 7.3, temperature: 18.2, dissolvedOxygen: 7.4, turbidity: 1.5 },
  },
  {
    id: "GW-2024-009",
    latitude: 40.8448,
    longitude: -73.8648,
    location: "Bronx River Corridor",
    hmpi: 245.1,
    riskLevel: "High" as const,
    dominantMetal: "As",
    collectionDate: "2024-01-23",
    depth: 21.6,
    metalConcentrations: { Pb: 0.028, Cd: 0.012, As: 0.019, Hg: 0.006, Cr: 0.038, Cu: 0.067 },
    waterQuality: { pH: 6.1, temperature: 21.0, dissolvedOxygen: 4.1, turbidity: 6.3 },
  },
  {
    id: "GW-2024-010",
    latitude: 40.7831,
    longitude: -73.9712,
    location: "Upper West Side",
    hmpi: 112.4,
    riskLevel: "Low" as const,
    dominantMetal: "Cr",
    collectionDate: "2024-01-24",
    depth: 16.9,
    metalConcentrations: { Pb: 0.009, Cd: 0.003, As: 0.004, Hg: 0.002, Cr: 0.022, Cu: 0.043 },
    waterQuality: { pH: 6.9, temperature: 19.1, dissolvedOxygen: 6.5, turbidity: 2.8 },
  },
]

type RiskLevel = "Low" | "Moderate" | "High" | "Very High"

interface MapFilters {
  riskLevel: string
  metal: string
  searchTerm: string
}

export function GeospatialMap() {
  const [selectedSite, setSelectedSite] = useState<(typeof mockSampleData)[0] | null>(null)
  const [filters, setFilters] = useState<MapFilters>({
    riskLevel: "all",
    metal: "all",
    searchTerm: "",
  })

  const filteredData = useMemo(() => {
    return mockSampleData.filter((site) => {
      const matchesRisk = filters.riskLevel === "all" || site.riskLevel === filters.riskLevel
      const matchesMetal = filters.metal === "all" || site.dominantMetal === filters.metal
      const matchesSearch =
        filters.searchTerm === "" ||
        site.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        site.id.toLowerCase().includes(filters.searchTerm.toLowerCase())

      return matchesRisk && matchesMetal && matchesSearch
    })
  }, [filters])

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-500 border-green-600"
      case "Moderate":
        return "bg-yellow-500 border-yellow-600"
      case "High":
        return "bg-orange-500 border-orange-600"
      case "Very High":
        return "bg-red-500 border-red-600"
      default:
        return "bg-gray-500 border-gray-600"
    }
  }

  const getRiskIcon = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "Low":
        return <CheckCircle className="h-3 w-3 text-white" />
      case "Moderate":
        return <Info className="h-3 w-3 text-white" />
      case "High":
      case "Very High":
        return <AlertTriangle className="h-3 w-3 text-white" />
      default:
        return <Info className="h-3 w-3 text-white" />
    }
  }

  const getMarkerSize = (hmpi: number) => {
    if (hmpi <= 100) return "h-6 w-6"
    if (hmpi <= 200) return "h-7 w-7"
    if (hmpi <= 300) return "h-8 w-8"
    return "h-9 w-9"
  }

  // Calculate map bounds
  const bounds = useMemo(() => {
    if (filteredData.length === 0) return null

    const lats = filteredData.map((site) => site.latitude)
    const lngs = filteredData.map((site) => site.longitude)

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    }
  }, [filteredData])

  // Convert lat/lng to SVG coordinates
  const getMapPosition = (lat: number, lng: number) => {
    if (!bounds) return { x: 0, y: 0 }

    const mapWidth = 800
    const mapHeight = 600
    const padding = 50

    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (mapWidth - 2 * padding) + padding
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (mapHeight - 2 * padding) + padding

    return { x, y }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map and Controls */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Map Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select
                  value={filters.riskLevel}
                  onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
                    <SelectItem value="Moderate">Moderate Risk</SelectItem>
                    <SelectItem value="High">High Risk</SelectItem>
                    <SelectItem value="Very High">Very High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dominant Metal</Label>
                <Select value={filters.metal} onValueChange={(value) => setFilters({ ...filters, metal: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metals</SelectItem>
                    <SelectItem value="Pb">Lead (Pb)</SelectItem>
                    <SelectItem value="Cd">Cadmium (Cd)</SelectItem>
                    <SelectItem value="Cr">Chromium (Cr)</SelectItem>
                    <SelectItem value="As">Arsenic (As)</SelectItem>
                    <SelectItem value="Hg">Mercury (Hg)</SelectItem>
                    <SelectItem value="Cu">Copper (Cu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sites..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ riskLevel: "all", metal: "all", searchTerm: "" })}
                  className="w-full bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Satellite Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              New York City - Heavy Metal Pollution Monitoring Sites
            </CardTitle>
            <CardDescription>
              Satellite view with monitoring sites. Click on markers to view detailed information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted/20 rounded-lg overflow-hidden">
              <svg width="100%" height="600" viewBox="0 0 800 600" className="border border-border rounded-lg">
                <defs>
                  <radialGradient id="urbanGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#d1d5db" />
                  </radialGradient>

                  <pattern id="satelliteWater" width="30" height="30" patternUnits="userSpaceOnUse">
                    <rect width="30" height="30" fill="#1e40af" />
                    <path d="M0,15 Q7.5,10 15,15 T30,15" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.6" />
                    <path d="M0,20 Q7.5,25 15,20 T30,20" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.4" />
                  </pattern>

                  <pattern id="satellitePark" width="25" height="25" patternUnits="userSpaceOnUse">
                    <rect width="25" height="25" fill="#166534" />
                    <circle cx="8" cy="8" r="3" fill="#22c55e" opacity="0.7" />
                    <circle cx="17" cy="17" r="2" fill="#16a34a" opacity="0.8" />
                    <path d="M5,20 Q12,15 20,20" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.5" />
                  </pattern>

                  <pattern id="urbanArea" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#f3f4f6" />
                    <rect x="2" y="2" width="6" height="8" fill="#9ca3af" opacity="0.6" />
                    <rect x="12" y="5" width="4" height="6" fill="#6b7280" opacity="0.7" />
                    <rect x="6" y="12" width="8" height="4" fill="#9ca3af" opacity="0.5" />
                  </pattern>

                  <pattern id="industrial" width="15" height="15" patternUnits="userSpaceOnUse">
                    <rect width="15" height="15" fill="#374151" />
                    <rect x="2" y="2" width="4" height="6" fill="#6b7280" />
                    <rect x="8" y="4" width="3" height="8" fill="#4b5563" />
                    <circle cx="12" cy="3" r="1" fill="#9ca3af" />
                  </pattern>

                  <filter id="satelliteShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
                  </filter>
                </defs>

                <rect width="100%" height="100%" fill="url(#urbanGradient)" />

                {/* Terrain elevation shadows */}
                <ellipse cx="400" cy="300" rx="350" ry="250" fill="rgba(0,0,0,0.05)" />
                <ellipse cx="200" cy="200" rx="150" ry="100" fill="rgba(0,0,0,0.03)" />

                {/* Water bodies - Hudson River (realistic shape) */}
                <path
                  d="M0,180 Q50,160 80,180 L85,200 Q90,220 95,240 L100,280 Q95,320 90,360 L85,400 Q80,420 50,440 Q20,420 0,400 Z"
                  fill="url(#satelliteWater)"
                  filter="url(#satelliteShadow)"
                />

                {/* East River */}
                <path
                  d="M680,120 Q720,100 750,120 L760,140 Q765,180 760,220 L755,280 Q750,340 745,380 L740,420 Q720,440 680,420 L675,380 Q680,340 685,300 L690,260 Q685,220 680,180 Z"
                  fill="url(#satelliteWater)"
                  filter="url(#satelliteShadow)"
                />

                {/* New York Harbor */}
                <path
                  d="M150,480 Q300,460 450,480 Q600,500 650,520 L650,570 Q500,590 350,570 Q200,550 150,530 Z"
                  fill="url(#satelliteWater)"
                  filter="url(#satelliteShadow)"
                />

                {/* Central Park (realistic rectangular shape) */}
                <rect
                  x="320"
                  y="160"
                  width="160"
                  height="280"
                  fill="url(#satellitePark)"
                  rx="8"
                  filter="url(#satelliteShadow)"
                />

                {/* Prospect Park */}
                <ellipse cx="350" cy="470" rx="45" ry="65" fill="url(#satellitePark)" filter="url(#satelliteShadow)" />

                {/* Van Cortlandt Park (Bronx) */}
                <ellipse cx="420" cy="80" rx="35" ry="25" fill="url(#satellitePark)" filter="url(#satelliteShadow)" />

                {/* Manhattan urban areas */}
                <rect x="200" y="150" width="120" height="350" fill="url(#urbanArea)" opacity="0.8" />
                <rect x="480" y="150" width="200" height="350" fill="url(#urbanArea)" opacity="0.8" />

                {/* Brooklyn industrial zones */}
                <rect x="300" y="520" width="180" height="60" fill="url(#industrial)" opacity="0.9" />

                {/* Queens residential areas */}
                <rect x="500" y="200" width="150" height="200" fill="url(#urbanArea)" opacity="0.7" />

                {/* Major highways and bridges */}
                <path d="M100,300 Q400,290 700,300" stroke="#4b5563" strokeWidth="4" opacity="0.8" />
                <path d="M400,100 L400,500" stroke="#4b5563" strokeWidth="3" opacity="0.7" />
                <path d="M200,200 L600,400" stroke="#6b7280" strokeWidth="2" opacity="0.6" />

                {/* Brooklyn Bridge */}
                <line x1="320" y1="480" x2="480" y2="480" stroke="#374151" strokeWidth="3" opacity="0.9" />
                <circle cx="350" cy="480" r="3" fill="#6b7280" />
                <circle cx="450" cy="480" r="3" fill="#6b7280" />

                {/* Manhattan Bridge */}
                <line x1="340" y1="500" x2="500" y2="500" stroke="#374151" strokeWidth="2" opacity="0.8" />

                {/* Street grid (more realistic satellite view) */}
                {Array.from({ length: 12 }, (_, i) => (
                  <g key={`street-v-${i}`}>
                    <line
                      x1={220 + i * 25}
                      y1="150"
                      x2={220 + i * 25}
                      y2="500"
                      stroke="#9ca3af"
                      strokeWidth="0.8"
                      opacity="0.4"
                    />
                  </g>
                ))}
                {Array.from({ length: 16 }, (_, i) => (
                  <g key={`street-h-${i}`}>
                    <line
                      x1="200"
                      y1={160 + i * 22}
                      x2="680"
                      y2={160 + i * 22}
                      stroke="#9ca3af"
                      strokeWidth="0.6"
                      opacity="0.3"
                    />
                  </g>
                ))}

                {/* Major landmarks with satellite-style appearance */}
                <g filter="url(#satelliteShadow)">
                  {/* Times Square area */}
                  <rect x="375" y="275" width="50" height="50" fill="#fbbf24" opacity="0.9" rx="3" />
                  <rect x="380" y="280" width="15" height="20" fill="#f59e0b" />
                  <rect x="400" y="285" width="12" height="15" fill="#d97706" />
                  <text x="400" y="340" textAnchor="middle" className="text-xs fill-amber-700 font-bold">
                    Times Square
                  </text>

                  {/* Financial District */}
                  <rect x="280" y="450" width="40" height="40" fill="#64748b" opacity="0.9" rx="2" />
                  <rect x="285" y="455" width="8" height="25" fill="#475569" />
                  <rect x="295" y="460" width="6" height="20" fill="#334155" />
                  <rect x="305" y="465" width="10" height="15" fill="#475569" />
                  <text x="300" y="505" textAnchor="middle" className="text-xs fill-slate-700 font-bold">
                    Financial District
                  </text>

                  {/* Empire State Building area */}
                  <rect x="360" y="320" width="8" height="25" fill="#6366f1" opacity="0.9" />
                  <circle cx="364" cy="315" r="2" fill="#4f46e5" />
                </g>

                {/* Borough boundaries (subtle satellite-style) */}
                <path
                  d="M200,150 L680,150 L680,520 L200,520 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="8,4"
                />

                {/* Borough labels with satellite styling */}
                <text x="280" y="140" textAnchor="middle" className="text-sm fill-white font-bold drop-shadow-lg">
                  MANHATTAN
                </text>
                <text x="580" y="140" textAnchor="middle" className="text-sm fill-white font-bold drop-shadow-lg">
                  QUEENS
                </text>
                <text x="380" y="550" textAnchor="middle" className="text-sm fill-white font-bold drop-shadow-lg">
                  BROOKLYN
                </text>
                <text x="450" y="100" textAnchor="middle" className="text-sm fill-white font-bold drop-shadow-lg">
                  BRONX
                </text>

                {/* Map markers with enhanced satellite visibility */}
                {filteredData.map((site) => {
                  const position = getMapPosition(site.latitude, site.longitude)
                  const isSelected = selectedSite?.id === site.id

                  return (
                    <g key={site.id}>
                      {/* Selection ring */}
                      {isSelected && (
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r={site.hmpi <= 100 ? 15 : site.hmpi <= 200 ? 17 : site.hmpi <= 300 ? 19 : 21}
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="3"
                          opacity="0.8"
                          className="animate-pulse"
                        />
                      )}
                      {/* Enhanced marker shadow for satellite view */}
                      <circle
                        cx={position.x + 2}
                        cy={position.y + 2}
                        r={site.hmpi <= 100 ? 10 : site.hmpi <= 200 ? 12 : site.hmpi <= 300 ? 14 : 16}
                        fill="rgba(0,0,0,0.4)"
                      />
                      {/* Main marker with satellite-style appearance */}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={site.hmpi <= 100 ? 10 : site.hmpi <= 200 ? 12 : site.hmpi <= 300 ? 14 : 16}
                        className={cn(
                          "cursor-pointer transition-all duration-200 stroke-2 hover:stroke-4",
                          getRiskColor(site.riskLevel),
                          isSelected ? "stroke-sky-400 stroke-4" : "stroke-white",
                        )}
                        onClick={() => setSelectedSite(site)}
                        filter="url(#satelliteShadow)"
                      />
                      {/* Risk icon */}
                      <foreignObject
                        x={position.x - 8}
                        y={position.y - 8}
                        width="16"
                        height="16"
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center h-full">{getRiskIcon(site.riskLevel)}</div>
                      </foreignObject>
                      {/* Site label with better visibility on satellite imagery */}
                      <text
                        x={position.x}
                        y={position.y + (site.hmpi <= 100 ? 24 : site.hmpi <= 200 ? 26 : site.hmpi <= 300 ? 28 : 30)}
                        textAnchor="middle"
                        className="text-xs fill-white font-bold drop-shadow-lg"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        {site.id}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Enhanced Legend for satellite view */}
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-gray-600 rounded-lg p-3 space-y-3 shadow-xl text-white">
                <div className="text-sm font-semibold text-white">Risk Levels</div>
                {["Low", "Moderate", "High", "Very High"].map((level) => (
                  <div key={level} className="flex items-center gap-2 text-xs">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 border-white shadow-lg",
                        getRiskColor(level as RiskLevel),
                      )}
                    />
                    <span className="font-medium text-white">{level}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="text-xs text-gray-300">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-blue-600 border border-blue-400 rounded"></div>
                      <span>Water Bodies</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-green-700 border border-green-500 rounded"></div>
                      <span>Parks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-400 border border-gray-300 rounded"></div>
                      <span>Urban Areas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Details Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Site Information
            </CardTitle>
            <CardDescription>
              {selectedSite ? "Details for selected monitoring site" : "Select a site on the map to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSite ? (
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold">{selectedSite.location}</div>
                  <div className="text-sm text-muted-foreground">{selectedSite.id}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">HMPI Score</span>
                    <span className="font-medium">{selectedSite.hmpi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Level</span>
                    <Badge className={getRiskColor(selectedSite.riskLevel)}>
                      {getRiskIcon(selectedSite.riskLevel)}
                      {selectedSite.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dominant Metal</span>
                    <span className="font-medium">{selectedSite.dominantMetal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Collection Date</span>
                    <span className="font-medium">{selectedSite.collectionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Depth</span>
                    <span className="font-medium">{selectedSite.depth}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Coordinates</span>
                    <span className="font-medium text-xs">
                      {selectedSite.latitude.toFixed(4)}, {selectedSite.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                {selectedSite.metalConcentrations && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-2">Metal Concentrations (mg/L)</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Lead (Pb):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.Pb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cadmium (Cd):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.Cd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arsenic (As):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.As}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mercury (Hg):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.Hg}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chromium (Cr):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.Cr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Copper (Cu):</span>
                        <span className="font-medium">{selectedSite.metalConcentrations.Cu}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSite.waterQuality && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-2">Water Quality Parameters</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>pH:</span>
                        <span className="font-medium">{selectedSite.waterQuality.pH}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-medium">{selectedSite.waterQuality.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dissolved O₂:</span>
                        <span className="font-medium">{selectedSite.waterQuality.dissolvedOxygen} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turbidity:</span>
                        <span className="font-medium">{selectedSite.waterQuality.turbidity} NTU</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <Button className="w-full" size="sm">
                    View Full Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a marker to view site details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Overview of filtered monitoring sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Sites</span>
                <span className="font-medium">{filteredData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">High Risk Sites</span>
                <span className="font-medium text-destructive">
                  {filteredData.filter((site) => site.riskLevel === "High" || site.riskLevel === "Very High").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average HMPI</span>
                <span className="font-medium">
                  {filteredData.length > 0
                    ? (filteredData.reduce((sum, site) => sum + site.hmpi, 0) / filteredData.length).toFixed(1)
                    : "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
