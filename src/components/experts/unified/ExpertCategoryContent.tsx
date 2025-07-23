import React from 'react';
import { ExpertCategory } from '@/data/expertCategories';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import { ExpertCardData } from '@/components/expert-card/types';

interface ExpertCategoryContentProps {
  category: ExpertCategory;
  experts: ExpertCardData[];
  loading: boolean;
}

const ExpertCategoryContent: React.FC<ExpertCategoryContentProps> = ({
  category,
  experts,
  loading
}) => {
  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
          {category.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* What They Offer Section */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 mb-12 border">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          What {category.title} Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {category.offerings.map((offering, index) => (
            <div key={index} className="text-center">
              <h3 className="font-medium mb-2">{offering.title}</h3>
              <p className="text-sm text-muted-foreground">{offering.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Experts Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Available {category.title}
        </h2>
        {experts.length > 0 ? (
          <ExpertsGrid experts={experts} loading={loading} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No {category.title.toLowerCase()} are currently available. Please check back soon or explore other expert categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertCategoryContent;