
import React from 'react';
import { Clock, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface OutcomesSectionProps {
  expectedOutcomes: ProgramDetail['expectedOutcomes'];
}

const OutcomesSection: React.FC<OutcomesSectionProps> = ({ expectedOutcomes }) => {
  return (
    <div className="space-y-6">
      {/* Timeline View */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Expected Outcomes Timeline</h3>
        <div className="space-y-6">
          {/* Short Term */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-green-500" />
              <h4 className="font-semibold text-green-700">Short Term (2-4 weeks)</h4>
            </div>
            <ul className="space-y-2">
              {expectedOutcomes.shortTerm.map((outcome, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medium Term */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold text-blue-700">Medium Term (1-3 months)</h4>
            </div>
            <ul className="space-y-2">
              {expectedOutcomes.mediumTerm.map((outcome, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long Term */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-purple-500" />
              <h4 className="font-semibold text-purple-700">Long Term (3+ months)</h4>
            </div>
            <ul className="space-y-2">
              {expectedOutcomes.longTerm.map((outcome, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Success Metrics</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expectedOutcomes.successMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ifind-teal rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomesSection;
