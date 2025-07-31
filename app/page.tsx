import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">AI Writing Assistant</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-red-600 hover:bg-red-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Improve Your Writing with AI Feedback</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Get instant feedback on your essays for IELTS, TOEFL, and METU EPE. Simple, effective, and designed for
          students.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/submit">
            <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Basic Analysis
            </Button>
          </Link>
          <Link href="/submit-enhanced">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Enhanced Analysis
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple & Effective</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>AI Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get instant scores based on exam standards</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Clear Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Simple suggestions to improve your writing</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>See your improvement over time</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Easy Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Available anywhere, anytime</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AI Writing Assistant for DBE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
