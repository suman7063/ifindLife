
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Programs = () => {
  const programs = [
    {
      id: 1,
      title: "Stress Management",
      description: "Learn effective techniques to manage daily stress and anxiety through our comprehensive program.",
      duration: "6 weeks",
      sessions: 12,
      price: 4999,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Mindfulness Meditation",
      description: "Develop mindfulness skills to stay present and improve your overall mental wellbeing.",
      duration: "4 weeks",
      sessions: 8,
      price: 3499,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Relationship Counseling",
      description: "Strengthen your relationships with effective communication and conflict resolution techniques.",
      duration: "8 weeks",
      sessions: 16,
      price: 6999,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-ifind-charcoal text-white py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Mental Wellness Programs</h1>
          <p className="text-ifind-offwhite/80">Structured programs designed to support your mental health journey</p>
        </div>
      </div>
      
      <main className="flex-1 py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>
                    {program.duration} • {program.sessions} sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-ifind-teal">
                    ₹{program.price}
                  </div>
                  <Button className="bg-ifind-purple hover:bg-ifind-purple/90">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
