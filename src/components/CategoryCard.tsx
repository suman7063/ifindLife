
import React from 'react';
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
  color = 'bg-ifind-aqua/10'
}) => {
  return (
    <Link to={href}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 h-full">
        <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
