
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneIcon, CalendarIcon, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExpertActionProps } from './types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const ExpertActions: React.FC<ExpertActionProps> = ({ 
  id, 
  online, 
  isFavorite,
  onFavoriteToggle,
  onCallNow,
  onBookAppointment
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleCallNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Store pending action in sessionStorage
      sessionStorage.setItem('pendingAction', JSON.stringify({
        type: 'call',
        id,
        path: window.location.pathname,
        scrollPosition: window.scrollY
      }));
      
      toast.info("Please log in to call this expert");
      navigate('/user-login');
      return;
    }
    
    if (onCallNow) {
      onCallNow(id);
    } else {
      navigate(`/experts/${id}?call=true`);
    }
  };
  
  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Store pending action in sessionStorage
      sessionStorage.setItem('pendingAction', JSON.stringify({
        type: 'book',
        id,
        path: window.location.pathname,
        scrollPosition: window.scrollY
      }));
      
      toast.info("Please log in to book an appointment");
      navigate('/user-login');
      return;
    }
    
    if (onBookAppointment) {
      onBookAppointment(id);
    } else {
      navigate(`/experts/${id}?book=true`);
    }
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Store pending action in sessionStorage
      sessionStorage.setItem('pendingAction', JSON.stringify({
        type: 'favorite',
        id,
        path: window.location.pathname,
        scrollPosition: window.scrollY
      }));
      
      toast.info("Please log in to add favorites");
      navigate('/user-login');
      return;
    }
    
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          size="sm" 
          className="w-full flex items-center justify-center text-xs"
          onClick={handleCallNow}
          disabled={!online}
        >
          <PhoneIcon className="h-3 w-3 mr-1" />
          Call Now
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          className="w-full flex items-center justify-center text-xs"
          onClick={handleBookAppointment}
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          Book
        </Button>
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleFavoriteToggle}
        className="w-full flex items-center justify-center"
      >
        <Heart 
          className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
        />
        {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </Button>
    </div>
  );
};

export default ExpertActions;
