import { DashboardLayout } from "@/components/dashboard-layout"
import { DataInputForm } from "@/components/data-input-form"

export default function DataInputPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Groundwater Sample Data Entry</h2>
          <p className="text-muted-foreground">
            Enter heavy metal concentration data for groundwater samples with geographic coordinates
          </p>
        </div>
        <DataInputForm />
      </div>
    </DashboardLayout>
  )
}
