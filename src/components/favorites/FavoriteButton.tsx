
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  isFavorite: boolean;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  tooltipText?: string;
  expertId?: number;
  expertName?: string;
  requireAuth?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  isLoading = false,
  onClick,
  className,
  size = 'md',
  showText = false,
  tooltipText,
  expertId,
  expertName,
  requireAuth = true
}) => {
  const { requireAuthForExpert, isAuthenticated } = useAuthRedirectSystem();

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check authentication if required
    if (requireAuth && expertId && expertName) {
      if (!requireAuthForExpert(expertId, expertName, 'favorite')) {
        return; // User will be redirected to login
      }
    }

    // Execute the original onClick if authenticated
    onClick(e);
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
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          isFavorite ? 'fill-red-500' : ''
        )} 
      />
      <span className="sr-only">
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </span>
      {showText && (
        <span className="ml-2 text-sm">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
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
