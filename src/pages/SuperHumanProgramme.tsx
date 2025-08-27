import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Globe, Users, Award, Calendar, Clock, Video, BookOpen, Headphones, Heart, Brain, Shield, Flower, Waves, Moon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import images
import meditationHero from '@/assets/meditation-hero.jpg';
import meditationCollage from '@/assets/meditation-collage.jpg';
import meditationInstructor from '@/assets/meditation-instructor.jpg';

const SuperHumanProgramme = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Super Human Programme
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Online Meditation Retreat for Inner Transformation
            </p>
            
            <div className="relative max-w-5xl mx-auto mb-8">
              <img 
                src={meditationHero} 
                alt="Serene meditation space with soft lighting, cushions, and peaceful atmosphere"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join our transformative online meditation retreat and discover the extraordinary power within you. 
                Through ancient wisdom combined with modern techniques, embark on a journey of profound inner 
                transformation that will awaken your superhuman potential and bring lasting peace to your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Transform Your Mind, Body & Soul
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Ancient Meditation Practices | Modern Mindfulness Techniques | Inner Peace Mastery
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Flower, title: "Deep Meditation", color: "text-primary" },
              { icon: Waves, title: "Breathwork Mastery", color: "text-accent" },
              { icon: Moon, title: "Mindful Awareness", color: "text-secondary" },
              { icon: Brain, title: "Mental Clarity", color: "text-primary" },
              { icon: Heart, title: "Emotional Balance", color: "text-accent" },
              { icon: Shield, title: "Stress Relief", color: "text-secondary" },
              { icon: Star, title: "Spiritual Growth", color: "text-primary" },
              { icon: Globe, title: "Universal Connection", color: "text-accent" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
                <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            What's Included in Your Retreat
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Video, title: "Live Meditation Sessions", desc: "Daily guided meditation practices with expert instructors" },
              { icon: BookOpen, title: "Sacred Teachings", desc: "Ancient wisdom texts and modern mindfulness principles" },
              { icon: Users, title: "Community Support", desc: "Connect with fellow seekers on the spiritual journey" },
              { icon: Headphones, title: "Audio Meditations", desc: "High-quality guided meditations for daily practice" },
              { icon: Calendar, title: "Flexible Schedule", desc: "Self-paced learning with live session options" },
              { icon: Award, title: "Completion Certificate", desc: "Recognized certification upon successful completion" },
              { icon: Clock, title: "Lifetime Access", desc: "Permanent access to all retreat materials and recordings" },
              { icon: Heart, title: "Personal Transformation", desc: "Deep healing and profound spiritual awakening" },
              { icon: Globe, title: "Global Community", desc: "Join practitioners from around the world" }
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2 text-card-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retreat Structure */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
            7-Day Meditation Retreat Journey
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
              Experience a carefully crafted journey of self-discovery through progressive meditation 
              practices, mindfulness techniques, and spiritual awakening exercises designed to unlock 
              your superhuman potential.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Foundation: Establishing Inner Peace",
                  desc: "Learn fundamental meditation postures, breathing techniques, and basic mindfulness practices",
                  days: "Days 1-2"
                },
                {
                  title: "Deepening: Advanced Techniques",
                  desc: "Explore deeper states of consciousness through advanced meditation and concentration practices",
                  days: "Days 3-4"
                },
                {
                  title: "Integration: Wisdom Application",
                  desc: "Apply mindfulness to daily life situations and develop sustainable spiritual practices",
                  days: "Days 5-6"
                },
                {
                  title: "Transformation: Superhuman Awakening", 
                  desc: "Experience profound states of awareness and establish your ongoing spiritual practice",
                  days: "Day 7"
                }
              ].map((phase, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                  <Badge variant="secondary" className="mb-3">{phase.days}</Badge>
                  <h3 className="font-bold text-lg mb-3 text-card-foreground">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Meet Your Meditation Guide
          </h2>
          
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src={meditationInstructor} 
                alt="Master meditation instructor in peaceful pose"
                className="w-80 h-80 mx-auto lg:mx-0 rounded-2xl shadow-2xl object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Master Serenity Chen
              </h3>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Master Serenity Chen is a renowned meditation teacher and spiritual guide with over 20 years 
                of experience in various contemplative traditions. Trained in Tibetan Buddhism, Zen meditation, 
                and modern mindfulness practices, she has guided thousands of practitioners toward inner peace 
                and spiritual awakening.
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Her compassionate and accessible teaching style combines ancient wisdom with practical 
                techniques suitable for modern life. Master Chen's retreats are known for creating profound 
                transformational experiences that awaken the superhuman potential within each participant.
              </p>
              
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Meet Your Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Retreat Investment</h2>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                Super Human Programme - Online Meditation Retreat
              </h3>
              
              <div className="text-5xl font-bold text-primary mb-4">$297</div>
              <Badge variant="secondary" className="mb-6">7-Day Transformation Journey</Badge>
              
              <ul className="text-left space-y-3 mb-8">
                {[
                  "7 days of guided meditation sessions",
                  "Daily live teachings with Master Chen",
                  "Sacred texts and spiritual resources",
                  "Audio meditation library access",
                  "Global community of practitioners",
                  "Personal transformation workbook",
                  "Lifetime access to all materials",
                  "Certificate of completion",
                  "Continued practice support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="w-full mb-4 bg-primary hover:bg-primary/90">
                Begin Your Transformation
              </Button>
              
              <Button variant="outline" size="lg" className="w-full">
                Learn More About the Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Stats */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Join Our Global Meditation Community
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Countries</div>
              <div className="text-muted-foreground">Global Reach</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-accent mb-2">2000+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Transformed Lives</div>
              <div className="text-muted-foreground">Inner Peace Achieved</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-secondary mb-2">98%</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Success Rate</div>
              <div className="text-muted-foreground">Lasting Transformation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Collage Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
            Your Transformation Journey
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <img 
              src={meditationCollage} 
              alt="Collage showing meditation practices, mindfulness activities, and spiritual growth"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
          
          <p className="text-center text-lg text-muted-foreground mt-8 max-w-3xl mx-auto">
            Experience the profound journey of self-discovery through meditation, mindfulness, and spiritual 
            practices that will unlock your superhuman potential and bring lasting inner peace.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Awaken Your Superhuman Potential?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join our transformative 7-day online meditation retreat and discover the extraordinary power within you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Journey Today
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Explore the Programme
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuperHumanProgramme;