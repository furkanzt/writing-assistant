"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, BookOpen, Brain, FileText, PenTool, TrendingUp, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Sample essays data
const sampleEssays = [
  { id: 1, title: "Climate Change Essay", score: 7.5, exam: "IELTS", date: "2024-01-15" },
  { id: 2, title: "Technology in Education", score: 6.8, exam: "TOEFL", date: "2024-01-12" },
  { id: 3, title: "Cultural Diversity", score: 8.2, exam: "METU EPE", date: "2024-01-10" },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.firstName || "User")
      setUserEmail(user.email || "")
      setIsVerified(user.verified || false)
    }
  }, [])

  const handleLogout = () => {
    // Clear user data and redirect to landing page
    localStorage.removeItem("userData")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">AI Writing Assistant</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, {userName}!</span>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Email Verification Alert */}
        {userEmail && !isVerified && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Please verify your email address</h3>
                <div className="mt-2 text-sm">
                  <p>
                    Your email ({userEmail}) has not been verified. Please check your inbox for a verification email or
                    update your email in settings.
                  </p>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="text-xs">
                    Resend Verification Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your progress and improve your writing skills</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/submit">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 hover:border-red-300">
              <CardContent className="flex items-center p-6">
                <PenTool className="h-12 w-12 text-red-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Submit Essay</h3>
                  <p className="text-gray-600 text-sm">Write & analyze</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/view-feedback">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 hover:border-red-300">
              <CardContent className="flex items-center p-6">
                <FileText className="h-12 w-12 text-red-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">View Feedback</h3>
                  <p className="text-gray-600 text-sm">Submission insights</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 hover:border-red-300">
              <CardContent className="flex items-center p-6">
                <BarChart3 className="h-12 w-12 text-red-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Progress</h3>
                  <p className="text-gray-600 text-sm">Track improvement</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2</div>
              <p className="text-xs text-red-600">+0.3 improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Essays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Essays
            </CardTitle>
            <CardDescription>Your latest submissions with detailed feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleEssays.map((essay) => (
                <Link href={`/feedback/${essay.id}`} key={essay.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex-1">
                      <h4 className="font-medium">{essay.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{essay.exam}</Badge>
                        <span className="text-sm text-gray-500">{essay.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{essay.score}</div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/progress">
              <Button variant="outline" className="w-full mt-4">
                View All Essays
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
