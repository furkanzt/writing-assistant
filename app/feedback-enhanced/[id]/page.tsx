"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Clock, 
  Target, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Save,
  RotateCcw,
  Brain,
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react"
import Link from "next/link"
import { EssayAnalysis, CriterionFeedback, TodoItem, ChatMessage } from "@/lib/types"

export default function FeedbackEnhancedPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string
  
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null)
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (analysisId) {
      loadAnalysis()
    }
  }, [analysisId])

  const loadAnalysis = async () => {
    try {
      setIsLoading(true)
      // Try to load real analysis data from localStorage first
      if (typeof window !== 'undefined') {
        try {
          const storedAnalysis = localStorage.getItem(`analysis_${analysisId}`)
          if (storedAnalysis) {
            const analysisData = JSON.parse(storedAnalysis)
            if (analysisData && analysisData.id) {
              setAnalysis(analysisData)
              setIsLoading(false)
              return
            }
          }
        } catch (parseError) {
          console.warn('Could not parse stored analysis data:', parseError)
        }
      }
      
      // Fallback to mock data if no real data found
      const mockAnalysis: EssayAnalysis = {
        id: analysisId,
        essay: "This is a sample essay that demonstrates various writing techniques. The author presents a clear argument with supporting evidence. However, there are areas for improvement in terms of vocabulary and sentence structure. The essay addresses the task well but could benefit from more specific examples and better transitions between paragraphs.",
        examType: "ielts",
        title: "Sample Essay",
        topic: "Technology Impact",
        timestamp: new Date(),
        overallScore: 75,
        maxScore: 100,
        criterionFeedbacks: [
          {
            criterionId: "task-response",
            criterionName: "Task Response",
            score: 7,
            maxScore: 9,
            feedback: "Good understanding of the task. Clear position presented with relevant examples.",
            aiFeedback: "The essay addresses the task well but could benefit from more specific examples.",
            chatHistory: [],
            todoItems: [
              {
                id: "task-response-1",
                title: "Add more specific examples",
                description: "Include concrete examples to support your arguments",
                status: "pending",
                criterionId: "task-response",
                createdAt: new Date()
              },
              {
                id: "task-response-2",
                title: "Clarify your position",
                description: "Make your stance more explicit in the introduction",
                status: "pending",
                criterionId: "task-response",
                createdAt: new Date()
              }
            ]
          },
          {
            criterionId: "coherence-cohesion",
            criterionName: "Coherence and Cohesion",
            score: 6,
            maxScore: 9,
            feedback: "Logical progression is present but linking devices could be improved.",
            aiFeedback: "Consider using more transition words and phrases to improve flow.",
            chatHistory: [],
            todoItems: [
              {
                id: "coherence-1",
                title: "Improve paragraph transitions",
                description: "Add linking words between paragraphs",
                status: "pending",
                criterionId: "coherence-cohesion",
                createdAt: new Date()
              },
              {
                id: "coherence-2",
                title: "Use more cohesive devices",
                description: "Incorporate more connecting words and phrases",
                status: "pending",
                criterionId: "coherence-cohesion",
                createdAt: new Date()
              }
            ]
          },
          {
            criterionId: "lexical-resource",
            criterionName: "Lexical Resource",
            score: 6,
            maxScore: 9,
            feedback: "Adequate vocabulary range but could be more sophisticated.",
            aiFeedback: "Try using more advanced vocabulary and avoid repetition.",
            chatHistory: [],
            todoItems: [
              {
                id: "lexical-1",
                title: "Expand vocabulary range",
                description: "Replace common words with more sophisticated alternatives",
                status: "pending",
                criterionId: "lexical-resource",
                createdAt: new Date()
              }
            ]
          },
          {
            criterionId: "grammatical-range",
            criterionName: "Grammatical Range and Accuracy",
            score: 7,
            maxScore: 9,
            feedback: "Good grammatical control with some complex structures.",
            aiFeedback: "Maintain good accuracy while incorporating more complex sentence structures.",
            chatHistory: [],
            todoItems: [
              {
                id: "grammatical-1",
                title: "Use more complex structures",
                description: "Incorporate conditional sentences and passive voice",
                status: "pending",
                criterionId: "grammatical-range",
                createdAt: new Date()
              }
            ]
          }
        ],
        generalFeedback: "Overall good essay with room for improvement in vocabulary and transitions. The essay demonstrates a good understanding of the task and presents a clear argument. Focus on adding more specific examples and improving the flow between paragraphs.",
        todoList: [],
        editingHistory: []
      }
      
      setAnalysis(mockAnalysis)
    } catch (error) {
      console.error('Error loading analysis:', error)
      // Set a minimal fallback to prevent crash
      setAnalysis({
        id: analysisId,
        essay: "Error loading essay data",
        examType: "ielts",
        title: "Error",
        topic: "Error",
        timestamp: new Date(),
        overallScore: 0,
        maxScore: 100,
        criterionFeedbacks: [],
        generalFeedback: "Error loading feedback",
        todoList: [],
        editingHistory: []
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleTodoStatusChange = (todoId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!analysis) return

    const updatedAnalysis = {
      ...analysis,
      criterionFeedbacks: analysis.criterionFeedbacks.map(cf => ({
        ...cf,
        todoItems: cf.todoItems.map(todo => 
          todo.id === todoId 
            ? { ...todo, status: newStatus, completedAt: newStatus === 'completed' ? new Date() : undefined }
            : todo
        )
      }))
    }

    setAnalysis(updatedAnalysis)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCriterion || !analysis) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      reactions: []
    }

    setChatMessages(prev => [...prev, userMessage])
    setNewMessage("")

    try {
      // Call the real chat API
      const response = await fetch('/api/chat-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          examType: analysis.examType,
          originalEssay: analysis.essay
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        reactions: []
      }
      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
        reactions: []
      }
      setChatMessages(prev => [...prev, errorMessage])
    }
  }

  const handleReaction = (messageId: string, reactionType: 'like' | 'dislike') => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              reactions: [...msg.reactions, {
                type: reactionType,
                userId: 'user',
                timestamp: new Date()
              }]
            }
          : msg
      )
    )
  }

  const getCompletedTodosCount = () => {
    if (!analysis) return 0
    return analysis.criterionFeedbacks.flatMap(cf => cf.todoItems).filter(todo => todo.status === 'completed').length
  }

  const getTotalTodosCount = () => {
    if (!analysis) return 0
    return analysis.criterionFeedbacks.flatMap(cf => cf.todoItems).length
  }

  const getProgressPercentage = () => {
    const total = getTotalTodosCount()
    const completed = getCompletedTodosCount()
    return total > 0 ? (completed / total) * 100 : 0
  }

  const handleImproveEssay = () => {
    router.push(`/improve/${analysisId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Analysis not found</p>
          <Link href="/submit-enhanced">
            <Button className="mt-4">Submit New Essay</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Essay Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed feedback with per-criterion analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {analysis.examType.toUpperCase()}
          </Badge>
          <Badge variant="secondary">
            Score: {analysis.overallScore}/{analysis.maxScore}
          </Badge>
          <Button onClick={handleImproveEssay} className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Improve Essay
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{getCompletedTodosCount()}</div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{getTotalTodosCount()}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(getProgressPercentage())}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.criterionFeedbacks.length}</div>
              <div className="text-sm text-gray-600">Criteria</div>
            </div>
          </div>
          <Progress value={getProgressPercentage()} className="mt-4" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="essay" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Essay
              </TabsTrigger>
              <TabsTrigger value="criteria" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Criteria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{analysis.generalFeedback}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Essay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Title:</span>
                        <p className="font-medium">{analysis.title || 'Untitled'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Topic:</span>
                        <p className="font-medium">{analysis.topic || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Exam Type:</span>
                        <p className="font-medium">{analysis.examType.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Analysis Date:</span>
                        <p className="font-medium">{analysis.timestamp.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="essay" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Essay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{analysis.essay}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="criteria" className="mt-6">
              <div className="space-y-6">
                {analysis.criterionFeedbacks.map((criterion) => (
                  <Card key={criterion.criterionId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{criterion.criterionName}</CardTitle>
                        <Badge variant="outline">
                          {criterion.score}/{criterion.maxScore}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Feedback</h4>
                          <p className="text-gray-700 dark:text-gray-300">{criterion.feedback}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">AI Suggestions</h4>
                          <p className="text-gray-700 dark:text-gray-300">{criterion.aiFeedback}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Todo Items</h4>
                          <div className="space-y-2">
                            {criterion.todoItems.map((todo) => (
                              <div key={todo.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                <Checkbox
                                  checked={todo.status === 'completed'}
                                  onCheckedChange={(checked) => 
                                    handleTodoStatusChange(todo.id, checked ? 'completed' : 'pending')
                                  }
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium">{todo.title}</h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {todo.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge 
                                      variant={todo.status === 'completed' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {todo.status}
                                    </Badge>
                                    {todo.completedAt && (
                                      <span className="text-xs text-gray-500">
                                        Completed {todo.completedAt.toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Criteria Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Select Criterion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.criterionFeedbacks.map((criterion) => (
                  <div
                    key={criterion.criterionId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCriterion === criterion.criterionId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedCriterion(criterion.criterionId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{criterion.criterionName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {criterion.score}/{criterion.maxScore}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {criterion.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          {selectedCriterion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat about {analysis.criterionFeedbacks.find(cf => cf.criterionId === selectedCriterion)?.criterionName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 overflow-y-auto space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReaction(message.id, 'like')}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReaction(message.id, 'dislike')}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask a question about this criterion..."
                      className="flex-1"
                      rows={2}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 