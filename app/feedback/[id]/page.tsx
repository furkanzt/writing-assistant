"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, ArrowLeft, MessageCircle, Send, User, Bot, Loader2 } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface FeedbackData {
  id: string
  feedback: string
  essay: string
  examType: string
  title?: string
  topic?: string
  timestamp: string
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  const scrollToBottom = () => {
    // Scroll within the chat container only, not the entire page
    if (chatScrollAreaRef.current) {
      const scrollContainer = chatScrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    // Add a small delay to ensure the message is rendered before scrolling
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    if (!resolvedParams) return
    
    // Get feedback data from URL params (in a real app, you'd fetch from API/database)
    const essay = searchParams.get('essay')
    const examType = searchParams.get('examType')
    const title = searchParams.get('title')
    const topic = searchParams.get('topic')
    const feedback = searchParams.get('feedback')

    if (essay && examType && feedback) {
      setFeedbackData({
        id: resolvedParams.id,
        essay: decodeURIComponent(essay),
        examType,
        title: title ? decodeURIComponent(title) : undefined,
        topic: topic ? decodeURIComponent(topic) : undefined,
        feedback: decodeURIComponent(feedback),
        timestamp: new Date().toISOString()
      })
    } else {
      // If no data in URL, this could be a refresh - you'd normally fetch from database
      router.push('/submit')
    }
  }, [resolvedParams, searchParams, router])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !feedbackData || isChatLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setIsChatLoading(true)
    
    // Scroll to show the user's message immediately
    setTimeout(() => scrollToBottom(), 50)

    try {
      const chatMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages,
          examType: feedbackData.examType,
          originalEssay: feedbackData.essay
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getExamTypeInfo = (examType: string) => {
    const examTypes = {
      ielts: { name: "IELTS Writing Task 2", color: "bg-blue-100 text-blue-800" },
      toefl: { name: "TOEFL Independent Writing", color: "bg-green-100 text-green-800" },
      "metu-epe": { name: "METU EPE Writing", color: "bg-purple-100 text-purple-800" }
    }
    return examTypes[examType as keyof typeof examTypes] || { name: examType, color: "bg-gray-100 text-gray-800" }
  }

  if (!feedbackData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="h-16 w-16 text-red-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Loading Feedback</h2>
            <p className="text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const examInfo = getExamTypeInfo(feedbackData.examType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/submit">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Submit
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">Essay Feedback</span>
            </div>
          </div>
          <Badge className={examInfo.color}>
            {examInfo.name}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Feedback Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Assessment & Feedback</CardTitle>
                <CardDescription>
                  Detailed analysis of your {examInfo.name} essay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-sm" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    }}
                  >
                    {feedbackData.feedback}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Original Essay */}
            <Card>
              <CardHeader>
                <CardTitle>Your Essay</CardTitle>
                {feedbackData.title && (
                  <CardDescription>Title: {feedbackData.title}</CardDescription>
                )}
                {feedbackData.topic && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Topic:</strong> {feedbackData.topic}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-gray-700 text-sm">
                    {feedbackData.essay}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Word count: {feedbackData.essay.split(/\s+/).filter(word => word.length > 0).length} words
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0 pb-3">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Ask Questions About Your Feedback
                </CardTitle>
                <CardDescription>
                  Get clarification and additional guidance about your essay assessment
                </CardDescription>
              </CardHeader>
              
              <div className="flex-1 flex flex-col min-h-0">
                {/* Chat Messages */}
                <ScrollArea ref={chatScrollAreaRef} className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">
                          Ask questions about your feedback, request clarification, or get tips for improvement.
                        </p>
                        <p className="text-xs mt-2 text-gray-400">
                          I can only discuss topics related to your essay and writing improvement.
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' ? 'bg-red-600 ml-2' : 'bg-gray-600 mr-2'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="h-4 w-4 text-white" />
                              ) : (
                                <Bot className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className={`px-3 py-2 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <div className="text-sm leading-relaxed">
                                {message.role === 'assistant' ? (
                                  <ReactMarkdown
                                    components={{
                                      p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-1 space-y-0.5" {...props} />,
                                      li: ({node, ...props}) => <li className="text-sm" {...props} />,
                                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                      em: ({node, ...props}) => <em className="italic" {...props} />,
                                      code: ({node, ...props}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} />,
                                    }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                ) : (
                                  <div className="whitespace-pre-wrap">
                                    {message.content}
                                  </div>
                                )}
                              </div>
                              <div className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-red-200' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600 mr-2">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                <Separator className="flex-shrink-0" />

                {/* Chat Input - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 bg-white">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ask about your feedback, writing tips, or exam strategies..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                      disabled={isChatLoading}
                    />
                    <div className="flex flex-col justify-end">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isChatLoading}
                        className="bg-red-600 hover:bg-red-700 h-[60px] w-[60px]"
                        size="sm"
                      >
                        {isChatLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
