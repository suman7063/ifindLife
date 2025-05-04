
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FavoriteButtonProps {
  isFavorite: boolean;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  tooltipText?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  isLoading = false,
  onClick,
  className,
  size = 'md',
  showText = false,
  tooltipText
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90',
        isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          isFavorite ? 'fill-red-500' : ''
        )} 
      />
      <span className="sr-only">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
    </Button>
  );
  
  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default FavoriteButton;
