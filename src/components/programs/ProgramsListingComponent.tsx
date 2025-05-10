
import React, { useState, useEffect, useMemo } from 'react';
import { Program, ProgramType } from '@/types/programs';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import ProgramCard from './ProgramCard';
import { Loader2 } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { programFavorites, isProgramFavorite } = useFavorites();

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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch programs'));
        setLoading(false);
        toast.error('Failed to load programs. Please try again later.');
      }
    };

    fetchPrograms();
  }, [programType]);

  const programsWithFavorites = useMemo(() => {
    return featuredPrograms.map(program => ({
      ...program,
      is_favorite: isProgramFavorite(program.id)
    }));
  }, [featuredPrograms, programFavorites, isProgramFavorite]);

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
