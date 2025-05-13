
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Users, MessageCircle, Sparkles, Lightbulb } from 'lucide-react';

interface IssueSessionsProps {
  onCategoryClick: (category: any) => void;
}

const IssueSessions: React.FC<IssueSessionsProps> = ({ onCategoryClick }) => {
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

  // Function to handle navigation with scroll to top
  const handleSeeAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-semibold mb-6">How Can We Help You Today?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designCategories.map((category, index) => (
          <div 
            key={`category-${index}`}
            onClick={() => onCategoryClick(category)}
            className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <CategoryCard 
              icon={category.icon}
              title={category.title}
              description={category.description}
              href={category.href}
              color={category.color}
              cardStyle="session" 
            />
          </div>
        ))}
      </div>
      
      {/* See All Issue Based Sessions Link */}
      <div className="mt-8 text-center">
        <Link to="/programs-for-wellness-seekers?category=issue-based" onClick={handleSeeAllClick}>
          <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
            See All Issue Based Sessions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IssueSessions;
