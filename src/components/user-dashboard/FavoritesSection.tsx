
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FavoritesSectionProps {
  user?: any;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          You haven't added any experts to your favorites yet.
        </p>
        {/* Favorites listings would go here */}
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
