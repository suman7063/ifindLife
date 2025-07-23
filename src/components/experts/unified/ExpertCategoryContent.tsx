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
        <h1 className="text-4xl font-bold mb-4">
          <span className={`bg-gradient-to-r ${
            ['listening-volunteer', 'listening-expert'].includes(category.id)
              ? 'from-ifind-teal to-ifind-aqua'
              : 'from-ifind-purple to-purple-400'
          } bg-clip-text text-transparent`}>
            {category.title}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* What They Offer Section */}
      <div className="bg-gradient-to-br from-white/80 to-card/60 backdrop-blur-sm rounded-xl p-8 mb-12 border shadow-lg">
        <h2 className={`text-2xl font-semibold mb-6 text-center ${
          ['listening-volunteer', 'listening-expert'].includes(category.id)
            ? 'text-ifind-teal'
            : 'text-ifind-purple'
        }`}>
          What {category.title} Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {category.offerings.map((offering, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200 hover:shadow-md">
              <h3 className={`font-semibold mb-3 text-lg ${
                ['listening-volunteer', 'listening-expert'].includes(category.id)
                  ? 'text-ifind-teal'
                  : 'text-ifind-purple'
              }`}>
                {offering.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{offering.description}</p>
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