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
    location: "New York Site A",
    hmpi: 85.2,
    riskLevel: "Low" as const,
    dominantMetal: "Pb",
    collectionDate: "2024-01-15",
    depth: 15.5,
  },
  {
    id: "GW-2024-002",
    latitude: 40.7589,
    longitude: -73.9851,
    location: "New York Site B",
    hmpi: 145.8,
    riskLevel: "Moderate" as const,
    dominantMetal: "Cd",
    collectionDate: "2024-01-16",
    depth: 22.3,
  },
  {
    id: "GW-2024-003",
    latitude: 40.6892,
    longitude: -74.0445,
    location: "New York Site C",
    hmpi: 275.4,
    riskLevel: "High" as const,
    dominantMetal: "As",
    collectionDate: "2024-01-17",
    depth: 18.7,
  },
  {
    id: "GW-2024-004",
    latitude: 40.7282,
    longitude: -73.7949,
    location: "Queens Site A",
    hmpi: 95.1,
    riskLevel: "Low" as const,
    dominantMetal: "Cu",
    collectionDate: "2024-01-18",
    depth: 12.1,
  },
  {
    id: "GW-2024-005",
    latitude: 40.6782,
    longitude: -73.9442,
    location: "Brooklyn Site A",
    hmpi: 320.7,
    riskLevel: "Very High" as const,
    dominantMetal: "Hg",
    collectionDate: "2024-01-19",
    depth: 25.8,
  },
  {
    id: "GW-2024-006",
    latitude: 40.8176,
    longitude: -73.9782,
    location: "Bronx Site A",
    hmpi: 165.3,
    riskLevel: "Moderate" as const,
    dominantMetal: "Cr",
    collectionDate: "2024-01-20",
    depth: 19.4,
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

        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pollution Monitoring Sites
            </CardTitle>
            <CardDescription>
              Click on markers to view detailed information. Marker size indicates pollution level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted/20 rounded-lg overflow-hidden">
              <svg width="100%" height="600" viewBox="0 0 800 600" className="border border-border rounded-lg">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Map markers */}
                {filteredData.map((site) => {
                  const position = getMapPosition(site.latitude, site.longitude)
                  const isSelected = selectedSite?.id === site.id

                  return (
                    <g key={site.id}>
                      {/* Marker */}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={site.hmpi <= 100 ? 8 : site.hmpi <= 200 ? 10 : site.hmpi <= 300 ? 12 : 14}
                        className={cn(
                          "cursor-pointer transition-all duration-200 stroke-2",
                          getRiskColor(site.riskLevel),
                          isSelected ? "stroke-foreground stroke-4" : "stroke-white",
                        )}
                        onClick={() => setSelectedSite(site)}
                      />
                      {/* Risk icon */}
                      <foreignObject
                        x={position.x - 6}
                        y={position.y - 6}
                        width="12"
                        height="12"
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center h-full">{getRiskIcon(site.riskLevel)}</div>
                      </foreignObject>
                      {/* Site label */}
                      <text
                        x={position.x}
                        y={position.y + 25}
                        textAnchor="middle"
                        className="text-xs fill-foreground font-medium"
                      >
                        {site.id}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute top-4 right-4 bg-background/95 backdrop-blur border border-border rounded-lg p-3 space-y-2">
                <div className="text-sm font-medium">Risk Levels</div>
                {["Low", "Moderate", "High", "Very High"].map((level) => (
                  <div key={level} className="flex items-center gap-2 text-xs">
                    <div className={cn("w-3 h-3 rounded-full border", getRiskColor(level as RiskLevel))} />
                    <span>{level}</span>
                  </div>
                ))}
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
