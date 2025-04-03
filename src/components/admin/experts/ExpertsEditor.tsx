
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExpertCard from './ExpertCard';
import AddExpertForm from './AddExpertForm';
import { Expert } from './types';

type ExpertsEditorProps = {
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
};

const ExpertsEditor: React.FC<ExpertsEditorProps> = ({ experts, setExperts }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Experts</h2>
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
      
      <div className="space-y-4">
        {experts.map((expert, index) => (
          <ExpertCard 
            key={index}
            expert={expert}
            index={index}
            experts={experts}
            setExperts={setExperts}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpertsEditor;
