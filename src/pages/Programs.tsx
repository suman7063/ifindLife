
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgramList from '@/components/programs/ProgramList';
import ProgramFilters from '@/components/programs/ProgramFilters';
import TrendingPrograms from '@/components/programs/TrendingPrograms';
import { useUserAuth } from '@/hooks/user-auth';
import { supabase } from '@/lib/supabase';
import { Program, ProgramCategory } from '@/types/programs';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const { currentUser, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
      setFilteredPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterPrograms();
  }, [activeCategory, sortOption, programs]);

  const filterPrograms = () => {
    let result = [...programs];
    
    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(program => program.category === activeCategory);
    }
    
    // Sort programs
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
      case "newest":
      default:
        // Already sorted by created_at in the query
        break;
    }
    
    setFilteredPrograms(result);
  };

  const categoryOptions: { value: ProgramCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based Programs' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-ifind-charcoal text-white py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Mental Wellness Programs</h1>
          <p className="text-ifind-offwhite/80">Structured programs designed to support your mental health journey</p>
        </div>
      </div>
      
      <main className="flex-1 py-10">
        <div className="container mb-12">
          <TrendingPrograms programs={programs.filter(p => p.enrollments && p.enrollments > 0).sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0)).slice(0, 6)} />
        </div>
        
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProgramFilters 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
                categoryOptions={categoryOptions}
              />
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="all" onValueChange={setActiveCategory} className="mb-8">
                <TabsList className="mb-4">
                  {categoryOptions.map(category => (
                    <TabsTrigger key={category.value} value={category.value}>
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categoryOptions.map(category => (
                  <TabsContent key={category.value} value={category.value}>
                    <ProgramList 
                      programs={filteredPrograms} 
                      isLoading={isLoading}
                      currentUser={currentUser}
                      isAuthenticated={isAuthenticated}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
