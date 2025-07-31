"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from "next/link"

interface GradeData {
  id: string
  title: string
  examType: string
  score: number
  maxScore: number
  week: string
  date: string
}

export default function ProgressPage() {
  const [selectedExamType, setSelectedExamType] = useState<string>("all")

  // Mock grade data with weekly progression
  const allGrades: GradeData[] = [
    { id: "1", title: "Climate Change Essay", examType: "IELTS", score: 6.5, maxScore: 9, week: "Week 1", date: "2024-01-01" },
    { id: "2", title: "Technology Essay", examType: "IELTS", score: 7.0, maxScore: 9, week: "Week 2", date: "2024-01-08" },
    { id: "3", title: "Education System", examType: "IELTS", score: 7.5, maxScore: 9, week: "Week 3", date: "2024-01-15" },
    { id: "4", title: "Business Ethics", examType: "TOEFL", score: 20, maxScore: 30, week: "Week 1", date: "2024-01-02" },
    { id: "5", title: "Social Media Impact", examType: "TOEFL", score: 23, maxScore: 30, week: "Week 2", date: "2024-01-09" },
    { id: "6", title: "Environmental Policy", examType: "TOEFL", score: 25, maxScore: 30, week: "Week 3", date: "2024-01-16" },
    { id: "7", title: "Urban Planning", examType: "METU-EPE", score: 18, maxScore: 25, week: "Week 1", date: "2024-01-03" },
    { id: "8", title: "Economic Development", examType: "METU-EPE", score: 21, maxScore: 25, week: "Week 2", date: "2024-01-10" },
    { id: "9", title: "Cultural Analysis", examType: "METU-EPE", score: 22, maxScore: 25, week: "Week 3", date: "2024-01-17" },
  ]

  const examTypes = [
    { value: "all", label: "All Exam Types" },
    { value: "IELTS", label: "IELTS" },
    { value: "TOEFL", label: "TOEFL" },
    { value: "METU-EPE", label: "METU EPE" }
  ]

  const getFilteredGrades = () => {
    if (selectedExamType === "all") return allGrades
    return allGrades.filter(grade => grade.examType === selectedExamType)
  }

  const getChartData = () => {
    const filteredGrades = getFilteredGrades()
    const weeklyData: { [key: string]: { week: string; score: number; count: number } } = {}

    filteredGrades.forEach(grade => {
      const normalizedScore = selectedExamType === "all" 
        ? (grade.score / grade.maxScore) * 100 
        : grade.score

      if (!weeklyData[grade.week]) {
        weeklyData[grade.week] = { week: grade.week, score: 0, count: 0 }
      }
      weeklyData[grade.week].score += normalizedScore
      weeklyData[grade.week].count += 1
    })

    return Object.values(weeklyData)
      .map(data => ({
        week: data.week,
        score: data.score / data.count
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
  }

  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case 'IELTS': return 'bg-blue-100 text-blue-800'
      case 'TOEFL': return 'bg-green-100 text-green-800'
      case 'METU-EPE': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreDisplay = (score: number, maxScore: number, examType: string) => {
    if (examType === 'IELTS') return `${score}/9`
    if (examType === 'TOEFL') return `${score}/30`
    if (examType === 'METU-EPE') return `${score}/25`
    return `${score}/${maxScore}`
  }

  const getYAxisDomain = () => {
    if (selectedExamType === "IELTS") return [0, 9]
    if (selectedExamType === "TOEFL") return [0, 30]
    if (selectedExamType === "METU-EPE") return [0, 25]
    return [0, 100] // Normalized for "all"
  }

  const getYAxisLabel = () => {
    if (selectedExamType === "all") return "Score (%)"
    return "Score"
  }

  const filteredGrades = getFilteredGrades()
  const chartData = getChartData()
  
  const stats = {
    totalEssays: filteredGrades.length,
    averageScore: filteredGrades.length > 0 
      ? (filteredGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore), 0) / filteredGrades.length * 100).toFixed(1)
      : '0',
    bestScore: filteredGrades.length > 0 
      ? Math.max(...filteredGrades.map(grade => grade.score / grade.maxScore * 100)).toFixed(1)
      : '0'
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
              <span className="text-2xl font-bold text-gray-900">Progress</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Filter */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
              <p className="text-gray-600">Track your AI feedback grades over time</p>
            </div>
            <div className="w-64">
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEssays}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedExamType === "all" ? "All exam types" : `${selectedExamType} only`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore}%</div>
                <p className="text-xs text-red-600">Performance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bestScore}%</div>
                <p className="text-xs text-muted-foreground">Peak performance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Progress Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Grade Progress Over Time
                </CardTitle>
                <CardDescription>
                  Your AI feedback scores by week
                  {selectedExamType !== "all" && ` for ${selectedExamType}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={getYAxisDomain()}
                          tick={{ fontSize: 12 }}
                          label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: any) => [
                            selectedExamType === "all" ? `${value.toFixed(1)}%` : value.toFixed(1),
                            'Score'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#dc2626" 
                          strokeWidth={3}
                          dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>No data available for selected exam type</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grades List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>AI Feedback Grades</CardTitle>
                <CardDescription>
                  Your recent essay scores
                  {selectedExamType !== "all" && ` for ${selectedExamType}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredGrades.length > 0 ? (
                    filteredGrades
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((grade) => (
                        <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{grade.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getExamTypeColor(grade.examType)} variant="secondary">
                                {grade.examType}
                              </Badge>
                              <span className="text-xs text-gray-500">{grade.date}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{grade.week}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">
                              {getScoreDisplay(grade.score, grade.maxScore, grade.examType)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {((grade.score / grade.maxScore) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>No essays found for selected exam type</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
