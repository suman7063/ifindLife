
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { AssessmentFeedback } from '@/types/assessment';

interface ImportantHealthAlertProps {
  feedback: AssessmentFeedback;
}

const ImportantHealthAlert: React.FC<ImportantHealthAlertProps> = ({ feedback }) => {
  if (!feedback.depressionFeedback && !feedback.anxietyFeedback && !feedback.overallMentalHealthFeedback) {
    return null;
  }

  return (
    <div className="rounded-lg border-l-4 border-l-ifind-purple bg-gradient-to-r from-ifind-purple/10 to-ifind-offwhite p-4 shadow-sm">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-ifind-purple mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-ifind-charcoal mb-2">Important Health Information</h4>
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
  );
};

export default ImportantHealthAlert;
