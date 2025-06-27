
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

interface Props {
  categories?: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  user?: UserProfile | any;
  currentUser?: UserProfile | any;
  isAuthenticated?: boolean;
  programsByCategory?: Record<string, any[]>;
  [key: string]: any;
}

const ProgramCategories: React.FC<Props> = ({
  categories = [],
  selectedCategory = 'all',
  onCategorySelect = () => {},
  user,
  currentUser,
  isAuthenticated = false,
  programsByCategory = {},
  ...otherProps
}) => {
  // Adapt user profile to ensure consistent structure
  const adaptedUser = (user || currentUser) ? adaptUserProfile(user || currentUser) : null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategorySelect('all')}
        className="mb-2"
      >
        All Categories
        {adaptedUser && (
          <Badge variant="secondary" className="ml-2">
            {adaptedUser.favorite_programs?.length || 0}
          </Badge>
        )}
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategorySelect(category)}
          className="mb-2 capitalize"
        >
          {category.replace('_', ' ')}
        </Button>
      ))}
    </div>
  );
};

export default ProgramCategories;
