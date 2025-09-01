import { NextRequest, NextResponse } from 'next/server';
import { analyzeEssay } from '@/lib/openai';

function getRubrics() {
  return {
    ielts: {
      name: "IELTS Writing Task 2",
      rubric: `
IELTS Writing Task 2 Assessment Criteria (Band 1-9):

1. Task Response (25%)
- Band 9: Fully addresses all parts of the task with well-developed response
- Band 7: Addresses all parts with clear position and relevant examples
- Band 5: Addresses the task but may be incomplete or unclear
- Band 3: Attempts to address task but limited understanding

2. Coherence and Cohesion (25%)
- Band 9: Seamless cohesion with wide range of linking devices
- Band 7: Clear logical progression with effective linking
- Band 5: Generally coherent with some effective linking
- Band 3: Limited coherence with basic linking

3. Lexical Resource (25%)
- Band 9: Wide range of vocabulary with natural and sophisticated usage
- Band 7: Wide range with some flexibility and precise usage
- Band 5: Limited range but adequate for the task
- Band 3: Limited vocabulary with frequent errors

4. Grammatical Range and Accuracy (25%)
- Band 9: Wide range of structures with full flexibility and accuracy
- Band 7: Range of complex structures with good control
- Band 5: Mix of simple and complex forms with some errors
- Band 3: Limited range with frequent errors

Word count requirement: 250+ words
Time limit: 40 minutes`
    },
    toefl: {
      name: "TOEFL Independent Writing",
      rubric: `
TOEFL Independent Writing Assessment (Score 0-30):

1. Development (33%)
- Score 25-30: Well-developed with clear reasoning and relevant examples
- Score 17-24: Generally well-developed with appropriate details
- Score 10-16: Somewhat developed but may lack focus or examples
- Score 1-9: Limited development with unclear reasoning

2. Organization (33%)
- Score 25-30: Clear structure with effective transitions
- Score 17-24: Generally organized with clear progression
- Score 10-16: Some organization but may lack clarity
- Score 1-9: Little to no organization

3. Language Use (33%)
- Score 25-30: Effective use of grammar and vocabulary
- Score 17-24: Generally effective with minor errors
- Score 10-16: Some effective language use but noticeable errors
- Score 1-9: Limited and often inaccurate language use

Word count requirement: 300+ words
Time limit: 30 minutes`
    },
    "metu-epe": {
      name: "METU EPE Writing",
      rubric: `
METU EPE Writing Assessment Criteria:

1. Content (25%)
- Excellent: Thorough treatment of topic with insightful ideas
- Good: Adequate treatment with relevant ideas
- Satisfactory: Basic treatment with some relevant ideas
- Needs Improvement: Limited or irrelevant content

2. Organization (25%)
- Excellent: Clear structure with smooth transitions
- Good: Generally well-organized with adequate transitions
- Satisfactory: Basic organization with some transitions
- Needs Improvement: Poor organization or unclear structure

3. Language Use (25%)
- Excellent: Sophisticated vocabulary and complex structures
- Good: Good vocabulary and varied sentence structures
- Satisfactory: Adequate vocabulary with some variety
- Needs Improvement: Limited vocabulary and simple structures

4. Mechanics (25%)
- Excellent: Error-free grammar, spelling, and punctuation
- Good: Minor errors that don't interfere with meaning
- Satisfactory: Some errors but generally clear
- Needs Improvement: Frequent errors that interfere with meaning

Word count requirement: 250+ words
Time limit: 45 minutes`
    }
  };
}

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