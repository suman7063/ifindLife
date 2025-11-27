import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Video, Phone, Calendar, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

// Mock data for demo purposes
const MOCK_FAVORITE_EXPERTS = [
  {
    id: '1',
    name: 'Dr. Ananya Sharma',
    image: 'https://i.pravatar.cc/150?img=1',
    specialization: 'Clinical Psychologist',
    experience: '15 years',
    rating: 4.9,
    reviewsCount: 248,
    location: 'Mumbai, India',
    languages: ['English', 'Hindi', 'Marathi'],
    nextAvailable: '2024-01-28',
    category: 'Mental Health',
    verified: true
  },
  {
    id: '2',
    name: 'Ms. Priya Menon',
    image: 'https://i.pravatar.cc/150?img=5',
    specialization: 'Life Coach',
    experience: '8 years',
    rating: 4.8,
    reviewsCount: 156,
    location: 'Bangalore, India',
    languages: ['English', 'Tamil', 'Malayalam'],
    nextAvailable: '2024-01-29',
    category: 'Life Coaching',
    verified: true
  },
  {
    id: '3',
    name: 'Dr. Rajesh Kumar',
    image: 'https://i.pravatar.cc/150?img=12',
    specialization: 'Career Counselor',
    experience: '12 years',
    rating: 4.7,
    reviewsCount: 192,
    location: 'Delhi, India',
    languages: ['English', 'Hindi', 'Punjabi'],
    nextAvailable: '2024-01-30',
    category: 'Career Guidance',
    verified: true
  },
  {
    id: '4',
    name: 'Ms. Deepa Patel',
    image: 'https://i.pravatar.cc/150?img=9',
    specialization: 'Relationship Expert',
    experience: '10 years',
    rating: 4.9,
    reviewsCount: 215,
    location: 'Ahmedabad, India',
    languages: ['English', 'Hindi', 'Gujarati'],
    nextAvailable: '2024-01-27',
    category: 'Relationship Counseling',
    verified: true
  }
];

export const FavoriteExpertsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(MOCK_FAVORITE_EXPERTS);

  const handleRemoveFavorite = (expertId: string) => {
    setFavorites(prev => prev.filter(expert => expert.id !== expertId));
  };

  const handleBookSession = (expertId: string) => {
    navigate(`/mobile-app/app/experts/${expertId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col bg-background p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorite Experts</h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} expert{favorites.length !== 1 ? 's' : ''} in your favorites
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((expert) => (
            <Card key={expert.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.image} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{expert.name}</h3>
                      {expert.verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(expert.rating)}
                      <span className="text-xs text-muted-foreground ml-1">
                        {expert.rating} ({expert.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(expert.id)}
                  className="p-1 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{expert.location}</span>
                  <span className="text-xs">•</span>
                  <span>{expert.experience} experience</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {expert.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next available: {formatDate(expert.nextAvailable)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleBookSession(expert.id)}
                >
                  <Video className="h-4 w-4" />
                  Video Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleBookSession(expert.id)}
                >
                  <Phone className="h-4 w-4" />
                  Audio Call
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-ifind-aqua hover:bg-ifind-teal text-white"
                  onClick={() => handleBookSession(expert.id)}
                >
                  Book
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Heart className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm mb-2">No favorite experts yet</p>
          <p className="text-xs">Add experts to your favorites to quickly book sessions</p>
          <Button
            className="mt-4 bg-ifind-aqua hover:bg-ifind-teal text-white"
            onClick={() => navigate('/mobile-app/app/experts')}
          >
            Browse Experts
          </Button>
        </div>
      )}
    </div>
  );
};
