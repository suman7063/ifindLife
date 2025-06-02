
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProgramCard from '@/components/programs/ProgramCard';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';
import { Program } from '@/types/programs';

const ProgramsForWellnessSeekers: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wellness');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Ensure page loads from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample wellness programs with brand colors
  const wellnessPrograms: Program[] = [
    // Quick-Ease Programs
    {
      id: 201,
      title: "Mindfulness Meditation Program",
      description: "Develop a consistent meditation practice to reduce stress and improve focus through guided sessions and practical techniques.",
      category: "quick-ease",
      price: 1999,
      created_at: new Date().toISOString(),
      duration: "6 weeks",
      sessions: 12,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 345
    },
    {
      id: 202,
      title: "Daily Stress Relief",
      description: "Quick techniques to manage daily stress and improve your overall well-being with simple practices.",
      category: "quick-ease",
      price: 1299,
      created_at: new Date().toISOString(),
      duration: "4 weeks",
      sessions: 8,
      image: "https://images.unsplash.com/photo-1573481078935-b9605167e06b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 267
    },
    // Resilience Building Programs
    {
      id: 203,
      title: "Emotional Intelligence Mastery",
      description: "Learn to understand and manage your emotions while improving your relationships and communication skills.",
      category: "resilience-building",
      price: 2499,
      created_at: new Date().toISOString(),
      duration: "8 weeks",
      sessions: 16,
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 189
    },
    {
      id: 204,
      title: "Building Mental Resilience",
      description: "Strengthen your ability to bounce back from challenges and develop lasting mental toughness.",
      category: "resilience-building",
      price: 2799,
      created_at: new Date().toISOString(),
      duration: "10 weeks",
      sessions: 20,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 156
    },
    // Super Human Programs
    {
      id: 205,
      title: "Life Purpose & Direction",
      description: "Discover your purpose, set meaningful goals, and create a roadmap for personal and professional fulfillment.",
      category: "super-human",
      price: 3499,
      created_at: new Date().toISOString(),
      duration: "12 weeks",
      sessions: 24,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 98
    },
    {
      id: 206,
      title: "Peak Performance Mastery",
      description: "Unlock your full potential and achieve extraordinary results in all areas of your life.",
      category: "super-human",
      price: 3999,
      created_at: new Date().toISOString(),
      duration: "14 weeks",
      sessions: 28,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      programType: "wellness",
      enrollments: 76
    }
  ];

  const getFilteredPrograms = () => {
    if (selectedCategory === 'all') {
      return wellnessPrograms;
    }
    return wellnessPrograms.filter(program => program.category === selectedCategory);
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'quick-ease': return 'Quick-Ease Programs';
      case 'resilience-building': return 'Resilience Building Programs';
      case 'super-human': return 'Super Human Programs';
      default: return 'All Programs';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section - Muted Purple Theme */}
      <div className="bg-gradient-to-br from-ifind-purple/10 to-ifind-purple/20 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-ifind-charcoal mb-4">
              Programs for Wellness Seekers
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-center">
              Discover comprehensive programs designed to support your mental health journey and personal growth
            </p>
            <Button className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
              Start Your Journey
            </Button>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <Container>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="wellness">General Wellness</TabsTrigger>
              <TabsTrigger value="issue-based">Issue-Based Programs</TabsTrigger>
            </TabsList>

            <TabsContent value="wellness" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">General Wellness Programs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-center">
                  Comprehensive programs focused on overall mental wellness and personal development
                </p>
              </div>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white' : 'border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10'}
                >
                  All Programs
                </Button>
                <Button
                  variant={selectedCategory === 'quick-ease' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('quick-ease')}
                  className={selectedCategory === 'quick-ease' ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white' : 'border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10'}
                >
                  Quick-Ease Programs
                </Button>
                <Button
                  variant={selectedCategory === 'resilience-building' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('resilience-building')}
                  className={selectedCategory === 'resilience-building' ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white' : 'border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10'}
                >
                  Resilience Building Programs
                </Button>
                <Button
                  variant={selectedCategory === 'super-human' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('super-human')}
                  className={selectedCategory === 'super-human' ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white' : 'border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10'}
                >
                  Super Human Programs
                </Button>
                <Button
                  variant={selectedCategory === 'favorites' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('favorites')}
                  className={selectedCategory === 'favorites' ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white' : 'border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10'}
                >
                  Favorite Programs
                </Button>
              </div>

              {/* Category Title */}
              {selectedCategory !== 'all' && (
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-ifind-purple">
                    {getCategoryDisplayName(selectedCategory)}
                  </h3>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredPrograms().map((program) => (
                  <ProgramCard 
                    key={program.id} 
                    program={program} 
                    currentUser={null} 
                    isAuthenticated={false} 
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issue-based" className="space-y-8" id="issue-based">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Issue-Based Support Programs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-center">
                  Targeted programs designed to address specific mental health challenges with expert guidance
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issueBasedPrograms.map((program) => (
                  <ProgramCard 
                    key={program.id} 
                    program={program} 
                    currentUser={null} 
                    isAuthenticated={false} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-ifind-offwhite rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Not Sure Which Program is Right for You?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Take our mental health assessment to get personalized program recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
                Take Assessment
              </Button>
              <Button variant="outline" className="border-ifind-purple text-ifind-purple hover:bg-ifind-purple/10">
                Talk to an Expert
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramsForWellnessSeekers;
