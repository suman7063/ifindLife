
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProgramCard from '@/components/programs/ProgramCard';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';
import { Program } from '@/types/programs';

const ProgramsForWellnessSeekers: React.FC = () => {
  const [activeTab, setActiveTab] = useState('issue-based');

  // Sample wellness programs
  const wellnessPrograms: Program[] = [
    {
      id: 201,
      title: "Mindfulness Meditation Program",
      description: "Develop a consistent meditation practice to reduce stress and improve focus through guided sessions and practical techniques.",
      category: "wellness",
      price: 1999,
      created_at: new Date().toISOString(),
      duration: "6 weeks",
      sessions: 12,
      image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
      programType: "wellness",
      enrollments: 345
    },
    {
      id: 202,
      title: "Emotional Intelligence Mastery",
      description: "Learn to understand and manage your emotions while improving your relationships and communication skills.",
      category: "wellness",
      price: 2499,
      created_at: new Date().toISOString(),
      duration: "8 weeks",
      sessions: 16,
      image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
      programType: "wellness",
      enrollments: 267
    },
    {
      id: 203,
      title: "Life Purpose & Direction",
      description: "Discover your purpose, set meaningful goals, and create a roadmap for personal and professional fulfillment.",
      category: "wellness",
      price: 2799,
      created_at: new Date().toISOString(),
      duration: "10 weeks",
      sessions: 20,
      image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
      programType: "wellness",
      enrollments: 189
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-ifind-aqua/10 to-ifind-lavender/10 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Programs for Wellness Seekers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover comprehensive programs designed to support your mental health journey and personal growth
            </p>
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
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
              <TabsTrigger value="issue-based">Issue-Based Programs</TabsTrigger>
              <TabsTrigger value="wellness">General Wellness</TabsTrigger>
            </TabsList>

            <TabsContent value="issue-based" className="space-y-8" id="issue-based">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">Issue-Based Support Programs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
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

            <TabsContent value="wellness" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">General Wellness Programs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Comprehensive programs focused on overall mental wellness and personal development
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wellnessPrograms.map((program) => (
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
          <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Not Sure Which Program is Right for You?</h3>
            <p className="text-gray-600 mb-6">
              Take our mental health assessment to get personalized program recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
                Take Assessment
              </Button>
              <Button variant="outline">
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
