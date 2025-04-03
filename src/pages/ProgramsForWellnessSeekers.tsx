
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Program } from '@/types/programs';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/hooks/useUserAuth';
import { categoryOptions } from '@/hooks/useProgramData';
import PageHeader from '@/components/common/PageHeader';
import ProgramFilters from '@/components/programs/ProgramFilters';
import ProgramCategories from '@/components/programs/ProgramCategories';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import { Loader2 } from 'lucide-react';

const ProgramsForWellnessSeekers: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const { currentUser, isAuthenticated } = useUserAuth();

  // Fetch wellness programs on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        
        // Ensure sample wellness programs exist
        await addSamplePrograms('wellness');
        
        // Fetch all wellness programs
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'wellness');
          
        if (error) {
          console.error('Error fetching wellness programs:', error);
          return;
        }
        
        if (data) {
          // Convert data to Program type
          const programData: Program[] = data.map(program => ({
            id: program.id,
            title: program.title,
            description: program.description,
            duration: program.duration,
            sessions: program.sessions,
            price: program.price,
            image: program.image,
            category: program.category as Program['category'],
            programType: program.programType as Program['programType'],
            enrollments: program.enrollments || 0,
            created_at: program.created_at
          }));
          
          // Sort by popularity (enrollments) by default
          const sortedPrograms = [...programData].sort((a, b) => 
            (b.enrollments || 0) - (a.enrollments || 0)
          );
          
          setPrograms(sortedPrograms);
          setFilteredPrograms(sortedPrograms);
        }
      } catch (error) {
        console.error('Error in wellness programs fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);

  // Apply filters when criteria change
  useEffect(() => {
    if (programs.length === 0) return;
    
    // Apply category filter
    let categoryFiltered = programs;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        categoryFiltered = programs.filter(program => program.is_favorite);
      } else {
        categoryFiltered = programs.filter(program => program.category === selectedCategory);
      }
    }
    
    // Apply sorting
    const sorted = [...categoryFiltered];
    
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        sorted.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
    }
    
    setFilteredPrograms(sorted);
  }, [selectedCategory, programs, sortOption]);

  // Group programs by category 
  const programsByCategory = () => {
    const categories: Record<string, Program[]> = {
      'quick-ease': [],
      'resilience-building': [],
      'super-human': [],
      'issue-based': []
    };
    
    programs.forEach(program => {
      if (program.category in categories) {
        categories[program.category].push(program);
      }
    });
    
    return categories;
  };

  return (
    <>
      <Navbar />
      <PageHeader 
        title="Programs For Wellness Seekers" 
        subtitle="Discover mental wellness programs designed to support your personal growth and wellbeing"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-ifind-purple">
            Personalized Mental Wellness Programs
          </h2>
          <p className="text-gray-700">
            Our wellness programs are designed to support individuals on their mental health journey.
            Choose from a variety of evidence-based programs tailored to address specific needs and goals.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium text-gray-600">No programs available</h3>
            <p className="text-gray-500 mt-2">Please check back later for new programs.</p>
          </div>
        ) : (
          <>
            {selectedCategory === 'all' ? (
              <div className="space-y-10">
                <ProgramCategories 
                  programsByCategory={programsByCategory()}
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            ) : (
              <>
                <ProgramFilters 
                  activeCategory={selectedCategory}
                  setActiveCategory={setSelectedCategory}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  categoryOptions={categoryOptions}
                />
                
                <div className="mt-8">
                  <FilteredProgramsGrid 
                    filteredPrograms={filteredPrograms}
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForWellnessSeekers;
