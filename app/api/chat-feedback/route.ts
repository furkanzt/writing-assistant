import { NextRequest, NextResponse } from 'next/server';
import { chatAboutFeedback } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { messages, examType, originalEssay } = await request.json();

    if (!messages || !examType || !originalEssay) {
      return NextResponse.json(
        { error: 'Messages, exam type, and original essay are required' },
        { status: 400 }
      );
    }

    const response = await chatAboutFeedback(messages, examType, originalEssay);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in chat feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 