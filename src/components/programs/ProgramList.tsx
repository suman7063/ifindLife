
import React, { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';
import ProgramGrid from './ProgramGrid';
import ProgramCategories from './ProgramCategories';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProgramListProps {
  programs: Program[];
  loading?: boolean;
  user?: UserProfile | any;
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  loading = false,
  user,
  onProgramClick,
  onFavoriteToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(programs);

  // Adapt user profile to ensure consistent structure
  const adaptedUser = user ? adaptUserProfile(user) : null;

  // Get unique categories from programs
  const categories = Array.from(new Set(programs.map(p => p.category)));

  useEffect(() => {
    let filtered = programs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(program => program.category === selectedCategory);
    }

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <ProgramCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        user={adaptedUser}
      />

      {/* Programs Grid */}
      <ProgramGrid
        programs={filteredPrograms}
        loading={loading}
        user={adaptedUser}
        onProgramClick={onProgramClick}
        onFavoriteToggle={onFavoriteToggle}
      />
    </div>
  );
};

export default ProgramList;
