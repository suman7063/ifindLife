
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  passwordStrength 
}) => {
  // Determine password strength color and label
  const getPasswordStrengthInfo = () => {
    if (passwordStrength === 0) return { color: "bg-gray-200", label: "Password strength" };
    if (passwordStrength < 3) return { color: "bg-red-500", label: "Weak" };
    if (passwordStrength < 5) return { color: "bg-yellow-500", label: "Medium" };
    return { color: "bg-green-500", label: "Strong" };
  };

  const passwordStrengthInfo = getPasswordStrengthInfo();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{passwordStrengthInfo.label}</span>
        <span className="text-xs text-muted-foreground">{passwordStrength}/5</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${passwordStrengthInfo.color} transition-all duration-300`} 
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
        ></div>
      </div>
      
      <ul className="text-xs space-y-1 text-muted-foreground">
        <li className="flex items-center">
          {/[A-Z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
          }
          One uppercase letter
        </li>
        <li className="flex items-center">
          {/[a-z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
          }
          One lowercase letter
        </li>
        <li className="flex items-center">
          {/[0-9]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
          }
          One number
        </li>
        <li className="flex items-center">
          {/[^A-Za-z0-9]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
          }
          One special character
        </li>
        <li className="flex items-center">
          {password.length >= 8 ? 
            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
          }
          Minimum 8 characters
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
