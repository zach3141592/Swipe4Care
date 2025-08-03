const axios = require('axios');

async function scrapeOpportunities(genAI) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Use Gemini to generate realistic healthcare opportunities
    const prompt = `Generate 5-8 realistic healthcare and clinical trial volunteer opportunities. 
    For each opportunity, provide the following information in JSON format:
    - title: A compelling title for the opportunity
    - description: A detailed description (2-3 sentences)
    - organization: Name of a realistic medical institution or research center
    - location: A real city and state
    - type: Either "clinical_trial", "volunteer", or "research"
    - requirements: Basic requirements (age, health status, etc.)
    - compensation: Compensation offered (can be "None" for volunteer work)
    - url: A placeholder URL like "https://clinicaltrials.gov/study/[ID]"
    - image_url: A placeholder image URL

    Make sure the opportunities are diverse, including different medical fields like cardiology, oncology, mental health, etc.
    Return the response as a valid JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const opportunities = JSON.parse(text);
      console.log(`🔍 Generated ${opportunities.length} opportunities using Gemini AI`);
      return Array.isArray(opportunities) ? opportunities : [opportunities];
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      
      // Fallback to hardcoded opportunities if parsing fails
      return getFallbackOpportunities();
    }

  } catch (error) {
    console.error('Error with Gemini API:', error);
    
    // Fallback to hardcoded opportunities
    return getFallbackOpportunities();
  }
}

function getFallbackOpportunities() {
  return [
    {
      title: "Heart Disease Prevention Study",
      description: "Join our groundbreaking research on early detection of cardiovascular disease. We're studying the effectiveness of lifestyle interventions in preventing heart disease in adults aged 35-65.",
      organization: "Stanford Medical Center",
      location: "Palo Alto, CA",
      type: "clinical_trial",
      requirements: "Ages 35-65, no current heart conditions, willing to commit to 6-month study",
      compensation: "$500 upon completion",
      url: "https://clinicaltrials.gov/study/NCT12345678",
      image_url: "https://via.placeholder.com/400x200/000000/FFFFFF?text=Heart+Study"
    },
    {
      title: "Mental Health Research Volunteer",
      description: "Help advance mental health research by participating in our study on stress reduction techniques. We're examining the effectiveness of mindfulness-based interventions.",
      organization: "UCLA Health",
      location: "Los Angeles, CA",
      type: "research",
      requirements: "Ages 18-55, experiencing mild to moderate stress, no current mental health treatment",
      compensation: "$200 stipend",
      url: "https://clinicaltrials.gov/study/NCT87654321",
      image_url: "https://via.placeholder.com/400x200/000000/FFFFFF?text=Mental+Health"
    },
    {
      title: "Cancer Support Volunteer",
      description: "Make a difference in cancer patients' lives by providing emotional support and companionship during treatment sessions. Training provided.",
      organization: "Memorial Sloan Kettering",
      location: "New York, NY",
      type: "volunteer",
      requirements: "18+, completed background check, 3-month commitment minimum",
      compensation: "None",
      url: "https://mskcc.org/volunteer",
      image_url: "https://via.placeholder.com/400x200/000000/FFFFFF?text=Cancer+Support"
    },
    {
      title: "Diabetes Management Trial",
      description: "Participate in testing a new continuous glucose monitoring system that could revolutionize diabetes care. Study duration: 3 months.",
      organization: "Mayo Clinic",
      location: "Rochester, MN",
      type: "clinical_trial",
      requirements: "Type 2 diabetes, ages 21-70, stable medication regimen",
      compensation: "$750 plus free monitoring device",
      url: "https://clinicaltrials.gov/study/NCT11223344",
      image_url: "https://via.placeholder.com/400x200/000000/FFFFFF?text=Diabetes+Trial"
    }
  ];
}

module.exports = scrapeOpportunities;