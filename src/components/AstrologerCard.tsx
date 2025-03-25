
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface AstrologerCardProps {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string; // Made optional with the ? mark
  imageUrl: string;
  online?: boolean;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  consultations,
  price,
  waitTime = "Available", // Added default value
  imageUrl,
  online
}) => {
  // Format specialties for display
  const formattedSpecialties = specialties?.length > 0 
    ? specialties.slice(0, 2).join(', ') + (specialties.length > 2 ? '...' : '')
    : 'Mental Health Specialist';

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${online ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {online ? 'Online' : 'Offline'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Dr. {name}</h3>
          <div className="bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded text-xs">
            {waitTime}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">{formattedSpecialties}</p>
        
        <div className="flex items-center text-sm mb-3">
          <div className="flex items-center text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-gray-500">({consultations})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-gray-500 text-sm">Experience:</span>
            <span className="text-sm ml-1">{experience} years</span>
          </div>
          <div>
            <span className="font-bold">₹{price}</span>
            <span className="text-xs text-gray-500">/min</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/experts/${id}`}>
            <Button className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white w-full" size="sm">
              View Profile
            </Button>
          </Link>
          <Link to={`/experts/${id}?booking=true`}>
            <Button variant="outline" className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua/10 w-full" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default AstrologerCard;
