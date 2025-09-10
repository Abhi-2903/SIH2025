"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Database,
  Search,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"

// Mock data for demonstration
const mockSampleData = [
  {
    id: "GW-2024-001",
    location: "New York Site A",
    latitude: 40.7128,
    longitude: -74.006,
    collectionDate: "2024-01-15",
    depth: 15.5,
    pH: 7.2,
    temperature: 18.5,
    hmpi: 85.2,
    riskLevel: "Low" as const,
    qualityCategory: "Good" as const,
    dominantMetal: "Pb",
    metalCount: 3,
    status: "Validated" as const,
    lastModified: "2024-01-16",
  },
  {
    id: "GW-2024-002",
    location: "New York Site B",
    latitude: 40.7589,
    longitude: -73.9851,
    collectionDate: "2024-01-16",
    depth: 22.3,
    pH: 6.8,
    temperature: 19.2,
    hmpi: 145.8,
    riskLevel: "Moderate" as const,
    qualityCategory: "Fair" as const,
    dominantMetal: "Cd",
    metalCount: 4,
    status: "Pending Review" as const,
    lastModified: "2024-01-17",
  },
  {
    id: "GW-2024-003",
    location: "New York Site C",
    latitude: 40.6892,
    longitude: -74.0445,
    collectionDate: "2024-01-17",
    depth: 18.7,
    pH: 6.5,
    temperature: 20.1,
    hmpi: 275.4,
    riskLevel: "High" as const,
    qualityCategory: "Poor" as const,
    dominantMetal: "As",
    metalCount: 5,
    status: "Validated" as const,
    lastModified: "2024-01-18",
  },
  {
    id: "GW-2024-004",
    location: "Queens Site A",
    latitude: 40.7282,
    longitude: -73.7949,
    collectionDate: "2024-01-18",
    depth: 12.1,
    pH: 7.0,
    temperature: 18.8,
    hmpi: 95.1,
    riskLevel: "Low" as const,
    qualityCategory: "Good" as const,
    dominantMetal: "Cu",
    metalCount: 2,
    status: "Draft" as const,
    lastModified: "2024-01-19",
  },
  {
    id: "GW-2024-005",
    location: "Brooklyn Site A",
    latitude: 40.6782,
    longitude: -73.9442,
    collectionDate: "2024-01-19",
    depth: 25.8,
    pH: 5.9,
    temperature: 21.5,
    hmpi: 320.7,
    riskLevel: "Very High" as const,
    qualityCategory: "Unacceptable" as const,
    dominantMetal: "Hg",
    metalCount: 6,
    status: "Validated" as const,
    lastModified: "2024-01-20",
  },
]

type SampleData = (typeof mockSampleData)[0]
type SortField = keyof SampleData
type SortDirection = "asc" | "desc"

export function DataManagement() {
  const [samples, setSamples] = useState(mockSampleData)
  const [selectedSamples, setSelectedSamples] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("collectionDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showImportDialog, setShowImportDialog] = useState(false)

  // Filtered and sorted data
  const filteredAndSortedSamples = useMemo(() => {
    const filtered = samples.filter((sample) => {
      const matchesSearch =
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.dominantMetal.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || sample.status === statusFilter
      const matchesRisk = riskFilter === "all" || sample.riskLevel === riskFilter

      return matchesSearch && matchesStatus && matchesRisk
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [samples, searchTerm, statusFilter, riskFilter, sortField, sortDirection])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSamples(filteredAndSortedSamples.map((sample) => sample.id))
    } else {
      setSelectedSamples([])
    }
  }

  const handleSelectSample = (sampleId: string, checked: boolean) => {
    if (checked) {
      setSelectedSamples([...selectedSamples, sampleId])
    } else {
      setSelectedSamples(selectedSamples.filter((id) => id !== sampleId))
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSamples.length} samples?`)) {
      setSamples(samples.filter((sample) => !selectedSamples.includes(sample.id)))
      setSelectedSamples([])
    }
  }

  const handleExportData = (format: "csv" | "json" | "excel") => {
    const dataToExport =
      selectedSamples.length > 0
        ? samples.filter((sample) => selectedSamples.includes(sample.id))
        : filteredAndSortedSamples

    if (format === "csv") {
      console.log("[v0] Starting CSV export for", dataToExport.length, "samples")

      const csvHeaders = [
        "Sample ID",
        "Location",
        "Latitude",
        "Longitude",
        "Collection Date",
        "Depth (m)",
        "pH",
        "Temperature (°C)",
        "HMPI Score",
        "Risk Level",
        "Quality Category",
        "Dominant Metal",
        "Metal Count",
        "Lead (mg/L)",
        "Cadmium (mg/L)",
        "Arsenic (mg/L)",
        "Mercury (mg/L)",
        "Chromium (mg/L)",
        "Copper (mg/L)",
        "Status",
        "Last Modified",
      ]

      const csvData = dataToExport.map((sample) => [
        sample.id,
        sample.location,
        sample.latitude,
        sample.longitude,
        sample.collectionDate,
        sample.depth,
        sample.pH,
        sample.temperature,
        sample.hmpi,
        sample.riskLevel,
        sample.qualityCategory,
        sample.dominantMetal,
        sample.metalCount,
        // Sample heavy metal concentrations based on HMPI and dominant metal
        sample.dominantMetal === "Pb" ? (sample.hmpi * 0.0001).toFixed(4) : (Math.random() * 0.01).toFixed(4),
        sample.dominantMetal === "Cd" ? (sample.hmpi * 0.00005).toFixed(4) : (Math.random() * 0.005).toFixed(4),
        sample.dominantMetal === "As" ? (sample.hmpi * 0.00008).toFixed(4) : (Math.random() * 0.01).toFixed(4),
        sample.dominantMetal === "Hg" ? (sample.hmpi * 0.00003).toFixed(4) : (Math.random() * 0.002).toFixed(4),
        sample.dominantMetal === "Cr" ? (sample.hmpi * 0.0002).toFixed(4) : (Math.random() * 0.05).toFixed(4),
        sample.dominantMetal === "Cu" ? (sample.hmpi * 0.0005).toFixed(4) : (Math.random() * 0.1).toFixed(4),
        sample.status,
        sample.lastModified,
      ])

      const csvContent = [csvHeaders, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

      console.log("[v0] CSV content generated, length:", csvContent.length)

      try {
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
        const fileName = `heavy_metal_pollution_data_${new Date().toISOString().split("T")[0]}.csv`

        // Modern browsers
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          ;(window.navigator as any).msSaveOrOpenBlob(blob, fileName)
        } else {
          const link = document.createElement("a")
          const url = URL.createObjectURL(blob)

          link.setAttribute("href", url)
          link.setAttribute("download", fileName)
          link.style.visibility = "hidden"
          link.style.position = "absolute"
          link.style.left = "-9999px"

          document.body.appendChild(link)

          console.log("[v0] Triggering download for file:", fileName)

          // Force click and cleanup
          setTimeout(() => {
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            // Show success notification
            const notification = document.createElement("div")
            notification.innerHTML = `
              <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; font-family: system-ui; font-size: 14px;">
                ✅ CSV file downloaded successfully!<br>
                <small>${fileName} (${dataToExport.length} samples)</small>
              </div>
            `
            document.body.appendChild(notification)

            setTimeout(() => {
              if (notification.parentNode) {
                document.body.removeChild(notification)
              }
            }, 4000)

            console.log("[v0] CSV export completed successfully")
          }, 100)
        }
      } catch (error) {
        console.error("[v0] CSV export failed:", error)

        // Show error notification
        const errorNotification = document.createElement("div")
        errorNotification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; font-family: system-ui; font-size: 14px;">
            ❌ Failed to download CSV file<br>
            <small>Please try again or check your browser settings</small>
          </div>
        `
        document.body.appendChild(errorNotification)

        setTimeout(() => {
          if (errorNotification.parentNode) {
            document.body.removeChild(errorNotification)
          }
        }, 4000)
      }
    } else {
      // Keep existing mock behavior for JSON and Excel
      console.log(`Exporting ${dataToExport.length} samples as ${format.toUpperCase()}`)
      alert(`Exported ${dataToExport.length} samples as ${format.toUpperCase()}`)
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Very High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Validated":
        return "bg-green-100 text-green-800"
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management Controls
          </CardTitle>
          <CardDescription>Search, filter, and manage your groundwater sample database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search Samples</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, location, metal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Validated">Validated</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Risk Filter</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Moderate">Moderate Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                  <SelectItem value="Very High">Very High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collectionDate">Collection Date</SelectItem>
                  <SelectItem value="hmpi">HMPI Score</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="riskLevel">Risk Level</SelectItem>
                  <SelectItem value="lastModified">Last Modified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setRiskFilter("all")
                  setSortField("collectionDate")
                  setSortDirection("desc")
                }}
                className="w-full bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSamples.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedSamples.length} sample{selectedSamples.length !== 1 ? "s" : ""} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportData("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportData("json")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sample Database</CardTitle>
              <CardDescription>
                {filteredAndSortedSamples.length} of {samples.length} samples
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Sample Data</DialogTitle>
                    <DialogDescription>
                      Upload CSV, Excel (.xlsx), or JSON files to import sample data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Supported formats: CSV, Excel (.xlsx), JSON. Maximum file size: 10MB
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={() => handleExportData("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedSamples.length === filteredAndSortedSamples.length &&
                        filteredAndSortedSamples.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("id")}>
                    Sample ID
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("location")}>
                    Location
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("collectionDate")}>
                    Collection Date
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("hmpi")}>
                    HMPI
                  </TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Metals</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSamples.includes(sample.id)}
                        onCheckedChange={(checked) => handleSelectSample(sample.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {sample.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {sample.collectionDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sample.hmpi}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeColor(sample.riskLevel)}>{sample.riskLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sample.qualityCategory}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(sample.status)}>
                        {sample.status === "Validated" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {sample.status === "Pending Review" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {sample.metalCount} metals
                        <div className="text-xs text-muted-foreground">Primary: {sample.dominantMetal}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Data Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{samples.length}</div>
            <div className="text-sm text-muted-foreground">Total Samples</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {samples.filter((s) => s.status === "Validated").length}
            </div>
            <div className="text-sm text-muted-foreground">Validated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {samples.filter((s) => s.status === "Pending Review").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {samples.filter((s) => s.riskLevel === "High" || s.riskLevel === "Very High").length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
