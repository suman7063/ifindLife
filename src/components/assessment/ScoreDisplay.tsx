
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AssessmentScore } from '@/types/assessment';
import { getPhq4RiskLevel } from './utils/assessmentScoring';

interface ScoreDisplayProps {
  scores: AssessmentScore;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores }) => {
  const phq4Risk = getPhq4RiskLevel(scores.phq4TotalScore);
  const phq4Percentage = (scores.phq4TotalScore / 12) * 100;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-ifind-charcoal">Emotional Well-Being Score</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-ifind-charcoal/70">Risk Level: {phq4Risk.level}</span>
          <span className="font-medium">{scores.phq4TotalScore} / 12</span>
        </div>
        <Progress value={phq4Percentage} className={`h-2 ${phq4Risk.color}`} />
      </div>
    </div>
  );
};

export default ScoreDisplay;
