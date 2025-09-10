import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalysisDashboard } from "@/components/analysis-dashboard"

export default function AnalysisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Pollution Analysis & Trends</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis of heavy metal pollution patterns and temporal trends
          </p>
        </div>
        <AnalysisDashboard />
      </div>
    </DashboardLayout>
  )
}
