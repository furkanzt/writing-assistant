import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function analyzeEssay(essay: string, examType: string, prompt?: string) {
  const rubrics = getRubrics();
  const selectedRubric = rubrics[examType as keyof typeof rubrics];
  
  if (!selectedRubric) {
    throw new Error("Invalid exam type");
  }

  const systemPrompt = `You are an expert essay evaluator for ${selectedRubric.name} exams. 
Your task is to analyze and provide CONCISE feedback on essays based on the following rubric:

${selectedRubric.rubric}

Please provide a SHORT, focused feedback with:
1. **Overall Score**: Clear score/grade based on the exam's scoring system
2. **Key Strengths**: 2-3 main strong points (use bullet points)
3. **Areas for Improvement**: 2-3 specific areas to work on (use bullet points)
4. **Quick Tips**: 2-3 actionable suggestions

Keep your response under 300 words. Use markdown formatting (**bold** for headings, bullet points). Be constructive and encouraging.`;

  const userPrompt = prompt || `Please analyze this ${selectedRubric.name} essay and provide detailed feedback:

Essay: "${essay}"`;

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: process.env.OPENAI_MODEL || "openai/gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content;
}

export async function chatAboutFeedback(messages: Array<{role: 'user' | 'assistant', content: string}>, examType: string, originalEssay: string) {
  const rubrics = getRubrics();
  const selectedRubric = rubrics[examType as keyof typeof rubrics];
  
  const systemPrompt = `You are an expert essay tutor for ${selectedRubric.name} exams. You have already provided feedback on the student's essay. 

Original essay: "${originalEssay}"

Your role is to:
1. Answer questions about your previous feedback
2. Clarify assessment criteria
3. Provide additional guidance on essay writing for this exam type
4. Suggest specific improvements

IMPORTANT RESTRICTIONS:
- Only discuss topics related to the essay feedback, writing improvement, and exam preparation
- Do not answer questions unrelated to essay writing or exam preparation
- If asked about unrelated topics, politely redirect the conversation back to essay improvement
- Stay focused on helping the student improve their writing skills
- Keep responses SHORT and CONCISE (under 150 words)
- Use bullet points when listing multiple items

Be helpful, encouraging, and educational in your responses.`;

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
    model: process.env.OPENAI_MODEL || "openai/gpt-4o",
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
}

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