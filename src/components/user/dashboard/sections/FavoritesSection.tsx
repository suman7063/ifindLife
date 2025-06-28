
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Heart, BookOpen } from 'lucide-react';

const FavoritesSection = () => {
  const { userProfile } = useSimpleAuth();
  
  const favoriteExperts = userProfile?.favorite_experts || [];
  const favoritePrograms = userProfile?.favorite_programs || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Favorites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Experts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Experts</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{favoriteExperts.length}</div>
            {favoriteExperts.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No favorite experts yet. Browse experts to add some!
              </p>
            ) : (
              <div className="space-y-2">
                {favoriteExperts.slice(0, 3).map((expertId, index) => (
                  <div key={index} className="text-sm">
                    Expert ID: {expertId}
                  </div>
                ))}
                {favoriteExperts.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{favoriteExperts.length - 3} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Programs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{favoritePrograms.length}</div>
            {favoritePrograms.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No favorite programs yet. Browse programs to add some!
              </p>
            ) : (
              <div className="space-y-2">
                {favoritePrograms.slice(0, 3).map((programId, index) => (
                  <div key={index} className="text-sm">
                    Program ID: {programId}
                  </div>
                ))}
                {favoritePrograms.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{favoritePrograms.length - 3} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FavoritesSection;
