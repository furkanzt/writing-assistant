import { NextRequest, NextResponse } from 'next/server';
import { analyzeEssay, analyzeEssayPerCriterion, generateTodoList } from '@/lib/openai';
import { EssayAnalysis, CriterionFeedback, TodoItem } from '@/lib/types';

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

    console.log('Starting enhanced essay analysis:', {
      examType,
      model: openaiModel,
      baseUrl: openaiBaseUrl,
      essayLength: essay.length
    });

    // Get the rubric for the exam type
    const rubrics = getRubrics();
    const selectedRubric = rubrics[examType as keyof typeof rubrics];
    
    if (!selectedRubric) {
      return NextResponse.json(
        { error: 'Invalid exam type' },
        { status: 400 }
      );
    }

    // Generate general feedback
    const generalFeedback = await analyzeEssay(essay, examType);

    // Generate per-criterion feedback
    const criterionFeedbacks: CriterionFeedback[] = [];
    let totalScore = 0;
    let maxTotalScore = 0;

    for (const criterion of selectedRubric.criteria) {
      try {
        const criterionAnalysis = await analyzeEssayPerCriterion(
          essay,
          examType,
          criterion.id,
          criterion.name,
          criterion.description
        );

        const criterionFeedback: CriterionFeedback = {
          criterionId: criterion.id,
          criterionName: criterion.name,
          score: criterionAnalysis.score,
          maxScore: criterionAnalysis.maxScore,
          feedback: criterionAnalysis.feedback,
          aiFeedback: criterionAnalysis.feedback,
          chatHistory: [],
          todoItems: []
        };

        // Generate todo list for this criterion
        try {
          const todoItems = await generateTodoList(criterionAnalysis, essay);
          criterionFeedback.todoItems = todoItems.map((item: any, index: number) => ({
            id: `${criterion.id}-todo-${index}`,
            title: item.title,
            description: item.description,
            status: 'pending' as const,
            criterionId: criterion.id,
            createdAt: new Date(),
            priority: item.priority || 'medium'
          }));
        } catch (todoError) {
          console.error('Error generating todo list for criterion:', criterion.id, todoError);
        }

        criterionFeedbacks.push(criterionFeedback);
        totalScore += criterionAnalysis.score;
        maxTotalScore += criterionAnalysis.maxScore;
      } catch (criterionError) {
        console.error('Error analyzing criterion:', criterion.id, criterionError);
        // Add a default feedback for failed criteria
        criterionFeedbacks.push({
          criterionId: criterion.id,
          criterionName: criterion.name,
          score: 0,
          maxScore: criterion.maxScore,
          feedback: 'Unable to analyze this criterion at this time.',
          aiFeedback: 'Unable to analyze this criterion at this time.',
          chatHistory: [],
          todoItems: []
        });
      }
    }

    // Calculate overall score
    const overallScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

    // Create the analysis result
    const analysisId = Date.now().toString();
    const analysis: EssayAnalysis = {
      id: analysisId,
      essay,
      examType,
      title,
      topic,
      timestamp: new Date(),
      overallScore,
      maxScore: 100,
      criterionFeedbacks,
      generalFeedback,
      todoList: criterionFeedbacks.flatMap(cf => cf.todoItems),
      editingHistory: []
    };
    
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in enhanced essay analysis:', error);
    
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

function getRubrics() {
  return {
    ielts: {
      name: "IELTS Writing Task 2",
      criteria: [
        {
          id: "task-response",
          name: "Task Response",
          description: "How well the essay addresses all parts of the task with relevant ideas and examples",
          weight: 25,
          maxScore: 9
        },
        {
          id: "coherence-cohesion",
          name: "Coherence and Cohesion",
          description: "How well the essay is organized with clear logical progression and linking devices",
          weight: 25,
          maxScore: 9
        },
        {
          id: "lexical-resource",
          name: "Lexical Resource",
          description: "Range and accuracy of vocabulary used in the essay",
          weight: 25,
          maxScore: 9
        },
        {
          id: "grammatical-range",
          name: "Grammatical Range and Accuracy",
          description: "Range and accuracy of grammatical structures used",
          weight: 25,
          maxScore: 9
        }
      ]
    },
    toefl: {
      name: "TOEFL Writing",
      criteria: [
        {
          id: "development",
          name: "Development",
          description: "How well the essay develops ideas with examples and details",
          weight: 30,
          maxScore: 5
        },
        {
          id: "organization",
          name: "Organization",
          description: "How well the essay is structured with clear introduction, body, and conclusion",
          weight: 30,
          maxScore: 5
        },
        {
          id: "language-use",
          name: "Language Use",
          description: "Accuracy and variety of vocabulary and grammar",
          weight: 40,
          maxScore: 5
        }
      ]
    },
    "metu-epe": {
      name: "METU EPE Writing",
      criteria: [
        {
          id: "content",
          name: "Content",
          description: "How well the essay addresses the topic with relevant ideas and examples",
          weight: 25,
          maxScore: 10
        },
        {
          id: "organization",
          name: "Organization",
          description: "How well the essay is structured with clear introduction, body, and conclusion",
          weight: 25,
          maxScore: 10
        },
        {
          id: "language",
          name: "Language",
          description: "Accuracy and variety of vocabulary and grammar",
          weight: 25,
          maxScore: 10
        },
        {
          id: "mechanics",
          name: "Mechanics",
          description: "Spelling, punctuation, and formatting accuracy",
          weight: 25,
          maxScore: 10
        }
      ]
    }
  };
} 