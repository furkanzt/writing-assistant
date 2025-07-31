import { NextRequest, NextResponse } from 'next/server';
import { analyzeEssay } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const githubToken = process.env.github_token;
    const openaiBaseUrl = process.env.openai_base_url;
    const openaiModel = process.env.openai_model;

    if (!githubToken) {
      console.error('Missing github_token environment variable');
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    if (!openaiBaseUrl) {
      console.error('Missing openai_base_url environment variable');
      return NextResponse.json(
        { error: 'OpenAI base URL not configured' },
        { status: 500 }
      );
    }

    const { essay, examType, title, topic } = await request.json();

    if (!essay || !examType) {
      return NextResponse.json(
        { error: 'Essay content and exam type are required' },
        { status: 400 }
      );
    }

    console.log('Analyzing essay with:', {
      examType,
      model: openaiModel,
      baseUrl: openaiBaseUrl,
      essayLength: essay.length
    });

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
    
    // Provide more specific error information
    let errorMessage = 'Failed to analyze essay';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage
      },
      { status: 500 }
    );
  }
} 