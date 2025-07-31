"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Upload, ArrowLeft, Loader2, Clock, Target, BookOpen, Timer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SubmitPage() {
  const [essayText, setEssayText] = useState("")
  const [selectedRubric, setSelectedRubric] = useState("")
  const [essayTitle, setEssayTitle] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isTimedMode, setIsTimedMode] = useState(false)
  const [timeLimit, setTimeLimit] = useState(40) // minutes
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const router = useRouter()

  const rubrics = [
    {
      value: "ielts",
      label: "IELTS Writing Task 2",
      description: "Band score 1-9",
      timeLimit: 40,
      wordTarget: "250+ words",
      criteria: ["Task Response", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
    },
    {
      value: "toefl",
      label: "TOEFL Independent Writing",
      description: "Score 0-30",
      timeLimit: 30,
      wordTarget: "300+ words",
      criteria: ["Development", "Organization", "Language Use"],
    },
    {
      value: "metu-epe",
      label: "METU EPE Writing",
      description: "METU exam criteria",
      timeLimit: 45,
      wordTarget: "250+ words",
      criteria: ["Content", "Organization", "Language", "Mechanics"],
    },
  ]

  const essayTopics = {
    ielts: [
      "Some people think that governments should spend money on developing public transportation systems. Others believe that money should be spent on building more roads. Discuss both views and give your opinion.",
      "Many people believe that social networking sites have had a huge negative impact on both individuals and society. To what extent do you agree or disagree?",
      "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. Discuss both views and give your opinion.",
    ],
    toefl: [
      "Do you agree or disagree with the following statement? It is better to have broad knowledge of many academic subjects than to specialize in one specific subject.",
      "Some people prefer to work for themselves or own a business. Others prefer to work for an employer. Would you rather be self-employed, work for someone else, or own a business?",
      "Do you agree or disagree with the following statement? The best way to travel is in a group led by a tour guide.",
    ],
    "metu-epe": [
      "Discuss the advantages and disadvantages of online learning compared to traditional classroom education.",
      "What are the most effective ways to reduce environmental pollution in urban areas?",
      "Analyze the impact of social media on interpersonal relationships in modern society.",
    ],
  }

  const essayTemplates = {
    ielts: `Introduction:
- Paraphrase the question
- Present both views briefly
- State your opinion

Body Paragraph 1:
- Topic sentence for first view
- Explanation and example
- Link to next paragraph

Body Paragraph 2:
- Topic sentence for second view
- Explanation and example
- Your opinion

Conclusion:
- Summarize both views
- Restate your opinion
- Final thought`,

    toefl: `Introduction:
- Hook/Background
- Restate the question
- Clear thesis statement

Body Paragraph 1:
- Main reason 1
- Specific examples
- Explanation

Body Paragraph 2:
- Main reason 2
- Specific examples
- Explanation

Body Paragraph 3 (optional):
- Additional reason or counterargument
- Examples and explanation

Conclusion:
- Restate thesis
- Summarize main points
- Final statement`,

    "metu-epe": `Introduction:
- Background information
- Thesis statement
- Essay outline

Body Paragraph 1:
- First main point
- Supporting evidence
- Analysis

Body Paragraph 2:
- Second main point
- Supporting evidence
- Analysis

Body Paragraph 3:
- Third main point or counterargument
- Supporting evidence
- Analysis

Conclusion:
- Restate thesis
- Summarize key points
- Implications or recommendations`,
  }

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsTimerActive(false)
            alert("Time's up! Your essay will be submitted automatically.")
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (timeRemaining === 0 && isTimerActive) {
      setIsTimerActive(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeRemaining])

  const startTimer = () => {
    setTimeRemaining(timeLimit * 60) // Convert minutes to seconds
    setIsTimerActive(true)
  }

  const stopTimer = () => {
    setIsTimerActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getWordCount = () => {
    return essayText.split(/\s+/).filter((word) => word.length > 0).length
  }

  const getWordCountColor = () => {
    const count = getWordCount()
    const selectedRubricData = rubrics.find((r) => r.value === selectedRubric)
    const target = selectedRubricData?.wordTarget.includes("250") ? 250 : 300

    if (count >= target) return "text-green-600"
    if (count >= target * 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setIsTimerActive(false)

    try {
      const response = await fetch('/api/analyze-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay: essayText,
          examType: selectedRubric,
          title: essayTitle,
          topic: selectedTopic,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze essay')
      }

      const data = await response.json()

      // Redirect to feedback page with data
      const params = new URLSearchParams({
        essay: encodeURIComponent(data.essay),
        examType: data.examType,
        feedback: encodeURIComponent(data.feedback),
        ...(data.title && { title: encodeURIComponent(data.title) }),
        ...(data.topic && { topic: encodeURIComponent(data.topic) }),
      })

      router.push(`/feedback/${data.id}?${params.toString()}`)
    } catch (error) {
      console.error('Error analyzing essay:', error)
      alert('Failed to analyze essay. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const handleRubricChange = (value: string) => {
    setSelectedRubric(value)
    const rubric = rubrics.find((r) => r.value === value)
    if (rubric) {
      setTimeLimit(rubric.timeLimit)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="h-16 w-16 text-red-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Essay</h2>
            <p className="text-gray-600">Please wait while we provide detailed feedback...</p>
          </CardContent>
        </Card>
      </div>
    )
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
              <span className="text-2xl font-bold text-gray-900">Submit Essay</span>
            </div>
          </div>
          {isTimedMode && (
            <div className="flex items-center space-x-4">
              <div className={`text-2xl font-bold ${timeRemaining < 300 ? "text-red-600" : "text-gray-900"}`}>
                <Timer className="h-5 w-5 inline mr-2" />
                {formatTime(timeRemaining)}
              </div>
              {!isTimerActive && (
                <Button onClick={startTimer} size="sm" className="bg-green-600 hover:bg-green-700">
                  Start Timer
                </Button>
              )}
              {isTimerActive && (
                <Button onClick={stopTimer} size="sm" variant="outline">
                  Pause Timer
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Essay</h1>
            <p className="text-gray-600">Choose your exam type and write your essay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Exam Type & Settings
                </CardTitle>
                <CardDescription>Choose your target exam and writing mode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rubric">Select Exam Type</Label>
                  <Select onValueChange={handleRubricChange} value={selectedRubric}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your target exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {rubrics.map((rubric) => (
                        <SelectItem key={rubric.value} value={rubric.value}>
                          {rubric.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRubric && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Time Limit:</span>{" "}
                        {rubrics.find((r) => r.value === selectedRubric)?.timeLimit} minutes
                      </div>
                      <div>
                        <span className="font-medium">Word Target:</span>{" "}
                        {rubrics.find((r) => r.value === selectedRubric)?.wordTarget}
                      </div>
                      <div>
                        <span className="font-medium">Scoring:</span>{" "}
                        {rubrics.find((r) => r.value === selectedRubric)?.description}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Assessment Criteria:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rubrics
                          .find((r) => r.value === selectedRubric)
                          ?.criteria.map((criterion, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {criterion}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch id="timed-mode" checked={isTimedMode} onCheckedChange={setIsTimedMode} />
                  <Label htmlFor="timed-mode" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Timed Writing Mode (Exam Simulation)
                  </Label>
                </div>

                {isTimedMode && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>Timed Mode:</strong> You'll have {timeLimit} minutes to complete your essay. The timer will
                    start when you click "Start Timer" and your essay will be auto-submitted when time runs out.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topic Selection */}
            {selectedRubric && (
              <Card>
                <CardHeader>
                  <CardTitle>Essay Topic</CardTitle>
                  <CardDescription>Choose a topic or enter your own</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Select a Practice Topic</Label>
                    <Select onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a practice topic (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {essayTopics[selectedRubric as keyof typeof essayTopics]?.map((topic, index) => (
                          <SelectItem key={index} value={topic}>
                            {topic.substring(0, 80)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTopic && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Selected Topic:</h4>
                      <p className="text-sm">{selectedTopic}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="title">Essay Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="Enter a title for your essay"
                      value={essayTitle}
                      onChange={(e) => setEssayTitle(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Writing Template */}
            {selectedRubric && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Writing Guide
                  </CardTitle>
                  <CardDescription>
                    Essay structure template for {rubrics.find((r) => r.value === selectedRubric)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch id="show-template" checked={showTemplate} onCheckedChange={setShowTemplate} />
                    <Label htmlFor="show-template">Show essay structure template</Label>
                  </div>

                  {showTemplate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Recommended Structure:</h4>
                      <pre className="text-sm whitespace-pre-line text-gray-700">
                        {essayTemplates[selectedRubric as keyof typeof essayTemplates]}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Essay Writing Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Your Essay
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`font-medium ${getWordCountColor()}`}>Words: {getWordCount()}</span>
                    {selectedRubric && (
                      <span className="text-gray-500">
                        Target: {rubrics.find((r) => r.value === selectedRubric)?.wordTarget}
                      </span>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>Write your essay below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="essay"
                  placeholder={
                    selectedTopic
                      ? `Write your essay about: ${selectedTopic.substring(0, 100)}...`
                      : "Write your essay here..."
                  }
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="min-h-[400px] mt-1"
                  required
                  disabled={isTimedMode && !isTimerActive && timeRemaining > 0}
                />

                {isTimedMode && !isTimerActive && timeRemaining > 0 && (
                  <p className="text-sm text-amber-600 mt-2">Click "Start Timer" to begin writing in timed mode.</p>
                )}
              </CardContent>
            </Card>

            {/* Timer Start Section */}
            {isTimedMode && !isTimerActive && timeRemaining > 0 && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Ready to Begin Timed Writing?</h3>
                  <p className="text-amber-700 mb-4">
                    You'll have {timeLimit} minutes to complete your essay. The timer will start when you click the
                    button below.
                  </p>
                  <Button onClick={startTimer} size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Timer
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={!essayText.trim() || !selectedRubric || (isTimedMode && !isTimerActive && timeRemaining > 0)}
              >
                <Brain className="h-4 w-4 mr-2" />
                Analyze Essay
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
