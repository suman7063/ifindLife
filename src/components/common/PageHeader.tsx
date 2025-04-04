
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gray-100 text-gray-800 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 font-poppins">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 font-normal max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
