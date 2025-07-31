// Debug script to test AI API connection
// Run this to identify the specific issue

const testAIConnection = async () => {
  console.log('🔍 Testing AI API Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('github_token:', process.env.github_token ? '✅ Set' : '❌ Missing');
  console.log('openai_base_url:', process.env.openai_base_url ? '✅ Set' : '❌ Missing');
  console.log('openai_model:', process.env.openai_model ? '✅ Set' : '❌ Missing');
  console.log('');
  
  if (!process.env.github_token) {
    console.log('❌ ERROR: github_token is missing!');
    console.log('Please add it to your Vercel environment variables.');
    return;
  }
  
  if (!process.env.openai_base_url) {
    console.log('❌ ERROR: openai_base_url is missing!');
    console.log('Please add it to your Vercel environment variables.');
    return;
  }
  
  // Test API call
  console.log('🚀 Testing API call...');
  
  try {
    const response = await fetch('/api/analyze-essay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        essay: "This is a test essay to verify the AI API is working correctly.",
        examType: "ielts",
        title: "Test Essay",
        topic: "Technology"
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: AI API is working!');
      console.log('Feedback:', result.feedback);
    } else {
      console.log('❌ ERROR:', result.error);
      if (result.details) {
        console.log('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
};

// Run the test
testAIConnection(); 