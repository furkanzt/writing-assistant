// Test script to verify AI features work on Vercel
// Run this after deploying to Vercel

const testAIFeatures = async () => {
  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
  
  console.log('Testing AI features on:', baseUrl);
  
  try {
    // Test essay analysis
    const response = await fetch(`${baseUrl}/api/analyze-essay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        essay: "This is a test essay to verify AI features are working on Vercel.",
        examType: "ielts",
        title: "Test Essay",
        topic: "Technology"
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ AI features are working!');
      console.log('Feedback:', result.feedback);
    } else {
      console.log('❌ AI features failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing AI features:', error);
  }
};

// Run the test
testAIFeatures(); 