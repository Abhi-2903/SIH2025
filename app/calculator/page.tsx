import { DashboardLayout } from "@/components/dashboard-layout"
import { HMPICalculator } from "@/components/hmpi-calculator"

export default function CalculatorPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">HMPI Calculator</h2>
          <p className="text-muted-foreground">
            Compute Heavy Metal Pollution Indices using standard WHO/EPA methodologies
          </p>
        </div>
        <HMPICalculator />
      </div>
    </DashboardLayout>
  )
}
