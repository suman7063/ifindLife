
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, X, Award, MapPin, Clock, Video, Phone, Calendar } from 'lucide-react';
import { ExpertCardData } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import IntegratedBookingSystem from '../booking/IntegratedBookingSystem';

interface ExpertDetailModalProps {
  expert: ExpertCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onConnectNow?: (type: 'video' | 'voice') => void;
  onBookNow?: () => void;
}

const ExpertDetailModal: React.FC<ExpertDetailModalProps> = ({
  expert,
  isOpen,
  onClose,
  onConnectNow,
  onBookNow
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  const [showBookingSystem, setShowBookingSystem] = useState(false);

  if (!expert) return null;

  const expertName = expert.name || 'Unnamed Expert';
  const avatarUrl = expert.profilePicture || '';
  const specialization = expert.specialization || 'General';
  const rating = expert.averageRating || 0;
  const reviewCount = expert.reviewsCount || 0;
  const status = expert.status || 'offline';
  const experience = expert.experience || 0;
  const price = expert.price || 0;
  const waitTime = expert.waitTime || 'Unknown';

  // Mock qualifications and expertise for demonstration
  const qualifications = [
    'Ph.D. in Clinical Psychology',
    'Licensed Clinical Psychologist',
    'Certified Cognitive Behavioral Therapist'
  ];

  const expertiseAreas = [
    'Anxiety Disorders',
    'Depression',
    'Stress Management',
    'Relationship Issues',
    'Trauma Therapy'
  ];

  // Mock reviews
  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: "Dr. Johnson is incredibly helpful and understanding. The sessions have made a real difference.",
      author: "Sarah M.",
      date: "2 weeks ago"
    },
    {
      id: 2,
      rating: 5,
      comment: "Professional and caring approach. Highly recommend for anyone dealing with anxiety.",
      author: "Michael R.",
      date: "1 month ago"
    },
    {
      id: 3,
      rating: 4,
      comment: "Great experience overall. Very knowledgeable and patient.",
      author: "Lisa K.",
      date: "1 month ago"
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleConnectNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to connect with experts');
      navigate('/user-login');
      return;
    }

    if (status !== 'online') {
      toast.error('Expert is currently offline');
      return;
    }

    setShowConnectOptions(true);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book sessions');
      navigate('/user-login');
      return;
    }
    
    // Navigate to expert's booking page with booking tab active
    const expertUrl = `/experts/${expert.auth_id}?book=true`;
    window.location.href = expertUrl;
    
    // Close the modal since we're navigating away
    onClose();
  };

  const handleConnectOption = (type: 'video' | 'voice') => {
    if (onConnectNow) {
      onConnectNow(type);
    }
    setShowConnectOptions(false);
  };

  if (showBookingSystem) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Book with {expertName}</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingSystem(false)}
                  className="h-8"
                >
                  Back to Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <IntegratedBookingSystem
            expert={{
              id: expert.auth_id,
              name: expertName,
              profile_picture: expert.profilePicture,
              specialization: expert.specialization,
              price: expert.price
            }}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Expert Profile</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Expert Header */}
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={avatarUrl} alt={expertName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(expertName)}
                  </AvatarFallback>
                </Avatar>
                <span 
                  className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-background 
                    ${status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{expertName}</h2>
                </div>

                <p className="text-lg text-muted-foreground mb-3">{specialization}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{experience} years experience</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status === 'online' ? 'Available Now' : 'Currently Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
              <div className="space-y-2">
                {qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">{qualification}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise Areas */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Session Price</h3>
                  <p className="text-sm text-muted-foreground">Per session</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">${price}</span>
                  <p className="text-sm text-muted-foreground">{waitTime}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-sm">{review.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="border-t p-6">
          {showConnectOptions ? (
            <div className="flex gap-3">
              <Button
                variant="default"
                className="flex-1 flex items-center gap-2"
                onClick={() => handleConnectOption('video')}
              >
                <Video className="h-4 w-4" />
                Video Call
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={() => handleConnectOption('voice')}
              >
                <Phone className="h-4 w-4" />
                Voice Call
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowConnectOptions(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant={status === 'online' ? 'default' : 'secondary'}
                className="flex-1"
                onClick={handleConnectNow}
                disabled={status !== 'online'}
              >
                Connect Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={handleBookNow}
              >
                <Calendar className="h-4 w-4" />
                Book Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailModal;
