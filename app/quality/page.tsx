import { DashboardLayout } from "@/components/dashboard-layout"
import { QualityCategorization } from "@/components/quality-categorization"

export default function QualityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Water Quality Categorization</h2>
          <p className="text-muted-foreground">
            Assess groundwater quality and compliance with international standards
          </p>
        </div>
        <QualityCategorization />
      </div>
    </DashboardLayout>
  )
}
