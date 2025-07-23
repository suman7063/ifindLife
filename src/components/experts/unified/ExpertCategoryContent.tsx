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
  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      'listening-volunteer': 'from-ifind-teal to-ifind-teal',
      'listening-expert': 'from-ifind-aqua to-ifind-aqua', 
      'mindfulness-expert': 'from-cyan-500 to-cyan-500',
      'life-coach': 'from-purple-500 to-purple-500',
      'spiritual-mentor': 'from-ifind-purple to-ifind-purple'
    };
    return colorMap[categoryId] || 'from-ifind-teal to-ifind-teal';
  };

  const getCategoryTextColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      'listening-volunteer': 'text-ifind-teal',
      'listening-expert': 'text-ifind-aqua',
      'mindfulness-expert': 'text-cyan-500', 
      'life-coach': 'text-purple-500',
      'spiritual-mentor': 'text-ifind-purple'
    };
    return colorMap[categoryId] || 'text-ifind-teal';
  };

  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className={`bg-gradient-to-r ${getCategoryColor(category.id)} bg-clip-text text-transparent`}>
            {category.title}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* What They Offer Section */}
      <div className="bg-gradient-to-br from-white/80 to-card/60 backdrop-blur-sm rounded-xl p-8 mb-12 border shadow-lg">
        <h2 className={`text-2xl font-semibold mb-6 text-center ${getCategoryTextColor(category.id)}`}>
          What {category.title} Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {category.offerings.map((offering, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200 hover:shadow-md">
              <h3 className={`font-semibold mb-3 text-lg ${getCategoryTextColor(category.id)}`}>
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