import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { ExpertCardData } from '@/components/expert-card/types';
import { Loader2 } from 'lucide-react';
import { expertCategories } from '@/data/expertCategories';
import ExpertCategoryTabs from '@/components/experts/unified/ExpertCategoryTabs';
import ExpertCategoryContent from '@/components/experts/unified/ExpertCategoryContent';

const UnifiedExpertsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Extract category from URL - prioritize search params for tab switching
  const getInitialCategory = useMemo(() => {
    // First check search params (for tab switching)
    const paramCategory = searchParams.get('category');
    if (paramCategory) return paramCategory;
    
    // Then check path for legacy routes
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const legacyCategories = ['listening-volunteer', 'listening-expert', 'mindfulness-expert', 'life-coach', 'spiritual-mentor'];
    if (legacyCategories.includes(lastPart)) {
      return lastPart;
    }
    
    return 'listening-volunteer';
  }, [location.pathname, searchParams]);
  
  const [activeCategory, setActiveCategory] = useState(getInitialCategory);
  
  // Only update category when the initial category calculation changes (page load/navigation)
  useEffect(() => {
    // Only update if there's no search param (meaning we're on initial load or direct navigation)
    if (!searchParams.get('category')) {
      setActiveCategory(getInitialCategory);
    }
  }, [getInitialCategory, searchParams]);
  
  const { experts, loading, error } = usePublicExpertsData();

  // Filter experts by active category
  const categoryExperts = useMemo(() => 
    experts.filter((expert: ExpertCardData) => 
      expert.category === activeCategory
    ), [experts, activeCategory]
  );

  // Get current category data
  const currentCategory = expertCategories.find(cat => cat.id === activeCategory);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Update URL to reflect the selected category
    setSearchParams({ category });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading experts: {error}</p>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid expert category</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-ifind-offwhite via-background to-ifind-teal/10 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Category Tabs */}
          <ExpertCategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Category Content */}
          <ExpertCategoryContent 
            category={currentCategory}
            experts={categoryExperts}
            loading={false}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UnifiedExpertsPage;