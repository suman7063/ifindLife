
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { BlogPost } from '@/types/blog';

// Validation schema for the form
const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' }),
  category: z.string().min(2, { message: 'Category is required' }),
  date: z.string().min(2, { message: 'Date is required' }),
  imageUrl: z.string().url({ message: 'Must be a valid URL' }),
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters' }),
  author: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onSave: (post: BlogPost) => void;
}

const BlogPostDialog = ({ isOpen, onClose, post, onSave }: BlogPostDialogProps) => {
  const isEditing = !!post;
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: post?.id,
      title: post?.title || '',
      slug: post?.slug || '',
      category: post?.category || '',
      date: post?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      imageUrl: post?.imageUrl || '',
      summary: post?.summary || '',
      content: post?.content || '',
      author: post?.author || '',
    },
  });
  
  // Update form values when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        date: post.date,
        imageUrl: post.imageUrl,
        summary: post.summary,
        content: post.content,
        author: post.author,
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        category: '',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        imageUrl: '',
        summary: '',
        content: '',
        author: '',
      });
    }
  }, [post, form]);
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    onSave(values as BlogPost);
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Remove consecutive hyphens
      
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter blog post title" 
                      {...field} 
                      onBlur={() => {
                        if (!form.getValues('slug')) {
                          generateSlug();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Slug */}
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Slug</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input placeholder="enter-post-slug" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="ml-2"
                        onClick={generateSlug}
                      >
                        Generate
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mental Health" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Date and Author */}
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="June 15, 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Author (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the blog post" 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Full blog post content" 
                      rows={10}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostDialog;
