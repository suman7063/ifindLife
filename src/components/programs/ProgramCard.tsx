
import React, { useState } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/useDialog';
import { Heart } from 'lucide-react';
import ProgramDetailDialog from './ProgramDetailDialog';
import { withProgramUserTypeA } from './ProgramUserAdapter';

interface ProgramCardProps {
  program: Program;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  className?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, currentUser, isAuthenticated, className = '' }) => {
  const { showDialog } = useDialog();
  
  const handleViewDetails = () => {
    showDialog(
      <ProgramDetailDialog 
        program={program} 
        currentUser={currentUser} 
        isAuthenticated={isAuthenticated} 
      />
    );
  };

  return (
    <Card className={`overflow-hidden h-full flex flex-col ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={program.image || '/placeholder-program.jpg'} 
          alt={program.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {program.is_favorite && (
          <div className="absolute top-3 right-3">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{program.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{program.duration}</span>
          <span>•</span>
          <span>{program.sessions} sessions</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-2">
        <p className="text-muted-foreground line-clamp-3">
          {program.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center border-t">
        <div className="font-semibold">
          ${program.price}
        </div>
        <Button 
          variant="default" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Export with adapter to handle different user profile types
export default withProgramUserTypeA(ProgramCard);
