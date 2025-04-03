import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Session, SessionFormDialogProps } from './types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  href: z.string().min(1, 'URL path is required'),
});

type FormValues = z.infer<typeof formSchema>;

const SessionFormDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  session 
}: SessionFormDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session?.title || '',
      description: session?.description || '',
      icon: session?.icon || '',
      color: session?.color || '',
      href: session?.href || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      description: values.description,
      icon: values.icon,
      color: values.color,
      href: values.href,
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {session ? 'Update Session' : 'Create Session'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter session title" {...field} />
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
                      placeholder="Enter session description" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Path</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. /anxiety-depression" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.value}
                        type="button"
                        className={`${color.value} text-black border hover:${color.value} ${
                          field.value === color.value ? 'ring-2 ring-ifind-aqua' : ''
                        }`}
                        onClick={() => form.setValue('color', color.value)}
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((icon) => (
                      <Button
                        key={icon.value}
                        type="button"
                        variant="outline"
                        className={`flex items-center justify-center ${
                          field.value === icon.value ? 'ring-2 ring-ifind-aqua' : ''
                        }`}
                        onClick={() => form.setValue('icon', icon.value)}
                      >
                        {icon.value === 'Brain' && <Brain className="h-5 w-5 mr-2" />}
                        {icon.value === 'MessageCircle' && <MessageCircle className="h-5 w-5 mr-2" />}
                        {icon.value === 'Heart' && <Heart className="h-5 w-5 mr-2" />}
                        {icon.value === 'Briefcase' && <Briefcase className="h-5 w-5 mr-2" />}
                        {icon.value === 'Lightbulb' && <Lightbulb className="h-5 w-5 mr-2" />}
                        {icon.value === 'Megaphone' && <Megaphone className="h-5 w-5 mr-2" />}
                        {icon.name}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-ifind-aqua hover:bg-ifind-teal">
                {session ? 'Update Session' : 'Create Session'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionFormDialog;
