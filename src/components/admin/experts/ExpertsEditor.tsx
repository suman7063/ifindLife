
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddExpertForm from './form/AddExpertForm';
import ApprovedExpertsList from './ApprovedExpertsList';
import { Expert } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCw, Plus } from "lucide-react";

type ExpertsEditorProps = {
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ 
  experts, 
  setExperts, 
  loading = false,
  error = null,
  onRefresh
}) => {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleEditExpert = (expert: Expert) => {
    setSelectedExpert(expert);
  };

  const handleViewDetails = (expert: Expert) => {
    // For now, just log the expert details
    console.warn('View expert details:', expert);
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-24">
          <Loader2 className="h-12 w-12 text-ifind-aqua animate-spin mb-4" />
          <p className="text-gray-500">Loading experts data...</p>
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
          <Button onClick={handleRefresh} variant="outline" className="mt-6">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Experts Management</h2>
          <p className="text-muted-foreground">
            Manage approved experts and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add New Expert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Expert</DialogTitle>
              </DialogHeader>
              <AddExpertForm 
                onAdd={(newExpert) => {
                  setExperts([...experts, newExpert]);
                  setShowAddDialog(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <ApprovedExpertsList 
        experts={experts}
        onEditExpert={handleEditExpert}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default ExpertsEditor;
