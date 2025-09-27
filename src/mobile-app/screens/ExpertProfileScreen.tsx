import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Video, MessageSquare, Calendar, MapPin, Clock } from 'lucide-react';

export const ExpertProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();

  const expert = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    speciality: 'Anxiety & Stress Management',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    avatar: 'SJ',
    available: true,
    bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience helping individuals overcome anxiety, stress, and depression. She specializes in cognitive behavioral therapy and mindfulness-based interventions.',
    languages: ['English', 'Spanish'],
    location: 'California, USA',
    experience: '10+ years'
  };

  return (
    <div className="flex flex-col bg-background">
      <div className="bg-gradient-to-br from-ifind-aqua/10 to-ifind-teal/10 p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{expert.avatar}</span>
            </div>
            {expert.available && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal">{expert.name}</h1>
            <p className="text-muted-foreground">{expert.title}</p>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {expert.rating} ({expert.sessions} sessions)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white py-6">
            <Video className="h-5 w-5 mr-2" />
            Video Call
          </Button>
          <Button variant="outline" className="border-ifind-aqua text-ifind-aqua py-6">
            <MessageSquare className="h-5 w-5 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
        </div>

        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-3">Details</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{expert.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{expert.experience} experience</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-ifind-aqua/10 to-ifind-teal/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-poppins font-semibold text-ifind-charcoal">Session Rate</h3>
            <span className="text-2xl font-bold text-ifind-aqua">${expert.price}</span>
          </div>
          <Button
            onClick={() => navigate('/mobile-app/app/booking')}
            className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white py-6"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};