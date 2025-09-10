"use client"

import type React from "react"
import { Droplets, FolderOpen } from "lucide-react" // Imported Droplets and FolderOpen icons

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Database, Map, FileText, Settings, Menu, X, Beaker, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Overview", href: "/", icon: Activity, current: false },
  { name: "Data Input", href: "/data-input", icon: Database, current: false },
  { name: "HMPI Calculator", href: "/calculator", icon: Beaker, current: false },
  { name: "Quality Assessment", href: "/quality", icon: Droplets, current: false }, // Added quality assessment navigation
  { name: "Geospatial View", href: "/map", icon: Map, current: false },
  { name: "Analysis", href: "/analysis", icon: BarChart3, current: false },
  { name: "Data Management", href: "/data", icon: FolderOpen, current: false }, // Added data management navigation
  { name: "Reports", href: "/reports", icon: FileText, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-sidebar lg:border-r lg:border-sidebar-border">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Heavy Metal Pollution Indices</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button size="sm">New Analysis</Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo and close button */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Beaker className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">HMPI Monitor</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.current
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/60">
          Environmental Monitoring System
          <br />
          Version 1.0.0
        </div>
      </div>
    </div>
  )
}
