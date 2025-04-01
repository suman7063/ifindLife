
import React, { useRef } from 'react';
import { Program } from '@/types/programs';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface TrendingProgramsProps {
  programs: Program[];
}

const TrendingPrograms: React.FC<TrendingProgramsProps> = ({ programs }) => {
  const navigate = useNavigate();
  
  if (programs.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-ifind-purple" />
          <h2 className="text-2xl font-bold">Trending Programs</h2>
        </div>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {programs.map((program) => (
            <CarouselItem key={program.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-ifind-purple text-white text-xs px-2 py-1 rounded-full">
                    {program.enrollments} enrolled
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/program/${program.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default TrendingPrograms;
