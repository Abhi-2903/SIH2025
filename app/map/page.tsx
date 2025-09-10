import { DashboardLayout } from "@/components/dashboard-layout"
import { GeospatialMap } from "@/components/geospatial-map"

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Geospatial Pollution Map</h2>
          <p className="text-muted-foreground">
            Interactive map showing heavy metal pollution levels across monitoring sites
          </p>
        </div>
        <GeospatialMap />
      </div>
    </DashboardLayout>
  )
}
