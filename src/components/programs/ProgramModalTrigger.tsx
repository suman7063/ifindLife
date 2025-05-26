
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Star, Calendar } from 'lucide-react';

interface ProgramModalTriggerProps {
  program: {
    id: string;
    title: string;
    description: string;
    duration: string;
    price: number;
    sessions: number;
    enrollments: number;
    image: string;
    category: string;
  };
  onOpenModal: (programId: string) => void;
}

const ProgramModalTrigger: React.FC<ProgramModalTriggerProps> = ({ 
  program, 
  onOpenModal 
}) => {
  const handleViewDetails = () => {
    onOpenModal(program.id);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={program.image} 
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
            ₹{program.price.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{program.title}</CardTitle>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{program.sessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{program.enrollments} enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8 (127)</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-ifind-teal hover:bg-ifind-teal/90"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramModalTrigger;
