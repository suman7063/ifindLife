
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface ExpertAboutProps {
  description: string;
  experience: number;
  education?: string;
  specialties: string[];
}

const ExpertAbout: React.FC<ExpertAboutProps> = ({ 
  description, 
  experience, 
  education, 
  specialties 
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        <p className="text-muted-foreground">{experience} years of experience</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Specialities</h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} className="bg-astro-light-purple/10 text-astro-purple hover:bg-astro-light-purple/20 px-3 py-1">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
      
      {education && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Education & Certification</h2>
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-astro-purple mt-0.5" />
            <div>
              <div className="font-medium">{education}</div>
              <div className="text-sm text-muted-foreground">Certified Expert</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertAbout;
