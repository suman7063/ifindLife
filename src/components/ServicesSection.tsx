
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { Heart, Brain, Users } from 'lucide-react';

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

  // Hardcoded categories that match the design
  const designCategories = [
    {
      icon: <Heart className="h-8 w-8 text-ifind-aqua" />,
      title: "Relationship Programs",
      description: "Tackle all kinds of relationship problems and understand their dynamics better.",
      href: "/relationship-programs",
      color: "bg-red-100"
    },
    {
      icon: <Brain className="h-8 w-8 text-ifind-aqua" />,
      title: "Emotional Problems",
      description: "Understand and process your feelings and emotional responses better.",
      href: "/emotional-problems",
      color: "bg-blue-100"
    },
    {
      icon: <Users className="h-8 w-8 text-ifind-aqua" />,
      title: "Parenting Counseling",
      description: "Get expert guidance on effective parenting approaches and child psychology.",
      href: "/parenting-counseling",
      color: "bg-yellow-100"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-6">Mental & Emotional Wellness Solutions</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Find the right fit and talk to a mental healthcare professional who specializes in what you're dealing with. We are here for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designCategories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
