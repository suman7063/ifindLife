
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Users, Clock, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 'therapy-sessions',
      title: 'Therapy Sessions',
      description: 'Professional one-on-one therapy sessions with licensed mental health professionals.',
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      features: ['Individual counseling', 'Couples therapy', 'Group sessions', 'Crisis intervention'],
      duration: '50-90 minutes',
      price: 'From $80',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'mindful-listening',
      title: 'Heart2Heart Listening',
      description: 'Compassionate listening sessions to help you process your thoughts and feelings.',
      icon: <Heart className="h-8 w-8 text-red-600" />,
      features: ['Active listening', 'Emotional support', 'Non-judgmental space', 'Empathetic guidance'],
      duration: '30-60 minutes',
      price: 'From $40',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'life-coaching',
      title: 'Life Coaching',
      description: 'Goal-oriented coaching to help you achieve your personal and professional objectives.',
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      features: ['Goal setting', 'Action planning', 'Accountability', 'Personal development'],
      duration: '45-75 minutes',
      price: 'From $60',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'guided-meditations',
      title: 'Guided Meditations',
      description: 'Structured meditation sessions to promote relaxation and mindfulness.',
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      features: ['Mindfulness training', 'Stress reduction', 'Sleep improvement', 'Focus enhancement'],
      duration: '15-45 minutes',
      price: 'From $25',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'group-therapy',
      title: 'Group Therapy',
      description: 'Supportive group sessions for shared experiences and mutual healing.',
      icon: <Users className="h-8 w-8 text-green-600" />,
      features: ['Peer support', 'Shared experiences', 'Group dynamics', 'Community healing'],
      duration: '60-90 minutes',
      price: 'From $35',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'offline-retreats',
      title: 'Offline Retreats',
      description: 'Immersive retreat experiences for deep healing and personal growth.',
      icon: <CheckCircle className="h-8 w-8 text-teal-600" />,
      features: ['Weekend retreats', 'Wellness workshops', 'Nature therapy', 'Holistic healing'],
      duration: '1-7 days',
      price: 'From $200',
      color: 'bg-teal-50 border-teal-200'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of wellness services designed to support your mental, emotional, and spiritual well-being.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service) => (
              <Card key={service.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${service.color}`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Duration:</span>
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Starting at:</span>
                      <span className="font-bold text-ifind-teal">{service.price}</span>
                    </div>
                  </div>
                  
                  <Link to={`/services/${service.id}`}>
                    <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Take the first step towards better mental health. Our experts are here to guide you on your wellness journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white">
                  Contact Us Today
                </Button>
              </Link>
              <Link to="/mental-health-assessment">
                <Button variant="outline" className="border-ifind-teal text-ifind-teal hover:bg-ifind-teal hover:text-white">
                  Take Free Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Services;
