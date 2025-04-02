
import React, { useEffect, useState } from 'react';
import { Program } from '@/types/programs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { from } from '@/lib/supabase';
import ProgramList from '@/components/programs/ProgramList';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';

const ProgramsForBusiness: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useUserAuth();

  // Fetch business programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        
        // First ensure we have sample business programs in the database
        await addSamplePrograms('business');
        
        // Then fetch them
        const { data, error } = await from('programs')
          .select('*')
          .eq('programType', 'business')
          .order('title');
          
        if (error) {
          console.error('Error fetching business programs:', error);
          return;
        }
        
        // Properly cast the data to ensure type safety
        const formattedPrograms = (data || []).map(program => ({
          ...program,
          category: program.category as Program['category'],  // Ensure correct type casting
          programType: program.programType as Program['programType'] // Ensure correct type casting
        }));
        
        setPrograms(formattedPrograms);
      } catch (error) {
        console.error('Error in business programs fetch:', error);
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
        <h1 className="text-3xl font-bold mb-8 text-center">Programs For Businesses</h1>
        
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4 text-ifind-purple">
            Mental Wellness Solutions for Organizations
          </h2>
          <p className="text-gray-700 mb-6">
            Our specialized programs for businesses provide comprehensive mental health support 
            for employees and leadership teams. Enhance workplace wellness and productivity with 
            our evidence-based approaches to mental wellbeing in organizational settings.
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
            emptyMessage="No business programs are currently available."
          />
        )}
      </div>
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForBusiness;
