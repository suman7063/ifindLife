
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AssessmentFeedback } from '@/types/assessment';

interface RecommendationsSectionProps {
  feedback: AssessmentFeedback;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ feedback }) => {
  return (
    <div className="space-y-8">
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
    </div>
  );
};

export default RecommendationsSection;
