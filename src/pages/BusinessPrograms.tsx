
import React, { useEffect, useState } from 'react';
import { Program } from '@/types/programs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { supabase } from '@/lib/supabase';
import ProgramCard from '@/components/programs/ProgramCard'; // Fixed import

const BusinessProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch business programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        // First ensure we have sample business programs in the database
        await addSamplePrograms('business');
        
        // Then fetch them
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'business')
          .order('title');
          
        if (error) {
          console.error('Error fetching business programs:', error);
          return;
        }
        
        // Ensure the data matches the Program type
        setPrograms(data as unknown as Program[]);
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
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-ifind-charcoal text-white py-10">
          <div className="container">
            <h1 className="text-3xl font-bold mb-2">Programs for Businesses</h1>
            <p className="text-ifind-offwhite/80">
              Dedicated mental health and wellness solutions to support your organization and employees
            </p>
          </div>
        </div>
        
        {/* Programs Section */}
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
                  currentUser={null}
                  isAuthenticated={false}
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
