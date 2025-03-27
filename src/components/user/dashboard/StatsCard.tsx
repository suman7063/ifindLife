
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  className = ""
}) => {
  return (
    <Card className={`border-ifind-aqua/10 transition-all duration-300 hover:shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center">
          <Icon className="mr-2 h-4 w-4 text-ifind-aqua" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
