import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Sparkles, Brain, Zap, ArrowRight, Clock, Users, Star } from 'lucide-react';

const WellnessSeekerProgrammes = () => {
  const programmes = [
    {
      id: 1,
      title: "Fear & Guilt Liberation",
      subtitle: "Break Free from Limiting Emotions", 
      description: "Transform your relationship with fear and guilt through proven therapeutic techniques and mindfulness practices.",
      duration: "8 weeks",
      sessions: 16,
      price: 297,
      participants: 850,
      rating: 4.9,
      icon: <Shield className="w-8 h-8" />,
      color: "#A88BEB", // Muted Purple
      features: ["Daily guided meditations", "Fear release techniques", "Guilt transformation exercises", "Personal breakthrough sessions"]
    },
    {
      id: 2,
      title: "Freedom: A Journey to Inner Clarity",
      subtitle: "Discover Your Authentic Self",
      description: "Embark on a transformative journey to inner freedom, clarity, and authentic self-expression.",
      duration: "12 weeks",
      sessions: 24,
      price: 497,
      participants: 1200,
      rating: 4.8,
      icon: <Sparkles className="w-8 h-8" />,
      color: "#5AC8FA", // Aqua Blue
      features: ["Self-discovery workshops", "Clarity meditation practices", "Freedom visualization", "Life purpose exploration"]
    },
    {
      id: 3,
      title: "Getting Over Childhood Trauma",
      subtitle: "Heal Your Inner Child",
      description: "Gentle, evidence-based approaches to healing childhood wounds and creating new patterns of wellbeing.",
      duration: "16 weeks",
      sessions: 32,
      price: 697,
      participants: 650,
      rating: 4.9,
      icon: <Heart className="w-8 h-8" />,
      color: "#7DD8C9", // Soft Teal
      features: ["Trauma-informed therapy", "Inner child healing", "Safe space creation", "Resilience building"]
    },
    {
      id: 4,
      title: "Energy Alchemy: Awakening Inner Currents",
      subtitle: "Balance Your Energetic Body",
      description: "Learn to work with your subtle energy systems to create balance, vitality, and spiritual awakening.",
      duration: "10 weeks",
      sessions: 20,
      price: 397,
      participants: 750,
      rating: 4.7,
      icon: <Zap className="w-8 h-8" />,
      color: "#A88BEB", // Muted Purple
      features: ["Chakra balancing", "Energy healing techniques", "Meditation practices", "Spiritual awakening guidance"]
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="absolute inset-0" style={{ backgroundColor: '#5AC8FA', opacity: 0.05 }} />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 border" style={{ backgroundColor: '#7DD8C9', color: '#2E2E2E', borderColor: '#7DD8C9' }}>
              Transformative Wellness Journey
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#2E2E2E' }}>
              Wellness Seeker
              <span className="block">Programmes</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto" style={{ color: '#2E2E2E', opacity: 0.8 }}>
              Discover profound healing and transformation through our specialized programmes designed for deep personal growth and spiritual awakening.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-white px-8 py-3 rounded-full hover:opacity-90" style={{ backgroundColor: '#A88BEB' }}>
                Explore Programmes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>3,450+ Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ fill: '#5AC8FA', color: '#5AC8FA' }} />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-20" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2E2E2E' }}>
              Choose Your
              <span className="ml-2" style={{ color: '#A88BEB' }}>Transformation</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#2E2E2E', opacity: 0.7 }}>
              Each programme is carefully crafted to address specific aspects of your wellness journey, 
              providing you with the tools and support needed for lasting change.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {programmes.map((programme) => (
              <Card key={programme.id} className="group relative overflow-hidden border hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}>
                <div className="absolute inset-0 opacity-5 transition-opacity duration-500 group-hover:opacity-10" style={{ backgroundColor: programme.color }} />
                
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl text-white shadow-sm" style={{ backgroundColor: programme.color }}>
                      {programme.icon}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4" style={{ fill: '#5AC8FA', color: '#5AC8FA' }} />
                        <span className="text-sm font-semibold" style={{ color: '#2E2E2E' }}>{programme.rating}</span>
                      </div>
                      <div className="text-xs" style={{ color: '#2E2E2E', opacity: 0.6 }}>
                        {programme.participants}+ students
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 transition-colors" style={{ color: '#2E2E2E' }}>
                      {programme.title}
                    </h3>
                    <p className="font-semibold mb-3" style={{ color: programme.color }}>
                      {programme.subtitle}
                    </p>
                    <p className="leading-relaxed" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                      {programme.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>What You'll Learn:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {programme.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: programme.color }} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between mb-6 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{programme.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        <span>{programme.sessions} sessions</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: programme.color }}>
                        €{programme.price}
                      </div>
                      <div className="text-xs" style={{ color: '#2E2E2E', opacity: 0.6 }}>
                        One-time payment
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full text-white shadow-sm hover:shadow-md transition-all duration-300 hover:opacity-90"
                    style={{ backgroundColor: programme.color }}
                    size="lg"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our
              <span className="ml-2" style={{ color: '#A88BEB' }}>Programmes?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#5AC8FA' }}>
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2E2E2E' }}>Evidence-Based</h3>
              <p style={{ color: '#2E2E2E', opacity: 0.7 }}>
                All our programmes are grounded in proven therapeutic methods and spiritual practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#7DD8C9' }}>
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2E2E2E' }}>Compassionate Support</h3>
              <p style={{ color: '#2E2E2E', opacity: 0.7 }}>
                Experience healing in a safe, supportive environment with expert guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#A88BEB' }}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2E2E2E' }}>Lasting Transformation</h3>
              <p style={{ color: '#2E2E2E', opacity: 0.7 }}>
                Create sustainable change that extends beyond the programme duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#A88BEB' }}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your
            <span className="block">Transformation?</span>
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto" style={{ opacity: 0.9 }}>
            Take the first step towards healing, growth, and discovering your true potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 rounded-full hover:opacity-90" style={{ backgroundColor: 'white', color: '#A88BEB' }}>
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white px-8 py-3 rounded-full" style={{ borderColor: 'white' }}>
              Download Programme Guide
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WellnessSeekerProgrammes;