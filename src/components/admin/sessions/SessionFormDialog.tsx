
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, MessageCircle, Heart, Briefcase, Lightbulb, Megaphone } from 'lucide-react';
import { Session } from './types';
import { colorOptions, iconOptions } from './sessionIcons';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  href: z.string().min(1, "URL path is required"),
  color: z.string().min(1, "Background color is required"),
  icon: z.string().min(1, "Icon is required")
});

interface SessionFormDialogProps {
  session?: Session | null;
  onSave: (sessionData: Omit<Session, 'id'>) => void;
  onClose: () => void;
}

const SessionFormDialog: React.FC<SessionFormDialogProps> = ({ 
  session, 
  onSave,
  onClose
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: session ? {
      title: session.title,
      description: session.description,
      href: session.href,
      color: session.color,
      icon: session.icon
    } : {
      title: "",
      description: "",
      href: "/",
      color: "bg-blue-100",
      icon: "Brain"
    }
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
  );
};

export default SessionFormDialog;
