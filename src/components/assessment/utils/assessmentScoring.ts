
import { AssessmentData, AssessmentScore, AssessmentFeedback } from '@/types/assessment';

// Calculate scores from assessment data
export const calculateScores = (assessmentData: AssessmentData): AssessmentScore => {
  const phq2Score = assessmentData.emotionalWellbeing.depression.reduce((sum, val) => sum + val, 0);
  const gad2Score = assessmentData.emotionalWellbeing.anxiety.reduce((sum, val) => sum + val, 0);
  const phq4TotalScore = phq2Score + gad2Score;
  
  const stressCopingScore = assessmentData.stressCoping.reduce((sum, val) => sum + val, 0);
  const lifestyleHealthScore = assessmentData.lifestyleHealth.reduce((sum, val) => sum + val, 0);
  
  const totalScore = phq4TotalScore + stressCopingScore + lifestyleHealthScore;
  
  return {
    phq2Score,
    gad2Score,
    phq4TotalScore,
    stressCopingScore,
    lifestyleHealthScore,
    totalScore
  };
};

// Map PHQ-4 score to risk level and color
export const getPhq4RiskLevel = (score: number): { level: string; color: string } => {
  if (score <= 2) return { level: "Normal", color: "bg-green-500" };
  if (score <= 5) return { level: "Mild", color: "bg-yellow-500" };
  if (score <= 8) return { level: "Moderate", color: "bg-orange-500" };
  return { level: "Severe", color: "bg-red-500" };
};

// Generate feedback based on scores
export const generateFeedback = (scores: AssessmentScore): AssessmentFeedback => {
  const feedback: AssessmentFeedback = {
    generalRecommendations: [],
    resourceLinks: []
  };
  
  // Depression feedback
  if (scores.phq2Score >= 3) {
    feedback.depressionFeedback = "Your answers suggest you may be experiencing symptoms of depression. Consider speaking with a healthcare professional.";
    feedback.generalRecommendations.push("Practice self-care activities that bring you joy");
    feedback.generalRecommendations.push("Maintain social connections with supportive people");
    feedback.resourceLinks.push({
      title: "Depression Resources",
      description: "Learn more about depression and find support",
      url: "https://www.nimh.nih.gov/health/topics/depression"
    });
  }
  
  // Anxiety feedback
  if (scores.gad2Score >= 3) {
    feedback.anxietyFeedback = "Your answers suggest you may be experiencing symptoms of anxiety. Consider speaking with a healthcare professional.";
    feedback.generalRecommendations.push("Practice deep breathing or mindfulness techniques");
    feedback.generalRecommendations.push("Limit exposure to stressful situations when possible");
    feedback.resourceLinks.push({
      title: "Anxiety Resources",
      description: "Tools and techniques to manage anxiety",
      url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders"
    });
  }
  
  // Overall mental health feedback
  if (scores.phq4TotalScore >= 6) {
    feedback.overallMentalHealthFeedback = "Your answers suggest the presence of significant depression and anxiety symptoms. Please seek help from a mental health professional.";
    feedback.resourceLinks.push({
      title: "Find a Therapist",
      description: "Search for mental health professionals in your area",
      url: "https://www.psychologytoday.com/us/therapists"
    });
  }
  
  // Stress feedback
  if (scores.stressCopingScore >= 8) {
    feedback.stressFeedback = "Your stress levels appear to be high. Consider implementing stress management techniques into your daily routine.";
    feedback.generalRecommendations.push("Schedule regular breaks throughout your day");
    feedback.generalRecommendations.push("Try stress-relief activities like yoga or meditation");
    feedback.resourceLinks.push({
      title: "Stress Management Techniques",
      description: "Effective ways to reduce and manage stress",
      url: "https://www.apa.org/topics/stress/manage-stress"
    });
  }
  
  // Lifestyle feedback
  if (scores.lifestyleHealthScore >= 6) {
    feedback.lifestyleFeedback = "Your lifestyle habits may be affecting your mental well-being. Small improvements in sleep, exercise, and substance use can have significant benefits.";
    feedback.generalRecommendations.push("Aim for 7-8 hours of sleep each night");
    feedback.generalRecommendations.push("Incorporate regular physical activity into your routine");
    feedback.generalRecommendations.push("Limit alcohol and substance use, especially as coping mechanisms");
    feedback.resourceLinks.push({
      title: "Healthy Sleep Habits",
      description: "Tips for improving sleep quality",
      url: "https://www.sleepfoundation.org/sleep-hygiene"
    });
  }
  
  // Add general recommendations if none were added yet
  if (feedback.generalRecommendations.length === 0) {
    feedback.generalRecommendations.push("Continue monitoring your mental well-being");
    feedback.generalRecommendations.push("Practice regular self-care");
    feedback.generalRecommendations.push("Maintain social connections");
  }
  
  // Add general resource if none were added yet
  if (feedback.resourceLinks.length === 0) {
    feedback.resourceLinks.push({
      title: "Mental Health Resources",
      description: "General mental health information and resources",
      url: "https://www.mentalhealth.gov/get-help"
    });
  }
  
  return feedback;
};
