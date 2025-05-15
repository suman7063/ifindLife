
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

const FavoriteExperts: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [favoriteExperts, setFavoriteExperts] = useState<ExpertProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch favorite experts data
  useEffect(() => {
    const fetchExperts = async () => {
      if (!profile?.favorite_experts?.length) return;
      
      setIsLoading(true);
      try {
        // Convert favorite expert IDs to strings for the query
        const expertIds = profile.favorite_experts.map(id => String(id));
        
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .in('id', expertIds);
          
        if (error) throw error;
        
        setFavoriteExperts(data || []);
      } catch (error) {
        console.error('Error fetching favorite experts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperts();
  }, [profile?.favorite_experts]);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Favorite Experts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <p className="text-sm text-muted-foreground">Loading experts...</p>
          </div>
        ) : favoriteExperts.length > 0 ? (
          <div className="space-y-4">
            {favoriteExperts.map((expert) => (
              <div key={expert.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={expert.profile_picture} alt={expert.name} />
                    <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.specialization}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/expert/${expert.id}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">You haven't added any experts to favorites yet</p>
            <Button variant="outline" onClick={() => navigate('/experts')}>Browse Experts</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteExperts;
