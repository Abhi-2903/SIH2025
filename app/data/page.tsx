import { DashboardLayout } from "@/components/dashboard-layout"
import { DataManagement } from "@/components/data-management"

export default function DataPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Data Management</h2>
          <p className="text-muted-foreground">Manage, organize, and export your groundwater sample database</p>
        </div>
        <DataManagement />
      </div>
    </DashboardLayout>
  )
}
