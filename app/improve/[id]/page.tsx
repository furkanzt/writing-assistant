"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  Brain
} from "lucide-react"
import Link from "next/link"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import { EssayAnalysis, CriterionFeedback, TodoItem, ChatMessage } from "@/lib/types"

export default function ImprovePage() {
  const params = useParams()
  const analysisId = params.id as string
  
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null)
  const [editedEssay, setEditedEssay] = useState("")
  const [originalEssay, setOriginalEssay] = useState("")
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (analysisId) {
      loadAnalysis()
    }
  }, [analysisId])

  const loadAnalysis = async () => {
    try {
      // In a real app, you'd fetch from your database
      // For now, we'll simulate loading the analysis
      const mockAnalysis: EssayAnalysis = {
        id: analysisId,
        essay: "This is a sample essay that demonstrates various writing techniques. The author presents a clear argument with supporting evidence. However, there are areas for improvement in terms of vocabulary and sentence structure.",
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
              }
            ]
          }
        ],
        generalFeedback: "Overall good essay with room for improvement in vocabulary and transitions.",
        todoList: [],
        editingHistory: []
      }
      
      setAnalysis(mockAnalysis)
      setOriginalEssay(mockAnalysis.essay)
      setEditedEssay(mockAnalysis.essay)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading analysis:', error)
      setIsLoading(false)
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
    if (!newMessage.trim() || !selectedCriterion) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      reactions: []
    }

    setChatMessages(prev => [...prev, userMessage])
    setNewMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand your question about this criterion. Let me help you improve this aspect of your writing.",
        timestamp: new Date(),
        reactions: []
      }
      setChatMessages(prev => [...prev, aiMessage])
    }, 1000)
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
            <h1 className="text-3xl font-bold">Improve Your Essay</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Edit your essay while viewing feedback and tracking progress
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
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
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
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Compare
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Your Essay</CardTitle>
                  <CardDescription>
                    Make improvements based on the feedback and todo items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarkdownEditor
                    value={editedEssay}
                    onChange={setEditedEssay}
                    placeholder="Edit your essay here..."
                    label="Essay Content"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: editedEssay }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compare" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compare Versions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Original</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{originalEssay}</pre>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Edited</h3>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{editedEssay}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Criteria Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Criteria Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.criterionFeedbacks.map((criterion) => (
                  <div
                    key={criterion.criterionId}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCriterion === criterion.criterionId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedCriterion(criterion.criterionId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{criterion.criterionName}</h3>
                      <Badge variant="outline">
                        {criterion.score}/{criterion.maxScore}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {criterion.feedback}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MessageSquare className="w-3 h-3" />
                      {criterion.chatHistory.length} messages
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Todo List */}
          {selectedCriterion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Todo Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.criterionFeedbacks
                    .find(cf => cf.criterionId === selectedCriterion)
                    ?.todoItems.map((todo) => (
                      <div key={todo.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <Checkbox
                          checked={todo.status === 'completed'}
                          onCheckedChange={(checked) => 
                            handleTodoStatusChange(todo.id, checked ? 'completed' : 'pending')
                          }
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{todo.title}</h4>
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
              </CardContent>
            </Card>
          )}

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