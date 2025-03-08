
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  description,
  href,
  color = 'bg-astro-light-purple/10'
}) => {
  return (
    <Link to={href}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-border/50 hover:border-astro-light-purple/50">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
