
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color?: string;
  cardStyle?: 'program' | 'session';
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  description,
  href,
  color = 'bg-ifind-aqua/10',
  cardStyle = 'program'
}) => {
  // Different styles for programs vs sessions
  const cardClasses = cardStyle === 'program'
    ? "bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 p-6 h-full"
    : "bg-white/80 backdrop-filter backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 h-full";
  
  const iconClasses = cardStyle === 'program'
    ? `${color} w-16 h-16 rounded-full flex items-center justify-center mb-4`
    : `${color} w-12 h-12 rounded-full flex items-center justify-center mb-3`;

  return (
    <Link to={href}>
      <div className={cardClasses}>
        <div className={iconClasses}>
          {icon}
        </div>
        <h3 className={`font-semibold ${cardStyle === 'program' ? 'text-lg' : 'text-base'} mb-2`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
