import { NextRequest, NextResponse } from 'next/server';
import { analyzeEssay } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { essay, examType, title, topic } = await request.json();

    if (!essay || !examType) {
      return NextResponse.json(
        { error: 'Essay content and exam type are required' },
        { status: 400 }
      );
    }

    const feedback = await analyzeEssay(essay, examType);

    // Store the analysis result (in a real app, you'd save to database)
    const analysisId = Date.now().toString();
    
    return NextResponse.json({
      id: analysisId,
      feedback,
      essay,
      examType,
      title,
      topic,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing essay:', error);
    return NextResponse.json(
      { error: 'Failed to analyze essay' },
      { status: 500 }
    );
  }
} 