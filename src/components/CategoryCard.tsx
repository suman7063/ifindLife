
import React from 'react';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color?: string;
  textColor?: string;
  cardStyle?: 'program' | 'session';
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  description,
  href,
  color = 'bg-ifind-aqua/10',
  textColor = 'text-gray-800',
  cardStyle = 'program'
}) => {
  // Different styles for programs vs sessions
  const cardClasses = cardStyle === 'program'
    ? `${color} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full`
    : "bg-white/80 backdrop-filter backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 h-full";
  
  const iconClasses = cardStyle === 'program'
    ? `w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white/20`
    : `${color} w-12 h-12 rounded-full flex items-center justify-center mb-3`;

  const titleClasses = cardStyle === 'program'
    ? `font-semibold text-lg mb-2 ${textColor}`
    : 'font-semibold text-base mb-2 text-gray-800';

  const descriptionClasses = cardStyle === 'program'
    ? `text-sm ${textColor}/90`
    : 'text-sm text-gray-600';

  // Return a plain div instead of a Link to prevent navigation
  return (
    <div className={cardClasses}>
      <div className={iconClasses}>
        {icon}
      </div>
      <h3 className={titleClasses}>
        {title}
      </h3>
      <p className={descriptionClasses}>{description}</p>
    </div>
  );
};

export default CategoryCard;
