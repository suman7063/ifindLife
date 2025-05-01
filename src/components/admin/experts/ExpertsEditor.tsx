
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExpertCard from './expert-card';
import AddExpertForm from './form/AddExpertForm';
import { Expert } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

type ExpertsEditorProps = {
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  loading?: boolean;
  error?: string | null;
};

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ 
  experts, 
  setExperts, 
  loading = false,
  error = null
}) => {
  const handleRefresh = () => {
    // Force reload the page to refresh all data
    window.location.reload();
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Edit Experts</h2>
          <p className="text-muted-foreground">
            {experts.length} experts available
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Expert</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Expert</DialogTitle>
              </DialogHeader>
              <AddExpertForm 
                onAdd={(newExpert) => setExperts([...experts, newExpert])} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-4">
        {experts.length > 0 ? (
          experts.map((expert, index) => (
            <ExpertCard 
              key={index}
              expert={expert}
              index={index}
              experts={experts}
              setExperts={setExperts}
            />
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No experts available. Add an expert to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpertsEditor;
