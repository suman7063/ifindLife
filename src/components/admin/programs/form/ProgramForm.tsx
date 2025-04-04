
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Program } from '@/types/programs';
import { programFormSchema, prepareProgramData, getProgramFormDefaults } from '../formUtils';
import BasicInfoFields from './BasicInfoFields';
import DurationFields from './DurationFields';
import PriceTypeFields from './PriceTypeFields';
import CategoryImageFields from './CategoryImageFields';
import ProgramFormActions from './ProgramFormActions';

interface ProgramFormProps {
  program: Program | null;
  onSave: (programData: Program) => Promise<void>;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ program, onSave }) => {
  const isEditMode = !!program?.id;
  
  const form = useForm({
    resolver: zodResolver(programFormSchema),
    defaultValues: getProgramFormDefaults(program)
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (values: any) => {
    const programData = prepareProgramData(values, program?.id);
    await onSave(programData);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit Program' : 'Add New Program'}</DialogTitle>
        <DialogDescription>
          {isEditMode 
            ? 'Update program details. This will be visible to all users.'
            : 'Create a new mental wellness program for users to enroll in.'
          }
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <BasicInfoFields form={form} />
          <DurationFields form={form} />
          <PriceTypeFields form={form} />
          <CategoryImageFields form={form} />
          <ProgramFormActions 
            isSubmitting={isSubmitting} 
            isEditMode={isEditMode} 
          />
        </form>
      </Form>
    </>
  );
};

export default ProgramForm;
