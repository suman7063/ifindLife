
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { AssessmentFeedback, AssessmentScore } from '@/types/assessment';

interface PDFGeneratorProps {
  scores: AssessmentScore;
  phq4Risk: { level: string; color: string };
  phq4Percentage: number;
  feedback: AssessmentFeedback;
}

const PDFGenerator = React.forwardRef<HTMLDivElement, PDFGeneratorProps>(
  ({ scores, phq4Risk, phq4Percentage, feedback }, ref) => {
    return (
      <div ref={ref} className="fixed -left-[9999px] w-[210mm]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="bg-white p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-ifind-teal/30 pb-6">
            <div>
              <img src="/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png" alt="iFindLife" className="h-12 mb-2" />
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
            <div className="border-l-4 border-l-ifind-purple bg-gradient-to-r from-ifind-purple/10 to-white p-5 rounded-lg shadow-sm">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-ifind-purple mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-ifind-charcoal mb-2">Important Health Information</h3>
                  <div className="space-y-2 text-ifind-charcoal/90">
                    {feedback.depressionFeedback && <p>{feedback.depressionFeedback}</p>}
                    {feedback.anxietyFeedback && <p>{feedback.anxietyFeedback}</p>}
                    {feedback.overallMentalHealthFeedback && (
                      <p className="font-medium text-ifind-purple">{feedback.overallMentalHealthFeedback}</p>
                    )}
                  </div>
                </div>
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
    );
  }
);

PDFGenerator.displayName = 'PDFGenerator';

export default PDFGenerator;
