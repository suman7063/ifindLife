
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

const FavoritesSection: React.FC = () => {
  const { userProfile } = useAuth();
  const currentUser = ensureUserProfileCompatibility(userProfile);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        {currentUser?.favoriteExperts && currentUser.favoriteExperts.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              You have {currentUser.favoriteExperts.length} favorite experts
            </p>
            {/* Favorite experts list would go here */}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You haven't added any experts to your favorites yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
