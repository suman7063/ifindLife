import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Program, ProgramType } from '@/types/programs';
import ProgramCard from '@/components/programs/ProgramCard';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { toast } from 'sonner';

const Programs = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState<Program[]>([
    // Sample wellness programs
    {
      id: 1,
      title: "Stress Management Mastery",
      description: "Learn powerful techniques to manage stress and anxiety in your daily life. This program combines cognitive strategies, mindfulness practices, and lifestyle adjustments.",
      programType: "wellness",
      category: "Stress Reduction",
      duration: "4 weeks",
      sessions: 8,
      price: 199.99,
      image: "/lovable-uploads/program-stress.jpg",
      enrollments: 248,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Mindfulness Meditation",
      description: "Develop a consistent meditation practice that helps you stay present and focused. Perfect for beginners wanting to reduce stress and improve mental clarity.",
      programType: "wellness",
      category: "Meditation",
      duration: "6 weeks",
      sessions: 12,
      price: 149.99,
      image: "/lovable-uploads/program-meditation.jpg",
      enrollments: 352,
      created_at: new Date().toISOString()
    },
    
    // Sample academic programs
    {
      id: 3,
      title: "Exam Anxiety Solution",
      description: "Practical techniques to overcome test anxiety and perform at your best. Designed specifically for students facing high-pressure academic situations.",
      programType: "academic",
      category: "Study Skills",
      duration: "3 weeks",
      sessions: 6,
      price: 99.99,
      image: "/lovable-uploads/program-exam.jpg",
      enrollments: 175,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Time Management for Students",
      description: "Master effective time management to balance academics, extracurriculars, and personal life. Learn to prioritize tasks and increase productivity.",
      programType: "academic",
      category: "Time Management",
      duration: "4 weeks",
      sessions: 8,
      price: 129.99,
      image: "/lovable-uploads/program-time.jpg",
      enrollments: 210,
      created_at: new Date().toISOString()
    },
    
    // Sample business programs
    {
      id: 5,
      title: "Leadership Wellness",
      description: "A comprehensive approach to sustainable leadership that prevents burnout and promotes long-term success. Designed for executives and team leaders.",
      programType: "business",
      category: "Leadership",
      duration: "8 weeks",
      sessions: 16,
      price: 399.99,
      image: "/lovable-uploads/program-leadership.jpg",
      enrollments: 124,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      title: "Team Resilience Building",
      description: "Strengthen your team's ability to adapt to challenges and thrive under pressure. Includes team exercises and individual resilience strategies.",
      programType: "business",
      category: "Team Building",
      duration: "6 weeks",
      sessions: 12,
      price: 349.99,
      image: "/lovable-uploads/program-team.jpg",
      enrollments: 97,
      created_at: new Date().toISOString()
    }
  ]);

  const { isAuthenticated } = useAuth();
  const { toggleProgramFavorite } = useFavorites();

  // Handle post-login actions
  useEffect(() => {
    const handlePendingActions = async () => {
      if (!isAuthenticated) return;
      
      const pendingAction = sessionStorage.getItem('pendingAction');
      const pendingProgramId = sessionStorage.getItem('pendingProgramId');
      
      if (pendingAction === 'favorite' && pendingProgramId) {
        try {
          // Execute the favorite action
          const programId = parseInt(pendingProgramId);
          await toggleProgramFavorite(programId);
          
          // Clear the pending action
          sessionStorage.removeItem('pendingAction');
          sessionStorage.removeItem('pendingProgramId');
        } catch (error) {
          console.error('Error executing pending favorite action:', error);
          toast.error('Failed to update favorites');
        }
      }
    };
    
    handlePendingActions();
  }, [isAuthenticated, toggleProgramFavorite]);

  const filteredPrograms = programs.filter(program => {
    // Filter by active tab (program type)
    if (activeTab !== 'all' && program.programType !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !program.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !program.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !program.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  useEffect(() => {
    // Reset search when changing tabs
    setSearchTerm('');
  }, [activeTab]);

  return (
    <Container className="py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mental Wellness Programs</h1>
          <p className="text-muted-foreground">
            Discover programs designed to help you achieve mental wellness and personal growth
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search programs..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <ProgramCard 
                key={program.id} 
                program={program} 
                currentUser={null} 
                isAuthenticated={false} 
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-xl font-medium">No programs found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveTab('all');
                  setSearchTerm('');
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPrograms.length} out of {programs.length} programs
          </p>
        </div>

        {/* Featured Program Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured Program</h2>
          
          <div className="bg-gradient-to-r from-ifind-aqua/10 to-ifind-lavender/10 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <img 
                  src={programs[0].image} 
                  alt={programs[0].title}
                  className="rounded-md w-full h-[250px] object-cover"
                />
              </div>
              <div className="lg:w-2/3 space-y-4">
                <span className="inline-flex items-center rounded-md bg-ifind-aqua/10 px-2 py-1 text-xs font-medium text-ifind-aqua ring-1 ring-inset ring-ifind-aqua/20">
                  {programs[0].category}
                </span>
                <h3 className="text-2xl font-bold">{programs[0].title}</h3>
                <p className="text-muted-foreground">{programs[0].description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Duration:</span> {programs[0].duration}
                  </div>
                  <div>
                    <span className="font-semibold">Sessions:</span> {programs[0].sessions}
                  </div>
                  <div>
                    <span className="font-semibold">Enrolled:</span> {programs[0].enrollments}+ students
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="bg-ifind-aqua hover:bg-ifind-teal">View Program Details</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Programs;
