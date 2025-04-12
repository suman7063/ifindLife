import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Program, ProgramCategory } from '@/types/programs';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/hooks/useUserAuth';
import { categoryOptions } from '@/hooks/useProgramData';
import PageHeader from '@/components/common/PageHeader';
import ProgramFilters from '@/components/programs/ProgramFilters';
import ProgramCategories from '@/components/programs/ProgramCategories';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import CategoryButtons from '@/components/programs/filters/CategoryButtons';
import { Loader2 } from 'lucide-react';

const ProgramsForWellnessSeekers: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const { currentUser, isAuthenticated } = useUserAuth();

  // Define all possible category options with explicit typing
  const allCategoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[] = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based' },
    { value: 'favorites', label: 'My Favorites' }
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching wellness programs...');
        
        await addSamplePrograms('wellness');
        
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'wellness');
          
        if (error) {
          console.error('Error fetching wellness programs:', error);
          return;
        }
        
        console.log('Wellness programs fetched:', data);
        
        if (data) {
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
          
          const sortedPrograms = [...programData].sort((a, b) => 
            (b.enrollments || 0) - (a.enrollments || 0)
          );
          
          const categoryCounts = {
            'quick-ease': sortedPrograms.filter(p => p.category === 'quick-ease').length,
            'resilience-building': sortedPrograms.filter(p => p.category === 'resilience-building').length,
            'super-human': sortedPrograms.filter(p => p.category === 'super-human').length,
            'issue-based': sortedPrograms.filter(p => p.category === 'issue-based').length
          };
          
          console.log('Programs by category count:', categoryCounts);
          console.log('Setting wellness programs to state:', sortedPrograms);
          
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

  useEffect(() => {
    if (programs.length === 0) return;
    
    console.log('Applying filters. Category:', selectedCategory, 'Sort option:', sortOption);
    
    let categoryFiltered = programs;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        categoryFiltered = programs.filter(program => program.is_favorite);
      } else {
        categoryFiltered = programs.filter(program => program.category === selectedCategory);
      }
    }
    
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
    
    console.log('Filtered programs count:', sorted.length);
    setFilteredPrograms(sorted);
  }, [selectedCategory, programs, sortOption]);

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
          <p className="text-gray-700 mb-6">
            Our wellness programs are designed to support individuals on their mental health journey.
            Choose from a variety of evidence-based programs tailored to address specific needs and goals.
          </p>
          
          {/* Category buttons for quick filtering */}
          <CategoryButtons 
            activeCategory={selectedCategory}
            setActiveCategory={setSelectedCategory}
            categoryOptions={allCategoryOptions}
          />
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
