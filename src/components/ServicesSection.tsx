
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categoryData as defaultCategoryData } from '@/data/homePageData';

const ServicesSection = () => {
  const [categories, setCategories] = useState(defaultCategoryData);

  // Load content from localStorage on component mount
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

  return (
    <section className="py-16 bg-gradient-to-b from-background to-ifind-offwhite/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Mental & Emotional Wellness Solutions</h2>
          <p className="text-muted-foreground">
            Explore our range of mental wellness services designed to provide clarity
            and guidance for your emotional well-being and personal growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
