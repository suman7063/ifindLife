import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, User, IndianRupee, Star, Brain, Heart, ShieldAlert, Sparkles, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const IssueBasedSessions = () => {
  const sessions = [
    {
      id: 'depression',
      title: 'Depression Support Program',
      icon: <Cloud className="h-8 w-8 text-blue-500" />,
      duration: '8 weeks',
      sessionHours: '1 hour/week',
      expert: 'Dr. Sarah Johnson',
      expertCredentials: 'Clinical Psychologist, PhD',
      price: 2999,
      originalPrice: 3999,
      discount: '25% OFF',
      rating: 4.9,
      description: 'Comprehensive support program for managing depression symptoms and improving overall mood through evidence-based therapeutic techniques.',
      features: [
        'Individual counseling sessions',
        'Cognitive Behavioral Therapy techniques',
        'Mood tracking tools',
        'Support group access',
        'Crisis intervention support'
      ],
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'anxiety',
      title: 'Anxiety Management Program',
      icon: <Brain className="h-8 w-8 text-green-500" />,
      duration: '6 weeks',
      sessionHours: '1.5 hours/week',
      expert: 'Dr. Michael Chen',
      expertCredentials: 'Licensed Therapist, MA Psychology',
      price: 2499,
      originalPrice: 3299,
      discount: '24% OFF',
      rating: 4.8,
      description: 'Learn effective tools and techniques to manage anxiety, reduce worry, and build confidence in daily life situations.',
      features: [
        'Breathing and relaxation techniques',
        'Exposure therapy (gradual)',
        'Mindfulness meditation',
        'Anxiety coping strategies',
        '24/7 support helpline'
      ],
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      id: 'stress',
      title: 'Stress Management Masterclass',
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      duration: '4 weeks',
      sessionHours: '2 hours/week',
      expert: 'Dr. Lisa Patel',
      expertCredentials: 'Stress Management Specialist, PhD',
      price: 1999,
      originalPrice: 2599,
      discount: '23% OFF',
      rating: 4.7,
      description: 'Develop effective strategies to cope with and reduce stress in both personal and professional environments.',
      features: [
        'Time management techniques',
        'Work-life balance strategies',
        'Stress reduction exercises',
        'Lifestyle modification guidance',
        'Personal stress management plan'
      ],
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      id: 'sleep',
      title: 'Sleep Quality Improvement',
      icon: <Cloud className="h-8 w-8 text-indigo-500" />,
      duration: '5 weeks',
      sessionHours: '1 hour/week',
      expert: 'Dr. Robert Kim',
      expertCredentials: 'Sleep Specialist, MD',
      price: 2299,
      originalPrice: 2999,
      discount: '23% OFF',
      rating: 4.6,
      description: 'Comprehensive program to improve sleep quality, address insomnia, and establish healthy sleep patterns.',
      features: [
        'Sleep hygiene education',
        'Insomnia treatment protocols',
        'Relaxation techniques',
        'Sleep tracking guidance',
        'Lifestyle adjustments'
      ],
      color: 'bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 'relationships',
      title: 'Relationship Counseling Program',
      icon: <Heart className="h-8 w-8 text-red-500" />,
      duration: '10 weeks',
      sessionHours: '1.5 hours/week',
      expert: 'Dr. Amanda Wilson',
      expertCredentials: 'Marriage & Family Therapist, LMFT',
      price: 3499,
      originalPrice: 4499,
      discount: '22% OFF',
      rating: 4.9,
      description: 'Build healthier, more fulfilling relationships through improved communication and conflict resolution skills.',
      features: [
        'Communication skills training',
        'Conflict resolution techniques',
        'Emotional intelligence development',
        'Trust building exercises',
        'Relationship maintenance strategies'
      ],
      color: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100'
    },
    {
      id: 'trauma',
      title: 'Trauma Recovery Program',
      icon: <ShieldAlert className="h-8 w-8 text-orange-500" />,
      duration: '12 weeks',
      sessionHours: '1 hour/week',
      expert: 'Dr. Jennifer Davis',
      expertCredentials: 'Trauma Specialist, PhD, EMDR Certified',
      price: 3999,
      originalPrice: 5199,
      discount: '23% OFF',
      rating: 4.8,
      description: 'Specialized support for healing from trauma and managing PTSD symptoms with evidence-based therapeutic approaches.',
      features: [
        'EMDR therapy sessions',
        'Trauma-focused CBT',
        'Grounding techniques',
        'Safety planning',
        'Post-trauma growth guidance'
      ],
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100'
    },
    {
      id: 'grief',
      title: 'Grief & Loss Support',
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      duration: '8 weeks',
      sessionHours: '1 hour/week',
      expert: 'Dr. Thomas Brown',
      expertCredentials: 'Grief Counselor, MA Counseling Psychology',
      price: 2699,
      originalPrice: 3499,
      discount: '23% OFF',
      rating: 4.7,
      description: 'Compassionate support for navigating grief and loss, helping you process emotions and find healing.',
      features: [
        'Grief processing techniques',
        'Emotional support',
        'Coping strategies',
        'Memorial planning guidance',
        'Support group sessions'
      ],
      color: 'bg-pink-50 border-pink-200',
      iconBg: 'bg-pink-100'
    },
    {
      id: 'self-esteem',
      title: 'Self-Esteem Building Program',
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      duration: '6 weeks',
      sessionHours: '1.5 hours/week',
      expert: 'Dr. Maria Rodriguez',
      expertCredentials: 'Self-Confidence Coach, PhD Psychology',
      price: 2199,
      originalPrice: 2899,
      discount: '24% OFF',
      rating: 4.8,
      description: 'Build lasting confidence and improve self-image through proven psychological techniques and personalized coaching.',
      features: [
        'Self-awareness exercises',
        'Confidence building activities',
        'Positive self-talk training',
        'Goal setting and achievement',
        'Personal development planning'
      ],
      color: 'bg-yellow-50 border-yellow-200',
      iconBg: 'bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Issue Based Sessions</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized therapy programs designed to address specific mental health concerns. 
                Get expert guidance from licensed professionals in a supportive environment.
              </p>
            </div>
          </div>
        </section>

        {/* Sessions Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sessions.map((session) => (
                <Card key={session.id} id={session.id} className={`${session.color} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${session.iconBg} rounded-full flex items-center justify-center`}>
                          {session.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{session.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">{session.expertCredentials}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {session.discount}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">{session.description}</p>
                    
                    {/* Session Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{session.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{session.sessionHours}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{session.expert}</span>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div>
                      <h4 className="font-medium mb-2">What's Included:</h4>
                      <ul className="space-y-1">
                        {session.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <IndianRupee className="h-5 w-5 text-gray-900" />
                          <span className="text-2xl font-bold text-gray-900">{session.price}</span>
                        </div>
                        <div className="flex items-center text-gray-500 line-through">
                          <IndianRupee className="h-4 w-4" />
                          <span className="text-lg">{session.originalPrice}</span>
                        </div>
                      </div>
                      
                      <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Program is Right for You?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Schedule a free 15-minute consultation with one of our experts to discuss your needs 
              and find the best program for your mental health journey.
            </p>
            <Button size="lg" className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
              Schedule Free Consultation
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IssueBasedSessions;
