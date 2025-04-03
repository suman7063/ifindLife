
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Brain, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';

// Define the type for a session
type Session = {
  id: number;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: string;
  created_at?: string;
};

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  href: z.string().min(1, "URL path is required"),
  color: z.string().min(1, "Background color is required"),
  icon: z.string().min(1, "Icon is required")
});

const SessionsEditor = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch sessions from localStorage or initialize with defaults
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      let fetchedSessions: Session[] = [];
      
      // Try to fetch from localStorage first
      const storedSessions = localStorage.getItem('ifindlife-sessions');
      if (storedSessions) {
        fetchedSessions = JSON.parse(storedSessions);
        console.log('Sessions fetched from localStorage:', fetchedSessions.length);
      } else {
        // Initialize with default sessions if none found
        fetchedSessions = [
          {
            id: 1,
            title: "Anxiety & Depression",
            description: "Get help managing anxiety, depression, and stress from licensed therapists.",
            href: "/anxiety-depression",
            color: "bg-blue-100",
            icon: "Brain"
          },
          {
            id: 2,
            title: "Relationship Counseling",
            description: "Improve communication and resolve conflicts in all types of relationships.",
            href: "/relationship-counseling",
            color: "bg-red-100",
            icon: "Heart"
          },
          {
            id: 3,
            title: "Career Guidance",
            description: "Navigate work stress, career transitions, and professional development.",
            href: "/career-guidance",
            color: "bg-yellow-100",
            icon: "Lightbulb"
          }
        ];
        
        // Save defaults to localStorage
        localStorage.setItem('ifindlife-sessions', JSON.stringify(fetchedSessions));
      }
      
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open for creating/editing a session
  const handleOpenDialog = (session?: Session) => {
    if (session) {
      console.log('Opening dialog for edit with session:', session);
      setSelectedSession(session);
    } else {
      console.log('Opening dialog for new session');
      setSelectedSession(null);
    }
    setIsDialogOpen(true);
  };

  // Save a new or updated session
  const handleSaveSession = (sessionData: Omit<Session, 'id'>) => {
    try {
      let savedSession: Session;
      
      if (selectedSession?.id) {
        // Update existing session
        savedSession = { ...sessionData, id: selectedSession.id };
        
        // Update in localStorage
        const updatedSessions = sessions.map(s => 
          s.id === selectedSession.id ? savedSession : s
        );
        localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        toast.success('Session updated successfully');
      } else {
        // Create new session with new ID
        const newId = sessions.length > 0 
          ? Math.max(...sessions.map(s => s.id)) + 1 
          : 1;
        
        savedSession = { ...sessionData, id: newId };
        
        // Save to localStorage
        const updatedSessions = [...sessions, savedSession];
        localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        toast.success('Session created successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };

  // Delete a session
  const handleDeleteSession = (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      // Remove from localStorage
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem('ifindlife-sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  // Render icon based on string name
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Brain':
        return <Brain className="h-6 w-6 text-ifind-aqua" />;
      case 'MessageCircle':
        return <MessageCircle className="h-6 w-6 text-ifind-aqua" />;
      default:
        return <Brain className="h-6 w-6 text-ifind-aqua" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Issue-Based Sessions Manager</h2>
          <p className="text-muted-foreground">Manage all issue-based sessions displayed on the homepage</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Session
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {sessions.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">No sessions found</p>
              <Button onClick={() => handleOpenDialog()} variant="outline">Add Your First Session</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 ${session.color} rounded-full flex items-center justify-center`}>
                          {renderIcon(session.icon)}
                        </div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-3 mb-3">{session.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {session.href}
                    </Badge>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between bg-gray-50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(session)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Session Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession ? 'Edit Session' : 'Add New Session'}</DialogTitle>
          </DialogHeader>
          <SessionFormDialog 
            session={selectedSession}
            onSave={handleSaveSession}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Session Form Dialog Component
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

  const colorOptions = [
    { name: "Blue", value: "bg-blue-100" },
    { name: "Red", value: "bg-red-100" },
    { name: "Yellow", value: "bg-yellow-100" },
    { name: "Green", value: "bg-green-100" },
    { name: "Purple", value: "bg-purple-100" },
    { name: "Orange", value: "bg-orange-100" }
  ];

  const iconOptions = [
    { name: "Brain", value: "Brain" },
    { name: "MessageCircle", value: "MessageCircle" }
  ];
  
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
              <div className="grid grid-cols-2 gap-2">
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
                    {icon.value === 'Brain' ? (
                      <Brain className="h-5 w-5 mr-2" />
                    ) : (
                      <MessageCircle className="h-5 w-5 mr-2" />
                    )}
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

export default SessionsEditor;
