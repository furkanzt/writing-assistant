"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Brain, FileText, MessageCircle, Calendar, Target } from "lucide-react"
import Link from "next/link"

interface Submission {
  id: string
  title: string
  examType: string
  score: string
  date: string
  feedback: string
  chatMessages: Array<{ role: string; content: string }>
  keywordBullets: string[]
}

export default function ViewFeedbackPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    // In a real app, you'd fetch this from your database
    // For now, using mock data that represents processed submissions
    const mockSubmissions: Submission[] = [
      {
        id: "1",
        title: "Business Ownership Essay",
        examType: "METU EPE",
        score: "22/25",
        date: "2024-01-15",
        feedback: "Overall strong performance with good organization...",
        chatMessages: [
          { role: "user", content: "How can I improve my vocabulary?" },
          { role: "assistant", content: "Focus on academic word lists and reading more scholarly articles..." }
        ],
        keywordBullets: [
          "• Strong content development",
          "• Clear logical structure", 
          "• Good vocabulary range",
          "• Minor grammar issues",
          "• Need more specific examples",
          "• Balance perspectives better",
          "• Focus on academic vocabulary",
          "• Practice complex sentences"
        ]
      },
      {
        id: "2", 
        title: "Climate Change Discussion",
        examType: "IELTS",
        score: "7.5/9",
        date: "2024-01-12",
        feedback: "Good task response with clear position...",
        chatMessages: [
          { role: "user", content: "Why did I lose points on coherence?" },
          { role: "assistant", content: "Your transitions could be smoother between paragraphs..." }
        ],
        keywordBullets: [
          "• Clear thesis statement",
          "• Good task response",
          "• Effective examples used",
          "• Smooth transitions needed",
          "• Strong conclusion",
          "• Work on linking devices",
          "• Maintain formal tone",
          "• Expand body paragraphs"
        ]
      },
      {
        id: "3",
        title: "Technology in Education",
        examType: "TOEFL", 
        score: "24/30",
        date: "2024-01-10",
        feedback: "Well-developed arguments with good organization...",
        chatMessages: [
          { role: "user", content: "How can I get to 27+ score?" },
          { role: "assistant", content: "Focus on more sophisticated vocabulary and varied sentence structures..." }
        ],
        keywordBullets: [
          "• Well-developed arguments",
          "• Clear organization",
          "• Good supporting details",
          "• Need sophisticated vocab",
          "• Vary sentence length",
          "• Strengthen conclusion",
          "• Use more transitions",
          "• Add specific examples"
        ]
      }
    ]
    
    setSubmissions(mockSubmissions)
  }, [])

  const getExamTypeColor = (examType: string) => {
    switch (examType.toLowerCase()) {
      case 'ielts':
        return 'bg-blue-100 text-blue-800'
      case 'toefl':
        return 'bg-green-100 text-green-800'
      case 'metu-epe':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const generateKeywordBullets = (feedback: string, chatMessages: Array<{ role: string; content: string }>) => {
    // In a real implementation, this would use AI to extract keywords
    // For demo purposes, returning mock bullets based on content analysis
    const bullets = []
    
    // Extract from feedback
    if (feedback.includes('organization') || feedback.includes('structure')) {
      bullets.push('• Good organizational structure')
    }
    if (feedback.includes('vocabulary') || feedback.includes('lexical')) {
      bullets.push('• Vocabulary needs improvement')
    }
    if (feedback.includes('grammar') || feedback.includes('grammatical')) {
      bullets.push('• Minor grammatical errors')
    }
    
    // Extract from chat
    chatMessages.forEach(msg => {
      if (msg.role === 'assistant') {
        if (msg.content.includes('transitions')) {
          bullets.push('• Work on transitions')
        }
        if (msg.content.includes('examples')) {
          bullets.push('• Add more examples')
        }
        if (msg.content.includes('sophisticated')) {
          bullets.push('• Use sophisticated language')
        }
      }
    })
    
    return bullets.length > 0 ? bullets : ['• Analysis in progress...']
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
              <span className="text-2xl font-bold text-gray-900">View Feedback</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Submissions</h1>
            <p className="text-gray-600">View AI feedback insights and chat analysis for your essays</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Submissions
                  </CardTitle>
                  <CardDescription>Select a submission to view insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {submissions.map((submission) => (
                        <div
                          key={submission.id}
                          onClick={() => setSelectedSubmission(submission)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedSubmission?.id === submission.id
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm line-clamp-2">{submission.title}</h4>
                            <div className="text-lg font-bold text-red-600 ml-2">{submission.score}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getExamTypeColor(submission.examType)} variant="secondary">
                              {submission.examType}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {submission.date}
                            </div>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {submission.chatMessages.length} chat messages
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Selected Submission Insights */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Key Insights: {selectedSubmission.title}
                      </div>
                      <Badge className={getExamTypeColor(selectedSubmission.examType)}>
                        {selectedSubmission.examType} - {selectedSubmission.score}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      AI-analyzed feedback and chat insights transformed into actionable points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Key Points */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-900">Key Feedback Points</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid gap-2">
                            {selectedSubmission.keywordBullets.map((bullet, index) => (
                              <div key={index} className="text-sm text-gray-700 leading-relaxed">
                                {bullet}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Chat Summary */}
                      {selectedSubmission.chatMessages.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-gray-900">Discussion Topics</h3>
                          <div className="space-y-3">
                            {selectedSubmission.chatMessages
                              .filter(msg => msg.role === 'user')
                              .slice(0, 3)
                              .map((msg, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                  <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-blue-800">{msg.content}</div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Action Items */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-900">Recommended Actions</h3>
                        <div className="grid gap-3">
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-green-800">Practice writing with focus on identified weak areas</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-yellow-800">Review grammar rules for common mistakes</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-purple-800">Study high-scoring sample essays for reference</span>
                          </div>
                        </div>
                      </div>

                      {/* View Full Feedback Button */}
                      <div className="pt-4 border-t">
                        <Link href={`/feedback/${selectedSubmission.id}`}>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            View Complete Feedback & Chat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Submission Selected</h3>
                    <p className="text-gray-500">Choose a submission from the list to view detailed insights</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 