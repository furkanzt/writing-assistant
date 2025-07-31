"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Upload, ArrowLeft, Loader2, Clock, Target, BookOpen, Timer, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import { EssayAnalysis } from "@/lib/types"

export default function SubmitEnhancedPage() {
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
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null)
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
      value: "sat",
      label: "SAT Essay",
      description: "Score 2-8",
      timeLimit: 50,
      wordTarget: "400+ words",
      criteria: ["Reading", "Analysis", "Writing"],
    },
    {
      value: "gre",
      label: "GRE Analytical Writing",
      description: "Score 0-6",
      timeLimit: 30,
      wordTarget: "500+ words",
      criteria: ["Issue Task", "Argument Task"],
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
    sat: [
      "As you read the passage below, consider how the author uses evidence, such as facts or examples, to support claims, reasoning to develop ideas and connect claims and evidence, and stylistic or persuasive elements to add power to the ideas expressed.",
      "Write an essay in which you explain how the author builds an argument to persuade an audience that the author's claim on a subject is valid.",
    ],
    gre: [
      "As people rely more and more on technology to solve problems, the ability of humans to think for themselves will surely deteriorate.",
      "To understand the most important characteristics of a society, one must study its major cities.",
    ],
  }

  const essayTemplates = {
    ielts: `# IELTS Writing Task 2 Template

## Introduction
- Paraphrase the question
- Present both views briefly  
- State your opinion

## Body Paragraph 1
- Topic sentence for first view
- Explanation and example
- Link to next paragraph

## Body Paragraph 2
- Topic sentence for second view
- Explanation and example
- Your opinion

## Conclusion
- Summarize both views
- Restate your opinion
- Final thought`,

    toefl: `# TOEFL Independent Writing Template

## Introduction
- Hook/Background
- Restate the question
- Clear thesis statement

## Body Paragraph 1
- Topic sentence
- Supporting detail 1
- Supporting detail 2
- Concluding sentence

## Body Paragraph 2
- Topic sentence
- Supporting detail 1
- Supporting detail 2
- Concluding sentence

## Conclusion
- Restate thesis
- Summarize main points
- Final thought`,

    sat: `# SAT Essay Template

## Introduction
- Hook
- Context about the passage
- Thesis statement

## Body Paragraph 1
- Topic sentence about first rhetorical device
- Quote from passage
- Analysis of how it supports the argument

## Body Paragraph 2
- Topic sentence about second rhetorical device
- Quote from passage
- Analysis of how it supports the argument

## Conclusion
- Restate thesis
- Summarize analysis
- Final thought`,

    gre: `# GRE Analytical Writing Template

## Introduction
- Restate the issue/argument
- Your position
- Preview of reasons

## Body Paragraph 1
- First reason/evidence
- Explanation
- Example

## Body Paragraph 2
- Second reason/evidence
- Explanation
- Example

## Conclusion
- Restate position
- Summarize main points
- Final thought`,
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeRemaining])

  const startTimer = () => {
    setTimeRemaining(timeLimit * 60)
    setIsTimerActive(true)
  }

  const stopTimer = () => {
    setIsTimerActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getWordCount = () => {
    return essayText.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getWordCountColor = () => {
    const count = getWordCount()
    const selectedRubricData = rubrics.find(r => r.value === selectedRubric)
    if (!selectedRubricData) return "text-gray-500"
    
    const target = parseInt(selectedRubricData.wordTarget)
    if (count >= target) return "text-green-600"
    if (count >= target * 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!essayText.trim() || !selectedRubric) {
      alert("Please fill in all required fields")
      return
    }

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze-essay-enhanced', {
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze essay')
      }

      const analysisData: EssayAnalysis = await response.json()
      setAnalysis(analysisData)
      
      // Navigate to the enhanced feedback page
      router.push(`/feedback-enhanced/${analysisData.id}`)
      
    } catch (error) {
      console.error('Error analyzing essay:', error)
      alert(error instanceof Error ? error.message : 'Failed to analyze essay')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRubricChange = (value: string) => {
    setSelectedRubric(value)
    const rubric = rubrics.find(r => r.value === value)
    if (rubric) {
      setTimeLimit(rubric.timeLimit)
      setTimeRemaining(rubric.timeLimit * 60)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Submit Essay</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get detailed AI feedback with per-criterion analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Essay Editor
              </CardTitle>
              <CardDescription>
                Write your essay with Markdown support and real-time preview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={essayText}
                onChange={setEssayText}
                placeholder="Start writing your essay here... You can use Markdown formatting for better organization."
                label="Essay Content"
              />
            </CardContent>
          </Card>

          {/* Essay Details */}
          <Card>
            <CardHeader>
              <CardTitle>Essay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Essay Title (Optional)</Label>
                <Input
                  id="title"
                  value={essayTitle}
                  onChange={(e) => setEssayTitle(e.target.value)}
                  placeholder="Enter essay title..."
                />
              </div>
              
              <div>
                <Label htmlFor="topic">Topic (Optional)</Label>
                <Input
                  id="topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  placeholder="Enter essay topic..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rubric Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Exam Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedRubric} onValueChange={handleRubricChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {rubrics.map((rubric) => (
                    <SelectItem key={rubric.value} value={rubric.value}>
                      <div>
                        <div className="font-medium">{rubric.label}</div>
                        <div className="text-sm text-gray-500">{rubric.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Word Count:</span>
                <Badge variant={getWordCountColor() === "text-green-600" ? "default" : "secondary"}>
                  {getWordCount()} words
                </Badge>
              </div>
              
              {selectedRubric && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Target:</span>
                  <Badge variant="outline">
                    {rubrics.find(r => r.value === selectedRubric)?.wordTarget}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timed Mode:</span>
                <Switch
                  checked={isTimedMode}
                  onCheckedChange={setIsTimedMode}
                />
              </div>
              
              {isTimedMode && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-mono">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-gray-500">remaining</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!isTimerActive ? (
                      <Button onClick={startTimer} size="sm" className="flex-1">
                        Start Timer
                      </Button>
                    ) : (
                      <Button onClick={stopTimer} size="sm" variant="outline" className="flex-1">
                        Stop Timer
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplate(!showTemplate)}
                className="w-full"
              >
                {showTemplate ? 'Hide' : 'Show'} Template
              </Button>
              
              {showTemplate && selectedRubric && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">
                    {essayTemplates[selectedRubric as keyof typeof essayTemplates] || 'No template available'}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isAnalyzing || !essayText.trim() || !selectedRubric}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Essay
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 