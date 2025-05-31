
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock } from 'lucide-react';

interface ProfileImageCardProps {
  expert: any;
  name: string;
  experienceYears: number;
}

const ProfileImageCard: React.FC<ProfileImageCardProps> = ({
  expert,
  name,
  experienceYears
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={expert?.profile_picture || expert?.image_url} alt={name} />
          <AvatarFallback className="text-2xl">
            {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'EX'}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg">{name}</h3>
          <Badge variant={expert?.status === 'approved' ? 'default' : 'secondary'}>
            {expert?.status === 'approved' ? 'Verified Expert' : expert?.status || 'Pending'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">4.8</span>
            </div>
            <p className="text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{experienceYears}+</span>
            </div>
            <p className="text-muted-foreground">Years Exp.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageCard;
