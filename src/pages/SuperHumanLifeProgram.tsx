import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Globe, Users, Award, Calendar, Clock, Video, BookOpen, Headphones, Heart, Brain, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import images
import superheroHero from '@/assets/superhuman-hero.jpg';
import superheroCollage from '@/assets/superhuman-collage.jpg';
import masterPortrait from '@/assets/master-portrait.jpg';

const SuperHumanLifeProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Super Human Life Transformation Program
            </h1>
            <div className="relative max-w-5xl mx-auto mb-8">
              <img 
                src={superheroCollage} 
                alt="Transformation program collage showing meditation, mindfulness, and personal growth activities"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Namaste 🙏
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Welcome to iFindLife's Super Human Life Transformation Program! Embark on a virtual journey of self-mastery and 
                unlimited potential like never before. Our transformative program brings the power of human optimization to your 
                doorstep, guiding you towards extraordinary performance and holistic excellence. Join our community of high-achievers 
                and unlock your superhuman potential from the comfort of your own space. Begin your extraordinary journey today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Elevate Your Human Potential & Transform Lives
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Master Advanced Techniques From Multiple Disciplines | Discover, Transform & Transcend
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: "Advanced Mindfulness", color: "text-primary" },
              { icon: Heart, title: "Emotional Mastery", color: "text-accent" },
              { icon: Shield, title: "Mental Resilience", color: "text-secondary" },
              { icon: Users, title: "Leadership Skills", color: "text-primary" },
              { icon: Award, title: "Performance Optimization", color: "text-accent" },
              { icon: Globe, title: "Energy Management", color: "text-secondary" },
              { icon: BookOpen, title: "Cognitive Enhancement", color: "text-primary" },
              { icon: Star, title: "Spiritual Awakening", color: "text-accent" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
                <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Unique Points About Super Human Life Program
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Star, title: "5-Star Rated Program", desc: "Proven results from thousands of participants" },
              { icon: Shield, title: "100% Satisfaction Guarantee", desc: "Complete confidence in your transformation" },
              { icon: Video, title: "Direct Access to Master Coach", desc: "Personal guidance from world-class mentors" },
              { icon: Brain, title: "Advanced Cognitive Training", desc: "Unlock your brain's full potential" },
              { icon: Clock, title: "Flexible Self-Paced Learning", desc: "Transform at your own rhythm" },
              { icon: Headphones, title: "24/7 Personal Support", desc: "Dedicated guidance whenever you need it" },
              { icon: Globe, title: "Science-Based & Practical", desc: "Cutting-edge methods with real-world application" },
              { icon: Users, title: "Elite Community Access", desc: "Connect with high-performing individuals" }
            ].map((point, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <point.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2 text-card-foreground">{point.title}</h3>
                <p className="text-muted-foreground">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Transformed Lives Across the Globe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Countries</div>
              <div className="text-muted-foreground">Global Reach</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-accent mb-2">5000+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Certified Graduates</div>
              <div className="text-muted-foreground">Life Transformations</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Master Coaches</div>
              <div className="text-muted-foreground">Expert Guidance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Investment Details</h2>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                Super Human Life Transformation Program
              </h3>
              
              <div className="text-5xl font-bold text-primary mb-4">$497</div>
              <Badge variant="secondary" className="mb-6">100% Satisfaction Guarantee</Badge>
              
              <ul className="text-left space-y-3 mb-8">
                {[
                  "Self-Paced - Transform on your timeline",
                  "Weekly live sessions with Master Coach",
                  "Access to exclusive training materials",
                  "Advanced Learning Management System",
                  "Lifetime access to program content",
                  "24/7 Personal Success Coordinator",
                  "Direct consultation with Master Coach",
                  "Elite Super Human Community access",
                  "Real connections and accountability"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="w-full mb-4 bg-primary hover:bg-primary/90">
                Reserve Your Transformation Now
              </Button>
              
              <Button variant="outline" size="lg" className="w-full">
                Explore All Programs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Master Coach Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Meet Your Master Coach
          </h2>
          
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src={masterPortrait} 
                alt="Master Coach in meditation pose"
                className="w-80 h-80 mx-auto lg:mx-0 rounded-2xl shadow-2xl object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Master Coach Sarah Williams
              </h3>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Sarah Williams is a renowned transformation specialist and human potential expert with over 15 years 
                of experience in guiding individuals to their superhuman capabilities. Trained in advanced neuroscience, 
                consciousness studies, and peak performance methodologies, she has helped thousands unlock their 
                extraordinary potential.
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Sarah's unique, science-based approach combines ancient wisdom with cutting-edge research to create 
                profound and lasting transformations. Her modern and practical techniques help individuals recognize 
                their infinite potential and achieve unprecedented levels of success and fulfillment.
              </p>
              
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Schedule Free Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
            Super Human Life Program Structure
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
              The program follows a systematic approach through four levels of human optimization essential for 
              extraordinary living and peak performance. These levels encompass Physical Mastery, Mental Excellence, 
              Emotional Intelligence, and Spiritual Transcendence.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Mastery of advanced optimization techniques across all life dimensions",
                  icon: Award
                },
                {
                  title: "Enhanced self-awareness and unlimited potential activation",
                  icon: Brain
                },
                {
                  title: "Development of scientifically proven peak performance practices",
                  icon: Star
                },
                {
                  title: "Understanding the profound science behind human excellence",
                  icon: BookOpen
                },
                {
                  title: "Prevention of burnout through sustainable high-performance methods",
                  icon: Shield
                },
                {
                  title: "A transformative journey towards superhuman capabilities",
                  icon: Heart
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-card rounded-lg">
                  <item.icon className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <p className="text-card-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Unlock Your Super Human Potential?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands who have already transformed their lives and achieved extraordinary results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Transformation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Book Free Discovery Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuperHumanLifeProgram;