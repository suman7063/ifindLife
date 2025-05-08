
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface ServicesEmptyStateProps {
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onReset: () => void;
}

const ServicesEmptyState: React.FC<ServicesEmptyStateProps> = ({ 
  loading, 
  error, 
  isRefreshing,
  onRefresh,
  onReset
}) => {
  if (loading || isRefreshing) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-24">
          <Loader2 className="h-12 w-12 text-ifind-aqua animate-spin mb-4" />
          <p className="text-gray-500">Loading services data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-24">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
            <Button onClick={onReset}>Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default ServicesEmptyState;
