
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Clock } from 'lucide-react';
import { Program } from '@/types/programs';

interface BrandCompliantProgramCardProps {
  program: Program;
  currentUser: any;
  isAuthenticated: boolean;
  onEnroll?: () => void;
  onViewDetails?: () => void;
}

const BrandCompliantProgramCard: React.FC<BrandCompliantProgramCardProps> = ({
  program,
  currentUser,
  isAuthenticated,
  onEnroll,
  onViewDetails
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quick-ease':
        return 'bg-ifind-teal/10 text-ifind-teal border-ifind-teal/20';
      case 'resilience-building':
        return 'bg-ifind-aqua/10 text-ifind-aqua border-ifind-aqua/20';
      case 'super-human':
        return 'bg-ifind-purple/10 text-ifind-purple border-ifind-purple/20';
      case 'issue-based':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full border-ifind-teal/20 hover:border-ifind-teal/40 transition-all duration-300 flex flex-col group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={program.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white text-ifind-charcoal p-2 h-auto"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-ifind-charcoal leading-tight">
            {program.title}
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(program.category)}`}>
            {program.category?.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <CardDescription className="text-gray-600 line-clamp-2">
          {program.description}
        </CardDescription>
      </CardHeader>

      {/* Program Details */}
      <CardContent className="pb-4 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{program.enrollments || 0} enrolled</span>
          </div>
        </div>

        {/* Price and CTA Section - Always at bottom */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-ifind-charcoal">₹{program.price}</span>
              {program.sessions && (
                <span className="text-sm text-gray-500 ml-1">
                  ({program.sessions} sessions)
                </span>
              )}
            </div>
          </div>

          {/* CTA Buttons - Vertically aligned */}
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-ifind-teal hover:bg-ifind-teal/90 text-white"
              onClick={onEnroll}
            >
              {isAuthenticated ? 'Enroll Now' : 'View Program'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-ifind-teal text-ifind-teal hover:bg-ifind-teal/10"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCompliantProgramCard;
