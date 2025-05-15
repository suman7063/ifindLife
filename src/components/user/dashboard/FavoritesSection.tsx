
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/types/supabase/user';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FavoritesSectionProps {
  user: UserProfile;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="experts">
          <TabsList className="mb-4">
            <TabsTrigger value="experts">Favorite Experts</TabsTrigger>
            <TabsTrigger value="programs">Favorite Programs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experts">
            {user.favorite_experts && user.favorite_experts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.favorite_experts.map(expertId => (
                  <Card key={expertId} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-sm">E</span>
                          </div>
                          <div>
                            <p className="font-medium">Expert {expertId}</p>
                            <p className="text-xs text-gray-500">Available</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/experts/${expertId}`)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p>You haven't added any experts to your favorites yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/experts')}
                  className="mt-2"
                >
                  Browse Experts
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="programs">
            {user.favorite_programs && user.favorite_programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.favorite_programs.map(programId => (
                  <Card key={programId} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-sm">P</span>
                          </div>
                          <div>
                            <p className="font-medium">Program {programId}</p>
                            <p className="text-xs text-gray-500">Wellness</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/programs/${programId}`)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p>You haven't added any programs to your favorites yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/programs')}
                  className="mt-2"
                >
                  Browse Programs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
