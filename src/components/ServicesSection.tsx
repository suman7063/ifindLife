
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { Heart, Brain, Users, MessageCircle, Sparkles, Lightbulb } from 'lucide-react';

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

  // Hardcoded categories that match the Visily design
  const designCategories = [
    {
      icon: <Brain className="h-8 w-8 text-ifind-aqua" />,
      title: "Anxiety & Depression",
      description: "Get help managing anxiety, depression, and stress from licensed therapists.",
      href: "/anxiety-depression",
      color: "bg-blue-100"
    },
    {
      icon: <Heart className="h-8 w-8 text-ifind-aqua" />,
      title: "Relationship Counseling",
      description: "Improve communication and resolve conflicts in all types of relationships.",
      href: "/relationship-counseling",
      color: "bg-red-100"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-ifind-aqua" />,
      title: "Career Guidance",
      description: "Navigate work stress, career transitions, and professional development.",
      href: "/career-guidance",
      color: "bg-yellow-100"
    },
    {
      icon: <Users className="h-8 w-8 text-ifind-aqua" />,
      title: "Family Therapy",
      description: "Address family dynamics, parenting challenges, and intergenerational issues.",
      href: "/family-therapy",
      color: "bg-green-100"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-ifind-aqua" />,
      title: "Trauma Recovery",
      description: "Process and heal from past trauma with specialized therapeutic approaches.",
      href: "/trauma-recovery",
      color: "bg-purple-100"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-ifind-aqua" />,
      title: "Teen Counseling",
      description: "Support for adolescents facing academic pressure, identity, and social challenges.",
      href: "/teen-counseling",
      color: "bg-orange-100"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-6">Our Mental Health Services</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Professional support for your mental health needs. Our licensed therapists specialize in a wide range of issues.
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
