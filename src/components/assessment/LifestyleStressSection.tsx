
import React from 'react';
import { AssessmentFeedback } from '@/types/assessment';

interface LifestyleStressSectionProps {
  feedback: AssessmentFeedback;
}

const LifestyleStressSection: React.FC<LifestyleStressSectionProps> = ({ feedback }) => {
  if (!feedback.stressFeedback && !feedback.lifestyleFeedback) {
    return null;
  }

  return (
    <div className="space-y-4">
      {feedback.stressFeedback && (
        <div className="space-y-2">
          <h3 className="font-medium text-ifind-charcoal">Stress Management</h3>
          <p className="text-ifind-charcoal/80">{feedback.stressFeedback}</p>
        </div>
      )}
      
      {feedback.lifestyleFeedback && (
        <div className="space-y-2">
          <h3 className="font-medium text-ifind-charcoal">Lifestyle Factors</h3>
          <p className="text-ifind-charcoal/80">{feedback.lifestyleFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default LifestyleStressSection;
