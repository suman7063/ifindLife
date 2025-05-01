
import React from 'react';

const AdminContentLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-ifind-teal"></div>
      <span className="ml-2">Loading content...</span>
    </div>
  );
};

export default AdminContentLoader;
