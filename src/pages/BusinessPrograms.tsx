import React, { useEffect, useState } from 'react';
import { Program } from '@/types/programs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { supabase } from '@/lib/supabase';
import ProgramCard from '@/components/programs/ProgramCard';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';

const BusinessProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useUserAuth();

  // Fetch business programs only
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        // First ensure we have sample business programs in the database
        await addSamplePrograms('business');
        
        // Then fetch only business programs
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'business')
          .order('title');
          
        if (error) {
          console.error('Error fetching business programs:', error);
          return;
        }
        
        // Filter out any programs that might have wrong categorization
        const businessPrograms = (data || []).filter(program => 
          program.programType === 'business' && 
          program.category !== 'super-human'
        );
        
        console.log('Business programs fetched:', businessPrograms);
        setPrograms(businessPrograms as unknown as Program[]);
      } catch (error) {
        console.error('Error in business programs fetch:', error);
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
        title="Programs for Businesses" 
        subtitle="Dedicated mental health and wellness solutions to support your organization and employees"
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
              <p className="text-gray-600">No business programs available.</p>
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

export default BusinessProgramsPage;
