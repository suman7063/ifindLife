
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AdminContentLoaderProps {
  message?: string;
  retryCount?: number;
}

const AdminContentLoader: React.FC<AdminContentLoaderProps> = ({ 
  message = "Loading admin content...",
  retryCount 
}) => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-24">
        <Loader2 className="h-12 w-12 text-ifind-aqua animate-spin mb-4" />
        <p className="text-gray-500 text-center mb-2">{message}</p>
        {retryCount !== undefined && retryCount > 0 && (
          <p className="text-xs text-gray-400">Retry attempt: {retryCount}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminContentLoader;
