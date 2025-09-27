import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Video, MessageSquare } from 'lucide-react';

const mockExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    speciality: 'Anxiety & Stress',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    avatar: 'SJ',
    available: true,
    description: 'Specialized in cognitive behavioral therapy with 10+ years experience'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    speciality: 'Depression & Therapy',
    rating: 4.8,
    sessions: 950,
    price: 45,
    avatar: 'MC',
    available: false,
    description: 'Expert in depression treatment and mindfulness-based therapy'
  }
];

export const ExpertsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col bg-background">
      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experts..."
            className="pl-10 pr-12"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          {mockExperts.map((expert) => (
            <div
              key={expert.id}
              onClick={() => navigate(`/mobile-app/app/experts/${expert.id}`)}
              className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{expert.avatar}</span>
                  </div>
                  {expert.available && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-medium text-ifind-charcoal">{expert.name}</h3>
                  <p className="text-sm text-muted-foreground">{expert.speciality}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      {expert.rating}
                    </div>
                    <span>{expert.sessions} sessions</span>
                  </div>
                </div>
                <Badge variant="outline">${expert.price}/session</Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-ifind-aqua hover:bg-ifind-aqua/90">
                  <Video className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};