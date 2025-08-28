import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      color: "from-red-500 to-pink-600",
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
      color: "from-blue-500 to-purple-600",
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
      color: "from-green-500 to-teal-600",
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
      color: "from-yellow-500 to-orange-600",
      features: ["Chakra balancing", "Energy healing techniques", "Meditation practices", "Spiritual awakening guidance"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Wellness Seeker Programmes - iFindLife</title>
        <meta name="description" content="Transformative wellness programmes for personal growth, healing, and spiritual awakening. Join thousands on their journey to inner freedom." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              Transformative Wellness Journey
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Wellness Seeker
              <span className="block">Programmes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Discover profound healing and transformation through our specialized programmes designed for deep personal growth and spiritual awakening.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-3 rounded-full">
                Explore Programmes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>3,450+ Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Choose Your
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Transformation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each programme is carefully crafted to address specific aspects of your wellness journey, 
              providing you with the tools and support needed for lasting change.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {programmes.map((programme) => (
              <Card key={programme.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card/50 to-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${programme.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${programme.color} text-white shadow-lg`}>
                      {programme.icon}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{programme.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {programme.participants}+ students
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {programme.title}
                    </h3>
                    <p className="text-primary font-semibold mb-3">
                      {programme.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {programme.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground">What You'll Learn:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {programme.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between mb-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <div className="text-2xl font-bold text-primary">
                        €{programme.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        One-time payment
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${programme.color} hover:opacity-90 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
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
      <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Programmes?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Evidence-Based</h3>
              <p className="text-muted-foreground">
                All our programmes are grounded in proven therapeutic methods and spiritual practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compassionate Support</h3>
              <p className="text-muted-foreground">
                Experience healing in a safe, supportive environment with expert guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lasting Transformation</h3>
              <p className="text-muted-foreground">
                Create sustainable change that extends beyond the programme duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your
            <span className="block">Transformation?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards healing, growth, and discovering your true potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-full">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full">
              Download Programme Guide
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WellnessSeekerProgrammes;