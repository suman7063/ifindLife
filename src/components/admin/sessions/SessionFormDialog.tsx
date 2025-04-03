
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Session, SessionFormDialogProps } from './types';
import { iconOptions, colorOptions } from './sessionIcons';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  icon: z.string({
    required_error: "Please select an icon.",
  }),
  color: z.string({
    required_error: "Please select a color.",
  }),
  href: z.string().min(1, {
    message: "URL path is required.",
  }).startsWith("/", {
    message: "URL path must start with a forward slash (/)."
  })
});

const SessionFormDialog: React.FC<SessionFormDialogProps> = ({ 
  session, 
  onSave,
  open,
  onOpenChange
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session?.title || "",
      description: session?.description || "",
      icon: session?.icon || "brain",
      color: session?.color || "bg-blue-100",
      href: session?.href || "/",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      title: values.title,
      description: values.description,
      icon: values.icon,
      color: values.color,
      href: values.href,
    });
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorOptions.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 rounded-full ${option.value}`}></div>
                        <span>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {iconOptions.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="flex items-center gap-2"
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Path</FormLabel>
              <FormControl>
                <Input {...field} placeholder="/path-name" />
              </FormControl>
              <FormDescription>
                The URL path for this session (e.g. /anxiety-depression)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4 space-x-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionFormDialog;
