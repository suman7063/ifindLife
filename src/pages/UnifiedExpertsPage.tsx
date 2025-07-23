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
  
  // Extract category from URL path or search params
  const getCategoryFromPath = useMemo(() => () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Check if it's one of the legacy category routes
    const legacyCategories = ['listening-volunteer', 'listening-expert', 'mindfulness-expert', 'life-coach', 'spiritual-mentor'];
    if (legacyCategories.includes(lastPart)) {
      return lastPart;
    }
    
    // Fall back to search params or default
    return searchParams.get('category') || 'listening-volunteer';
  }, [location.pathname, searchParams]);
  
  const [activeCategory, setActiveCategory] = useState(() => getCategoryFromPath());
  
  // Update active category when URL changes
  useEffect(() => {
    const newCategory = getCategoryFromPath();
    setActiveCategory(newCategory);
  }, [getCategoryFromPath]);
  
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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pt-20">
        <div className="container mx-auto px-4 py-12">
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