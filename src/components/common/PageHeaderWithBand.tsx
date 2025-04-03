
import React, { ReactNode } from 'react';

interface PageHeaderWithBandProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const PageHeaderWithBand: React.FC<PageHeaderWithBandProps> = ({ 
  title, 
  subtitle,
  children 
}) => {
  return (
    <div className="bg-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
        {subtitle && (
          <p className="text-center mt-2 text-gray-600">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageHeaderWithBand;
