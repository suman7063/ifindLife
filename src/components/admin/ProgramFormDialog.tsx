
import React from 'react';
import { Program, ProgramCategory, ProgramType } from '@/types/programs';
import { 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface ProgramFormDialogProps {
  program?: Program;
  onSave: (programData: Partial<Program>) => Promise<void>;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  sessions: z.coerce.number().min(1, "Must have at least 1 session"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  image: z.string().url("Must be a valid URL"),
  category: z.enum(['quick-ease', 'resilience-building', 'super-human', 'issue-based'] as const),
  programType: z.enum(['wellness', 'academic', 'business'] as const)
});

const ProgramFormDialog: React.FC<ProgramFormDialogProps> = ({ 
  program, 
  onSave 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: program ? {
      title: program.title,
      description: program.description,
      duration: program.duration,
      sessions: program.sessions,
      price: program.price,
      image: program.image,
      category: program.category as ProgramCategory,
      programType: program.programType as ProgramType
    } : {
      title: "",
      description: "",
      duration: "",
      sessions: 1,
      price: 0,
      image: "",
      category: 'quick-ease' as ProgramCategory,
      programType: 'wellness' as ProgramType
    }
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Add program ID if editing
    const programData = program?.id ? { ...values, id: program.id } : values;
    await onSave(programData);
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{program ? 'Edit Program' : 'Add New Program'}</DialogTitle>
        <DialogDescription>
          {program 
            ? 'Update program details. This will be visible to all users.'
            : 'Create a new mental wellness program for users to enroll in.'
          }
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter program title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter program description" 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 6 weeks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sessions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="e.g. 12" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      placeholder="e.g. 4999" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="programType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wellness">Wellness Programs</SelectItem>
                      <SelectItem value="academic">Academic Institute Programs</SelectItem>
                      <SelectItem value="business">Business Programs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quick-ease">QuickEase</SelectItem>
                    <SelectItem value="resilience-building">Resilience Building</SelectItem>
                    <SelectItem value="super-human">Super Human</SelectItem>
                    <SelectItem value="issue-based">Issue-Based Programs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {program ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                program ? 'Update Program' : 'Create Program'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ProgramFormDialog;
