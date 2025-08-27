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
              Online Comprehensive Mindfulness Meditation Transformation Retreat
            </p>
            
            <div className="relative max-w-5xl mx-auto mb-8">
              <img 
                src={meditationHero} 
                alt="Online meditation retreat comprehensive mindfulness transformation"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Namaste🙏 Welcome to our Online comprehensive mindfulness meditation transformation retreat! 
                Embark on a virtual journey of self-discovery and inner peace like never before. Our transformative 
                program brings the serenity of a retreat to your doorstep, guiding you towards personal growth and 
                holistic well-being. Join our community of like-minded souls and unlock your true potential from 
                the comfort of your own space. Begin your transformative adventure today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Enhance Your Spiritual Being & Change Lives
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Learn Meditations From Different Traditions | Discover, Transform And Elevate
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Flower, title: "Mindfulness", color: "text-primary" },
              { icon: Waves, title: "Breathwork", color: "text-accent" },
              { icon: Heart, title: "7 Chakra Healing Therapy", color: "text-secondary" },
              { icon: Moon, title: "Yoga Nidra Master Training", color: "text-primary" },
              { icon: Star, title: "Sufi", color: "text-accent" },
              { icon: Brain, title: "Meditation from Lord Shiva", color: "text-secondary" },
              { icon: Headphones, title: "Sound / Nada", color: "text-primary" },
              { icon: Globe, title: "Nature 5 Elements", color: "text-accent" },
              { icon: Heart, title: "Happiness Module", color: "text-secondary" },
              { icon: BookOpen, title: "Buddhist", color: "text-primary" },
              { icon: Users, title: "Yogic", color: "text-accent" },
              { icon: Award, title: "Mantra", color: "text-secondary" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
                <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Points */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Unique Points About Our Super Human Programme
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Star, title: "Google 5-star rated program", desc: "Highly rated by thousands of satisfied students worldwide" },
              { icon: Shield, title: "100% money back guarantee", desc: "Complete confidence in our transformational program" },
              { icon: Users, title: "Direct call support from master", desc: "Personal guidance directly from Master Dev OM" },
              { icon: Brain, title: "Experience Deeper State of Meditation", desc: "Achieve profound meditative states with proven techniques" },
              { icon: Calendar, title: "Flexible: Self paced retreat", desc: "Learn at your own pace with lifetime access" },
              { icon: Heart, title: "Inbuilt free personal guidance", desc: "24x7 personal student coordinator support" },
              { icon: BookOpen, title: "Non religious & practical learning", desc: "Modern approach suitable for all backgrounds" },
              { icon: Globe, title: "Experience real group energy in online retreat", desc: "Connect with global community of practitioners" },
              { icon: Award, title: "Worldwide Retreat Certification", desc: "Internationally recognized certification upon completion" }
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
            Mindfulness Meditation Retreat Structure
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
              The retreat follows a structured path through four levels of mindfulness and awareness essential 
              for a fulfilling life and spiritual growth. These levels encompass Physical, Mental, Emotional, 
              and Spiritual aspects. At each level, we delve into science and philosophy, engage in various 
              activities and exercises, and practice active, passive, and guided meditations before progressing 
              to the next stage.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Physical Level",
                  desc: "Mastery of mindfulness techniques across physical awareness with breathing and body-based practices",
                  level: "Level 1"
                },
                {
                  title: "Mental Level",
                  desc: "Enhanced self-awareness and mental clarity through structured activities and concentration meditations",
                  level: "Level 2"
                },
                {
                  title: "Emotional Level",
                  desc: "Development of emotional intelligence and healing through heart-centered practices and chakra work",
                  level: "Level 3"
                },
                {
                  title: "Spiritual Level", 
                  desc: "Understanding profound science and philosophy behind mindfulness for spiritual enlightenment",
                  level: "Level 4"
                }
              ].map((phase, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                  <Badge variant="secondary" className="mb-3">{phase.level}</Badge>
                  <h3 className="font-bold text-lg mb-3 text-card-foreground">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-card-foreground">What You'll Receive:</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Meditation Scripts with music
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Three books by Master Dev OM
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Master's Music Library
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Authentic heartful teachings
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Lifelong group support
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  Complete practice process
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Know Your Mentor - Master Dev OM
          </h2>
          
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src={meditationInstructor} 
                alt="Master Dev OM - Himalayan yogi and spiritual guide"
                className="w-80 h-80 mx-auto lg:mx-0 rounded-2xl shadow-2xl object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Master Dev OM
              </h3>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Dev OM, a Himalayan yogi and spiritual guide from India is trained directly from Thich-Nhat-Hanh, 
                Dalai Lama, and Mother Teresa in mindfulness and spirituality. He has learned various therapies 
                and has also received spiritual development in the ashrams of Maharshi Ramana and Osho.
              </p>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Dev OM has identified and structured self-discovery tools to address all aspects of human 
                consciousness: spiritual, emotional & mental. He is an internationally acclaimed best-seller 
                author of 12 spiritual and self-help books.
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Since two decades, Dev OM's path as a Spiritual Guide & Mentor and as an Enhanced Life Coach 
                has assisted thousands of people all over the world to discover their spiritual & life path. 
                His modern and practical techniques involve recognizing one's full and true potential of creative 
                powers for personal growth and self-evolution.
              </p>
              
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Book a Free Discovery Call
              </Button>
            </div>
          </div>
          
          {/* Master's Credentials */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Why Learn from Master Dev OM?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Trained directly with Dalai Lama, Thich-Nhat-Hanh & Mother Teresa",
                "Lived in Himalayan isolation for 6 years in deep meditation",
                "Author of 12 spiritual books (4 Amazon bestsellers)",
                "Given mindfulness talks in 36+ countries",
                "Creator of 50+ guided meditations",
                "Lived in ashrams of Maharshi Ramana and Osho",
                "Non-traditional modern meditation master",
                "Rich experience in different cultures worldwide",
                "Dedicated life to spreading meditation globally"
              ].map((credential, index) => (
                <div key={index} className="flex items-start bg-card p-4 rounded-lg">
                  <Star className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-card-foreground">{credential}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Fee Details</h2>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                Online Comprehensive Mindfulness Meditation Transformation Retreat
              </h3>
              
              <div className="text-5xl font-bold text-primary mb-4">€499</div>
              <Badge variant="secondary" className="mb-6">100% Money Back Guarantee, Part Payment Option Available</Badge>
              
              <ul className="text-left space-y-3 mb-8">
                {[
                  "Self-Paced - Start & Do it in your own time",
                  "Bimonthly students group Zoom Call with Master",
                  "Learn through Rishikesh training real classes videos",
                  "Advance Learning Management System",
                  "Lifetime Access to study Material",
                  "Personal Student Coordinator for 24x7 support",
                  "Direct Call Support with Master Dev OM (A unique point)",
                  "Participation in Global Conscious Community",
                  "Real connections even in online training"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="w-full mb-4 bg-primary hover:bg-primary/90">
                Book Your Spot Now
              </Button>
              
              <Button variant="outline" size="lg" className="w-full">
                Book a Free Discovery Call with Master Dev OM
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Stats */}
      <section className="py-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
            Soulversity Global Footprint
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Transformed and Happy Students turned Self Sufficient Meditators from around the World
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Countries</div>
              <div className="text-muted-foreground">Global Reach</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-accent mb-2">1200+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Certified Meditation Trainers</div>
              <div className="text-muted-foreground">Expert Practitioners</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-secondary mb-2">800+</div>
              <div className="text-lg text-card-foreground font-semibold mb-1">Mindfulness Coaches</div>
              <div className="text-muted-foreground">Trained Professionals</div>
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