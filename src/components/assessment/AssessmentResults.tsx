import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { AssessmentData, AssessmentScore, AssessmentFeedback } from '@/types/assessment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AssessmentResultsProps {
  assessmentData: AssessmentData;
  onRetake: () => void;
  onExit: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessmentData,
  onRetake,
  onExit,
}) => {
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const pdfRef = React.useRef<HTMLDivElement>(null);

  // Calculate scores
  const calculateScores = (): AssessmentScore => {
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

  // Generate feedback based on scores
  const generateFeedback = (scores: AssessmentScore): AssessmentFeedback => {
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

  const scores = calculateScores();
  const feedback = generateFeedback(scores);

  // Map PHQ-4 score to risk level and color
  const getPhq4RiskLevel = (score: number): { level: string; color: string } => {
    if (score <= 2) return { level: "Normal", color: "bg-green-500" };
    if (score <= 5) return { level: "Mild", color: "bg-yellow-500" };
    if (score <= 8) return { level: "Moderate", color: "bg-orange-500" };
    return { level: "Severe", color: "bg-red-500" };
  };

  const phq4Risk = getPhq4RiskLevel(scores.phq4TotalScore);
  const phq4Percentage = (scores.phq4TotalScore / 12) * 100;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('ifindlife-mental-wellbeing-assessment.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-ifind-charcoal mb-2">
          Your Assessment Results
        </h2>
        <p className="text-ifind-charcoal/70 mb-6">
          Thank you for completing the assessment. Review your results below.
        </p>
      </div>

      <div ref={resultsRef} className="space-y-8 pb-4">
        {/* PHQ-4 Score */}
        <div className="space-y-4">
          <h3 className="font-medium text-ifind-charcoal">Emotional Well-Being Score</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ifind-charcoal/70">Risk Level: {phq4Risk.level}</span>
              <span className="font-medium">{scores.phq4TotalScore} / 12</span>
            </div>
            <Progress value={phq4Percentage} className={`h-2 ${phq4Risk.color}`} />
          </div>
          
          {(feedback.depressionFeedback || feedback.anxietyFeedback || feedback.overallMentalHealthFeedback) && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="space-y-2">
                {feedback.depressionFeedback && <p>{feedback.depressionFeedback}</p>}
                {feedback.anxietyFeedback && <p>{feedback.anxietyFeedback}</p>}
                {feedback.overallMentalHealthFeedback && <p>{feedback.overallMentalHealthFeedback}</p>}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Stress & Coping */}
        {feedback.stressFeedback && (
          <div className="space-y-2">
            <h3 className="font-medium text-ifind-charcoal">Stress Management</h3>
            <p className="text-ifind-charcoal/80">{feedback.stressFeedback}</p>
          </div>
        )}
        
        {/* Lifestyle & Health */}
        {feedback.lifestyleFeedback && (
          <div className="space-y-2">
            <h3 className="font-medium text-ifind-charcoal">Lifestyle Factors</h3>
            <p className="text-ifind-charcoal/80">{feedback.lifestyleFeedback}</p>
          </div>
        )}
        
        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="font-medium text-ifind-charcoal">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 text-ifind-charcoal/80 pl-2">
            {feedback.generalRecommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        
        {/* Resources */}
        <div className="space-y-4">
          <h3 className="font-medium text-ifind-charcoal">Helpful Resources</h3>
          <div className="space-y-3">
            {feedback.resourceLinks.map((resource, index) => (
              <div key={index} className="bg-ifind-offwhite p-3 rounded-lg">
                <h4 className="font-medium text-ifind-teal">{resource.title}</h4>
                <p className="text-sm text-ifind-charcoal/70 mb-2">{resource.description}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm text-ifind-aqua hover:text-ifind-teal transition-colors"
                >
                  Learn more <ChevronRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <Alert className="bg-ifind-offwhite border-ifind-teal/30">
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription className="text-sm text-ifind-charcoal/70">
            This assessment is for informational purposes only and is not a substitute for professional diagnosis or treatment. 
            If you are concerned about your mental health, please reach out to a healthcare professional.
          </AlertDescription>
        </Alert>
      </div>

      <div ref={pdfRef} className="fixed -left-[9999px] w-[210mm]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="bg-white p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-ifind-teal/30 pb-6">
            <div>
              <img src="/ifindlife-logo.png" alt="iFindLife" className="h-12 mb-2" />
              <h1 className="text-2xl font-bold text-ifind-charcoal">Mental Well-Being Assessment</h1>
              <p className="text-ifind-charcoal/70">Results & Recommendations</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-ifind-charcoal/70">Date:</div>
              <div className="font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="bg-ifind-offwhite p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-ifind-charcoal mb-4">Emotional Well-Being Score</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ifind-charcoal/70">Risk Level: {phq4Risk.level}</span>
                <span className="font-medium">{scores.phq4TotalScore} / 12</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${phq4Risk.color}`} 
                  style={{ width: `${phq4Percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {(feedback.depressionFeedback || feedback.anxietyFeedback || feedback.overallMentalHealthFeedback) && (
            <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
              <h3 className="flex items-center text-red-700 font-medium">
                <AlertCircle className="h-4 w-4 mr-2" /> Important
              </h3>
              <div className="mt-2 space-y-2 text-red-700">
                {feedback.depressionFeedback && <p>{feedback.depressionFeedback}</p>}
                {feedback.anxietyFeedback && <p>{feedback.anxietyFeedback}</p>}
                {feedback.overallMentalHealthFeedback && <p>{feedback.overallMentalHealthFeedback}</p>}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            {feedback.stressFeedback && (
              <div className="space-y-2 bg-ifind-offwhite p-4 rounded-lg">
                <h3 className="font-medium text-ifind-charcoal">Stress Management</h3>
                <p className="text-ifind-charcoal/80">{feedback.stressFeedback}</p>
              </div>
            )}
            
            {feedback.lifestyleFeedback && (
              <div className="space-y-2 bg-ifind-offwhite p-4 rounded-lg">
                <h3 className="font-medium text-ifind-charcoal">Lifestyle Factors</h3>
                <p className="text-ifind-charcoal/80">{feedback.lifestyleFeedback}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3 bg-ifind-offwhite p-4 rounded-lg">
            <h3 className="font-medium text-ifind-teal">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1 text-ifind-charcoal/80 pl-2">
              {feedback.generalRecommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-ifind-teal">Helpful Resources</h3>
            <div className="grid grid-cols-2 gap-4">
              {feedback.resourceLinks.map((resource, index) => (
                <div key={index} className="bg-ifind-offwhite p-3 rounded-lg">
                  <h4 className="font-medium text-ifind-teal">{resource.title}</h4>
                  <p className="text-sm text-ifind-charcoal/70 mb-1">{resource.description}</p>
                  <div className="text-sm text-ifind-aqua">{resource.url}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-ifind-charcoal/60 mt-6 border-t border-ifind-teal/20 pt-4">
            <p className="font-medium mb-1">Disclaimer:</p>
            <p>This assessment is for informational purposes only and is not a substitute for professional diagnosis or treatment. 
            If you are concerned about your mental health, please reach out to a healthcare professional.</p>
            <div className="mt-4 text-center">
              <p>© {new Date().getFullYear()} iFindLife. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          className="border-ifind-teal/50 text-ifind-teal"
        >
          <Download className="h-4 w-4 mr-2" /> Download Results
        </Button>
        
        <Button
          variant="outline"
          onClick={onRetake}
          className="border-ifind-purple/50 text-ifind-purple"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retake Assessment
        </Button>
        
        <Button
          onClick={onExit}
          className="bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-opacity text-white sm:ml-auto"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResults;
