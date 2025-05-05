
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UserFavoritesProps {
  user: UserProfile | null;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ user }) => {
  const { expertFavorites, programFavorites } = useFavorites();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Favorites</h2>
        <p className="text-muted-foreground">
          Experts and programs you've saved
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Favorite Experts</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {expertFavorites && expertFavorites.length > 0 ? (
              <div className="space-y-2">
                {expertFavorites.map((id) => (
                  <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>Expert ID: {id}</span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/experts')}
                >
                  View All Experts
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't added any experts to your favorites</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/experts')}
                >
                  Browse Experts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Favorite Programs</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {programFavorites && programFavorites.length > 0 ? (
              <div className="space-y-2">
                {programFavorites.map((id) => (
                  <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>Program ID: {id}</span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/programs-for-wellness-seekers')}
                >
                  View All Programs
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't added any programs to your favorites</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/programs-for-wellness-seekers')}
                >
                  Browse Programs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserFavorites;
