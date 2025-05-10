
import React, { useState, useEffect, useMemo } from 'react';
import { Program, ProgramType } from '@/types/programs';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import ProgramCard from './ProgramCard';
import { Loader2 } from 'lucide-react';

interface ProgramsListingComponentProps {
  programType: ProgramType;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramsListingComponent: React.FC<ProgramsListingComponentProps> = ({
  programType,
  currentUser,
  isAuthenticated
}) => {
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<
    { id: string; user_id: string; program_id: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        let query = from('programs').select('*').eq('programType', programType);

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Type assertion to handle unknown data structure
        setFeaturedPrograms((data || []) as unknown as Program[]);

        if (isAuthenticated) {
          fetchFavorites();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch programs'));
        setLoading(false);
        toast.error('Failed to load programs. Please try again later.');
      }
    };

    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await from('user_favorite_programs')
          .select('*')
          .eq('user_id', currentUser.id);

        if (error) {
          throw new Error(error.message);
        }

        // Type assertion to handle unknown data structure
        setFavoritePrograms((data || []) as unknown as { id: string; user_id: string; program_id: number }[]);
      } catch (err) {
        console.error('Error fetching favorite programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [currentUser, isAuthenticated, programType]);

  const programsWithFavorites = useMemo(() => {
    if (!isAuthenticated || favoritePrograms.length === 0) {
      return featuredPrograms;
    }

    return featuredPrograms.map(program => ({
      ...program,
      is_favorite: favoritePrograms.some(fp => fp.program_id === program.id)
    }));
  }, [featuredPrograms, favoritePrograms, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-teal" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programsWithFavorites.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

export default ProgramsListingComponent;
