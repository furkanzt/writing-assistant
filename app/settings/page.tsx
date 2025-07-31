"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Brain, User, Bell, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    targetExam: "ielts",
    emailNotifications: true,
    detailedFeedback: true,
  })

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setSettings((prevSettings) => ({
        ...prevSettings,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        targetExam: user.targetExam || "ielts",
      }))
    }
  }, [])

  const handleSave = () => {
    // Save updated user data to localStorage
    const userData = {
      firstName: settings.firstName,
      lastName: settings.lastName,
      email: settings.email,
      targetExam: settings.targetExam,
    }
    localStorage.setItem("userData", JSON.stringify(userData))

    // In a real app, you would also save preferences to your backend
    console.log("Settings saved:", settings)

    // Show a success message (you could add a toast notification here)
    alert("Settings saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">Settings</span>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.firstName}
                      onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.lastName}
                      onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="targetExam">Target Exam</Label>
                  <Select
                    value={settings.targetExam}
                    onValueChange={(value) => setSettings({ ...settings, targetExam: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="toefl">TOEFL</SelectItem>
                      <SelectItem value="metu-epe">METU EPE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified when essays are scored</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Detailed Feedback</Label>
                    <p className="text-sm text-gray-600">Include detailed explanations</p>
                  </div>
                  <Switch
                    checked={settings.detailedFeedback}
                    onCheckedChange={(checked) => setSettings({ ...settings, detailedFeedback: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
