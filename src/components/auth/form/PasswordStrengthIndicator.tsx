
import React, { useMemo } from 'react';
import { validatePasswordStrength } from '@/utils/validationSchemas';
import { PasswordStrengthIndicatorProps } from './types';

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback } = useMemo(() => validatePasswordStrength(password), [password]);
  
  const strengthClasses = [
    'h-2 rounded transition-all duration-300',
  ];
  
  const strengthColors = [
    'bg-red-500',     // Very Weak
    'bg-orange-500',  // Weak
    'bg-yellow-500',  // Medium
    'bg-blue-500',    // Strong
    'bg-green-500',   // Very Strong
  ];
  
  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Medium',
    'Strong',
    'Very Strong',
  ];
  
  const selectedColor = strengthColors[Math.min(score, 4)];
  const selectedLabel = strengthLabels[Math.min(score, 4)];
  const width = `${Math.max(5, Math.min(100, score * 20))}%`;

  return (
    <div className="space-y-1 w-full">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div 
          className={`${strengthClasses.join(' ')} ${selectedColor}`} 
          style={{ width }} 
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className={`font-medium ${score > 0 ? `text-${selectedColor.replace('bg-', '')}` : 'text-gray-500'}`}>
          {password ? selectedLabel : 'Enter password'}
        </span>
        <span className="text-gray-500">{password ? feedback : ''}</span>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
