import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle, Database, MapPin, TrendingUp, Beaker } from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Environmental Monitoring Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and analyze heavy metal pollution indices in groundwater systems
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitoring Sites</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Across 15 regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Areas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82</div>
            <p className="text-xs text-muted-foreground">Within acceptable limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Input New Data</CardTitle>
                <CardDescription>Add groundwater sample data with coordinates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Data Entry</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Beaker className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Calculate HMPI</CardTitle>
                <CardDescription>Compute pollution indices using standard formulas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Open Calculator
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">View Analysis</CardTitle>
                <CardDescription>Explore trends and generate reports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates from your monitoring network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "New samples processed from Site A-12",
                description: "Heavy metal analysis completed for 15 groundwater samples",
                time: "2 hours ago",
                status: "completed",
              },
              {
                title: "High pollution detected at Site B-07",
                description: "Lead levels exceed safe limits - immediate action required",
                time: "4 hours ago",
                status: "warning",
              },
              {
                title: "Monthly report generated",
                description: "Regional pollution assessment for December 2024",
                time: "1 day ago",
                status: "info",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 last:pb-0">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    activity.status === "completed"
                      ? "bg-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "completed"
                      ? "default"
                      : activity.status === "warning"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
