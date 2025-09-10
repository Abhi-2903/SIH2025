"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity } from "lucide-react"

// Mock data for analysis - in real app this would come from database
const monthlyTrends = [
  { month: "Jan 2024", avgHMPI: 125.4, samples: 45, highRisk: 8 },
  { month: "Feb 2024", avgHMPI: 132.1, samples: 52, highRisk: 12 },
  { month: "Mar 2024", avgHMPI: 118.7, samples: 48, highRisk: 6 },
  { month: "Apr 2024", avgHMPI: 145.2, samples: 55, highRisk: 15 },
  { month: "May 2024", avgHMPI: 139.8, samples: 61, highRisk: 13 },
  { month: "Jun 2024", avgHMPI: 156.3, samples: 58, highRisk: 18 },
]

const metalDistribution = [
  { metal: "Lead (Pb)", count: 89, percentage: 28.5, avgConcentration: 0.045 },
  { metal: "Cadmium (Cd)", count: 67, percentage: 21.5, avgConcentration: 0.012 },
  { metal: "Arsenic (As)", count: 54, percentage: 17.3, avgConcentration: 0.018 },
  { metal: "Mercury (Hg)", count: 43, percentage: 13.8, avgConcentration: 0.008 },
  { metal: "Chromium (Cr)", count: 35, percentage: 11.2, avgConcentration: 0.032 },
  { metal: "Copper (Cu)", count: 24, percentage: 7.7, avgConcentration: 0.156 },
]

const riskDistribution = [
  { level: "Low", count: 156, percentage: 52.3, color: "#10b981" },
  { level: "Moderate", count: 89, percentage: 29.8, color: "#f59e0b" },
  { level: "High", count: 42, percentage: 14.1, color: "#f97316" },
  { level: "Very High", count: 11, percentage: 3.8, color: "#dc2626" },
]

const siteComparison = [
  { site: "Site A", hmpi: 95.2, samples: 24, dominantMetal: "Pb", riskLevel: "Low" },
  { site: "Site B", hmpi: 145.8, samples: 31, dominantMetal: "Cd", riskLevel: "Moderate" },
  { site: "Site C", hmpi: 275.4, samples: 18, dominantMetal: "As", riskLevel: "High" },
  { site: "Site D", hmpi: 89.1, samples: 22, dominantMetal: "Cu", riskLevel: "Low" },
  { site: "Site E", hmpi: 320.7, samples: 15, dominantMetal: "Hg", riskLevel: "Very High" },
  { site: "Site F", hmpi: 165.3, samples: 28, dominantMetal: "Cr", riskLevel: "Moderate" },
]

const correlationData = [
  { depth: 10, hmpi: 85, pH: 7.2, temperature: 18 },
  { depth: 15, hmpi: 125, pH: 6.8, temperature: 19 },
  { depth: 20, hmpi: 165, pH: 6.5, temperature: 20 },
  { depth: 25, hmpi: 195, pH: 6.2, temperature: 21 },
  { depth: 30, hmpi: 245, pH: 5.9, temperature: 22 },
  { depth: 35, hmpi: 285, pH: 5.6, temperature: 23 },
]

export function AnalysisDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("hmpi")

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Analysis Parameters
          </CardTitle>
          <CardDescription>Configure analysis timeframe and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hmpi">HMPI Score</SelectItem>
                  <SelectItem value="concentration">Concentration</SelectItem>
                  <SelectItem value="risk">Risk Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="bg-transparent">
                Export Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Temporal Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Site Comparison</TabsTrigger>
          <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
        </TabsList>

        {/* Temporal Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  HMPI Trends Over Time
                </CardTitle>
                <CardDescription>Monthly average pollution indices</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgHMPI" stroke="#6366f1" strokeWidth={2} name="Average HMPI" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Volume & Risk Sites</CardTitle>
                <CardDescription>Monthly sampling activity and high-risk detections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="samples" fill="#10b981" name="Total Samples" />
                    <Bar dataKey="highRisk" fill="#dc2626" name="High Risk Sites" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis Insights</CardTitle>
              <CardDescription>Key findings from temporal analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">↓ 12.5%</div>
                  <div className="text-sm text-muted-foreground">Average HMPI reduction since peak</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">↑ 23%</div>
                  <div className="text-sm text-muted-foreground">Increase in monitoring coverage</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">June</div>
                  <div className="text-sm text-muted-foreground">Peak pollution month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Analysis */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Risk Level Distribution
                </CardTitle>
                <CardDescription>Proportion of sites by risk category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, percentage }) => `${level}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heavy Metal Detection Frequency</CardTitle>
                <CardDescription>Most commonly detected metals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metalDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="metal" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Metal Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Heavy Metal Statistics</CardTitle>
              <CardDescription>Detailed breakdown by metal type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metalDistribution.map((metal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{metal.metal}</div>
                      <div className="text-sm text-muted-foreground">
                        {metal.count} detections ({metal.percentage}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{metal.avgConcentration} mg/L</div>
                      <div className="text-sm text-muted-foreground">Avg. concentration</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Site Performance Comparison
              </CardTitle>
              <CardDescription>HMPI scores across monitoring locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={siteComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hmpi" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Details Comparison</CardTitle>
              <CardDescription>Comprehensive site-by-site analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteComparison.map((site, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{site.site}</div>
                        <div className="text-sm text-muted-foreground">{site.samples} samples</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">HMPI: {site.hmpi}</div>
                        <div className="text-sm text-muted-foreground">Dominant: {site.dominantMetal}</div>
                      </div>
                      <Badge
                        className={
                          site.riskLevel === "Low"
                            ? "bg-green-100 text-green-800"
                            : site.riskLevel === "Moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : site.riskLevel === "High"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {site.riskLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlation Analysis */}
        <TabsContent value="correlation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Depth vs HMPI Correlation</CardTitle>
                <CardDescription>Relationship between sampling depth and pollution levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="depth" name="Depth (m)" />
                    <YAxis dataKey="hmpi" name="HMPI" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="hmpi" fill="#6366f1" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>pH vs HMPI Correlation</CardTitle>
                <CardDescription>Impact of pH levels on heavy metal mobility</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pH" name="pH Level" />
                    <YAxis dataKey="hmpi" name="HMPI" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="hmpi" fill="#f59e0b" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Correlation Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Correlation Analysis Results</CardTitle>
              <CardDescription>Statistical relationships between environmental factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-lg font-semibold">Depth Correlation</div>
                  <div className="text-2xl font-bold text-orange-600">r = 0.89</div>
                  <div className="text-sm text-muted-foreground">Strong positive correlation</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-lg font-semibold">pH Correlation</div>
                  <div className="text-2xl font-bold text-red-600">r = -0.92</div>
                  <div className="text-sm text-muted-foreground">Strong negative correlation</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-lg font-semibold">Temperature</div>
                  <div className="text-2xl font-bold text-blue-600">r = 0.76</div>
                  <div className="text-sm text-muted-foreground">Moderate positive correlation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
