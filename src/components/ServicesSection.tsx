
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { Heart, Brain, Users, MessageCircle, Sparkles, Lightbulb, Star, CircleDot } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ServicesSection = () => {
  const [categories, setCategories] = useState(defaultCategoryData);
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
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

  const featuredPrograms = [
    {
      icon: <Brain className="h-8 w-8 text-white" />,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      href: "/programs-for-wellness-seekers?category=quick-ease",
      color: "bg-gradient-to-r from-ifind-aqua/60 to-ifind-aqua/80",
      textColor: "text-white"
    },
    {
      icon: <CircleDot className="h-8 w-8 text-white" />,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      href: "/programs-for-wellness-seekers?category=resilience-building",
      color: "bg-gradient-to-r from-ifind-aqua/80 to-ifind-teal",
      textColor: "text-white"
    },
    {
      icon: <Star className="h-8 w-8 text-white" />,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      href: "/programs-for-wellness-seekers?category=super-human",
      color: "bg-gradient-to-r from-ifind-purple/80 to-ifind-purple",
      textColor: "text-white"
    }
  ];

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

  const handleCategoryClick = (category: any) => {
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
          IFL provides 3 kind of programs in addition to issue/situation based sessions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {featuredPrograms.map((program, index) => (
            <div 
              key={`program-${index}`} 
              onClick={() => handleProgramClick(program.href)} 
              className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <CategoryCard 
                icon={program.icon}
                title={program.title}
                description={program.description}
                href={program.href}
                color={program.color}
                textColor={program.textColor}
                cardStyle="program"
              />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6">Issue Based Sessions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designCategories.map((category, index) => (
              <div 
                key={`category-${index}`}
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <CategoryCard 
                  {...category}
                  cardStyle="session" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedCategory?.icon && React.cloneElement(selectedCategory.icon as React.ReactElement, { className: 'h-6 w-6 mr-2' })}
              {selectedCategory?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p className="mb-4 text-gray-700">
              Our experienced professionals provide personalized guidance and support to help you navigate through your challenges.
            </p>
            <div className="flex justify-between mt-4">
              <Button asChild variant="outline">
                <Link to="/experts">Find an Expert</Link>
              </Button>
              <Button asChild>
                <Link to="/services">Book a Session</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;
