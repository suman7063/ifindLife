
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { Heart, Brain, Users, MessageCircle, Sparkles, Lightbulb, Star, CircleDot } from 'lucide-react';

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

  // Featured program cards from the image
  const featuredPrograms = [
    {
      icon: <Brain className="h-8 w-8 text-pink-500" />,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      href: "/programs/quickease",
      color: "bg-blue-100"
    },
    {
      icon: <CircleDot className="h-8 w-8 text-green-600" />,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      href: "/programs/emotional-resilience",
      color: "bg-teal-100"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      href: "/programs/superhuman-life",
      color: "bg-cyan-500"
    }
  ];

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
    <section className="py-16 bg-ifind-offwhite">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-6">IFL Programs</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          IFL provides 3 kind of programs in addition to issue/situation based sessions
        </p>

        {/* Featured Programs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {featuredPrograms.map((program, index) => (
            <CategoryCard 
              key={`program-${index}`} 
              icon={program.icon}
              title={program.title}
              description={program.description}
              href={program.href}
              color={program.color}
            />
          ))}
        </div>

        {/* Issue/Situation Based Sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designCategories.map((category, index) => (
            <CategoryCard key={`category-${index}`} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
