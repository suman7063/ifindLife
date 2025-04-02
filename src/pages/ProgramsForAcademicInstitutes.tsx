
import React, { useEffect, useState } from 'react';
import { Program } from '@/types/programs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { from } from '@/lib/supabase';
import ProgramList from '@/components/programs/ProgramList';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';

const ProgramsForAcademicInstitutes: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useUserAuth();

  // Fetch academic programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        
        // First ensure we have sample academic programs in the database
        await addSamplePrograms('academic');
        
        // Then fetch them
        const { data, error } = await from('programs')
          .select('*')
          .eq('programType', 'academic')
          .order('title');
          
        if (error) {
          console.error('Error fetching academic programs:', error);
          return;
        }
        
        if (data) {
          // Convert the data to Program type explicitly
          const formattedPrograms: Program[] = data.map(program => ({
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
          
          setPrograms(formattedPrograms);
        }
      } catch (error) {
        console.error('Error in academic programs fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Programs For Academic Institutes</h1>
        
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4 text-ifind-purple">
            Mental Wellness Solutions for Educational Institutions
          </h2>
          <p className="text-gray-700 mb-6">
            Our specialized programs for academic institutions provide comprehensive mental health support 
            for students, faculty, and staff. Create a healthier learning environment with our evidence-based 
            approaches to mental wellbeing in educational settings.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
          </div>
        ) : (
          <ProgramList 
            programs={programs}
            isLoading={isLoading}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            emptyMessage="No academic programs are currently available."
          />
        )}
      </div>
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForAcademicInstitutes;
