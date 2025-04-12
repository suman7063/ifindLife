
import React from 'react';

interface EmptyStateProps {
  selectedCategory: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  selectedCategory,
  message
}) => {
  const defaultMessage = selectedCategory === 'favorites' 
    ? "You haven't saved any programs to your favorites yet."
    : "No programs available in this category.";

  return (
    <div className="col-span-full py-12 text-center text-muted-foreground">
      {message || defaultMessage}
    </div>
  );
};

export default EmptyState;
