
import React from 'react';
import { ProgramDetail } from '@/types/programDetail';
import CourseStructureSection from './sections/CourseStructureSection';
import CoverageSection from './sections/CoverageSection';
import OutcomesSection from './sections/OutcomesSection';
import PricingSection from './sections/PricingSection';
import ReviewsSection from './sections/ReviewsSection';

interface ProgramDetailContentProps {
  programData: ProgramDetail;
  activeTab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews';
}

const ProgramDetailContent: React.FC<ProgramDetailContentProps> = ({
  programData,
  activeTab
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'structure':
        return <CourseStructureSection courseStructure={programData.courseStructure} />;
      case 'coverage':
        return <CoverageSection coverage={programData.coverage} />;
      case 'outcomes':
        return <OutcomesSection expectedOutcomes={programData.expectedOutcomes} />;
      case 'pricing':
        return <PricingSection pricing={programData.pricing} duration={programData.duration} />;
      case 'reviews':
        return <ReviewsSection reviews={programData.reviews} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default ProgramDetailContent;
