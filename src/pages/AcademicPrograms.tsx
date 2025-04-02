
import React, { useEffect, useState } from 'react';
import { Program } from '@/types/programs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { supabase } from '@/lib/supabase';
import ProgramCard from '@/components/programs/ProgramCard';
import { useUserAuth } from '@/hooks/useUserAuth';

const AcademicProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useUserAuth();

  // Fetch academic programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        // First ensure we have sample academic programs in the database
        await addSamplePrograms('academic');
        
        // Then fetch them
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'academic')
          .order('title');
          
        if (error) {
          console.error('Error fetching academic programs:', error);
          return;
        }
        
        // Ensure the data matches the Program type
        setPrograms(data as unknown as Program[]);
      } catch (error) {
        console.error('Error in academic programs fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Programs for Academic Institutes" 
        subtitle="Comprehensive mental health solutions designed for schools, colleges, and universities"
      />
      
      <main className="flex-1">
        <div className="container py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No academic programs available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard 
                  key={program.id} 
                  program={program}
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AcademicProgramsPage;
