
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { toast } from 'sonner';
import FeaturedPrograms from './services/FeaturedPrograms';
import IssueSessions from './services/IssueSessions';
import SessionDetailDialog from './services/SessionDetailDialog';

const ServicesSection = () => {
  const [categories, setCategories] = useState(defaultCategoryData);
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.categories) {
          setCategories(parsedContent.categories);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  const handleCategoryClick = (category: any) => {
    console.log("Category clicked:", category);
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleProgramClick = (href: string) => {
    navigate(href);
  };

  return (
    <section className="py-16 bg-ifind-purple/5">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-6">IFL Programs for Individuals</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          IFL provides 3 kinds of programs in addition to issue/situation based sessions
        </p>

        <FeaturedPrograms onProgramClick={handleProgramClick} />
        <IssueSessions onCategoryClick={handleCategoryClick} />
      </div>

      <SessionDetailDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedCategory={selectedCategory}
      />
    </section>
  );
};

export default ServicesSection;
