import { NextRequest, NextResponse } from 'next/server';
import { evaluateImprovements } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { 
      originalEssay, 
      editedEssay, 
      criterionId, 
      criterionName, 
      todoItemTitle 
    } = await request.json();

    if (!originalEssay || !editedEssay || !criterionId || !criterionName || !todoItemTitle) {
      return NextResponse.json(
        { error: 'All fields are required: originalEssay, editedEssay, criterionId, criterionName, todoItemTitle' },
        { status: 400 }
      );
    }

    console.log('Evaluating improvements for:', {
      criterionId,
      criterionName,
      todoItemTitle,
      originalLength: originalEssay.length,
      editedLength: editedEssay.length
    });

    const evaluation = await evaluateImprovements(
      originalEssay,
      editedEssay,
      criterionId,
      criterionName,
      todoItemTitle
    );

    return NextResponse.json({
      evaluation,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error evaluating improvements:', error);
    
    let errorMessage = 'Failed to evaluate improvements';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 