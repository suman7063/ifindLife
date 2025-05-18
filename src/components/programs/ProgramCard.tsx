
import React from 'react';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/database/unified';
import { CalendarDays, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgramCardProps {
  program: Program;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program,
  currentUser,
  isAuthenticated
}) => {
  const navigate = useNavigate();
  
  // Default images for different program types
  const getDefaultProgramImage = (type: string) => {
    switch (type) {
      case 'business':
        return '/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png';
      case 'academic':
        return '/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png';
      default:
        return '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png';
    }
  };
  
  const handleProgramClick = () => {
    navigate(`/program/${program.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={program.image || getDefaultProgramImage(program.programType)} 
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-sm font-medium py-1 px-2 rounded">
          {program.category}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl text-ifind-purple">{program.title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {program.programType === 'business' 
            ? 'For Organizations & Teams' 
            : program.programType === 'academic' 
              ? 'For Educational Institutions' 
              : 'For Individual Wellness'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {program.description}
        </p>
        
        <div className="flex gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.duration || 'Flexible'} duration</span>
          </div>
          
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{program.sessions || '-'} sessions</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="font-semibold">
            {program.price ? `₹${program.price.toLocaleString()}` : 'Contact for pricing'}
          </div>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={handleProgramClick}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
