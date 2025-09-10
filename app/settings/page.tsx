import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Shield, Database, Download } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your Heavy Metal Pollution Indices application</p>
      </div>

      {/* User Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Profile</span>
          </CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name" defaultValue="Dr. Sarah" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name" defaultValue="Johnson" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" defaultValue="sarah.johnson@university.edu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              placeholder="Enter your organization"
              defaultValue="Environmental Research Institute"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="researcher">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="scientist">Environmental Scientist</SelectItem>
                <SelectItem value="policymaker">Policy Maker</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Application Settings</span>
          </CardTitle>
          <CardDescription>Configure application behavior and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Default Units</Label>
                <p className="text-sm text-gray-600">Choose default measurement units</p>
              </div>
              <Select defaultValue="mg-l">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg-l">mg/L</SelectItem>
                  <SelectItem value="ug-l">μg/L</SelectItem>
                  <SelectItem value="ppm">PPM</SelectItem>
                  <SelectItem value="ppb">PPB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Temperature Units</Label>
                <p className="text-sm text-gray-600">Temperature measurement units</p>
              </div>
              <Select defaultValue="celsius">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Coordinate System</Label>
                <p className="text-sm text-gray-600">Geographic coordinate system</p>
              </div>
              <Select defaultValue="wgs84">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wgs84">WGS84</SelectItem>
                  <SelectItem value="utm">UTM</SelectItem>
                  <SelectItem value="nad83">NAD83</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Interval</Label>
                <p className="text-sm text-gray-600">Automatically save data every</p>
              </div>
              <Select defaultValue="5min">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1min">1 minute</SelectItem>
                  <SelectItem value="5min">5 minutes</SelectItem>
                  <SelectItem value="10min">10 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Configure alert and notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Risk Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when HMPI exceeds critical thresholds</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Quality Warnings</Label>
              <p className="text-sm text-gray-600">Alerts for data validation issues</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Report Generation</Label>
              <p className="text-sm text-gray-600">Notifications when reports are ready</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Updates</Label>
              <p className="text-sm text-gray-600">Updates about new features and improvements</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Input
              id="email-notifications"
              type="email"
              placeholder="notification@email.com"
              defaultValue="sarah.johnson@university.edu"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Configure data storage and backup preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-gray-600">Automatically backup data daily</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Retention</Label>
              <p className="text-sm text-gray-600">How long to keep historical data</p>
            </div>
            <Select defaultValue="5years">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="3years">3 Years</SelectItem>
                <SelectItem value="5years">5 Years</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Format</Label>
              <p className="text-sm text-gray-600">Default format for data exports</p>
            </div>
            <Select defaultValue="csv">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>Manage security and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Enabled</Badge>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
            <Select defaultValue="30min">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
                <SelectItem value="4hours">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Encryption</Label>
              <p className="text-sm text-gray-600">Encrypt sensitive data at rest</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Active</Badge>
              <Switch defaultChecked disabled />
            </div>
          </div>

          <Separator />

          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
