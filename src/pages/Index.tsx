
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, MessageCircle, Phone, Users, Award, Clock, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import AstrologerCard from '@/components/AstrologerCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';

const Index = () => {
  const categoryData = [
    {
      icon: <span className="text-3xl">🔮</span>,
      title: "Astrology",
      description: "Explore your birth chart and understand your life path",
      href: "/services/astrology",
      color: "bg-astro-purple/10"
    },
    {
      icon: <span className="text-3xl">🃏</span>,
      title: "Tarot",
      description: "Discover insights through tarot card readings",
      href: "/services/tarot",
      color: "bg-astro-violet/10"
    },
    {
      icon: <span className="text-3xl">✋</span>,
      title: "Palmistry",
      description: "Uncover the secrets written in your palms",
      href: "/services/palmistry",
      color: "bg-astro-light-purple/10"
    },
    {
      icon: <span className="text-3xl">💫</span>,
      title: "Numerology",
      description: "Calculate your life path and destiny numbers",
      href: "/services/numerology",
      color: "bg-astro-midnight/10"
    },
    {
      icon: <span className="text-3xl">🔍</span>,
      title: "Vastu",
      description: "Harmonize your space for better energy flow",
      href: "/services/vastu",
      color: "bg-astro-deep-blue/10"
    },
    {
      icon: <span className="text-3xl">🌙</span>,
      title: "Kundli",
      description: "Get your detailed birth chart analysis",
      href: "/services/kundli",
      color: "bg-astro-gold/10"
    },
  ];

  const astrologerData = [
    {
      id: 1,
      name: "Acharya Raman",
      experience: 15,
      specialties: ["Vedic", "Palmistry", "Tarot"],
      rating: 4.9,
      consultations: 35000,
      price: 30,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2070&auto=format&fit=crop",
      online: true
    },
    {
      id: 2,
      name: "Maya Sharma",
      experience: 10,
      specialties: ["Numerology", "Tarot"],
      rating: 4.8,
      consultations: 18500,
      price: 25,
      waitTime: "5 min wait",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      online: true
    },
    {
      id: 3,
      name: "Guru Pranav",
      experience: 12,
      specialties: ["Kundli", "Horoscope"],
      rating: 4.7,
      consultations: 22800,
      price: 35,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop",
      online: true
    }
  ];

  const testimonialData = [
    {
      name: "Priya K.",
      location: "Mumbai",
      rating: 5,
      text: "The reading was incredibly accurate. The astrologer identified issues with my career that I hadn't shared. Their guidance helped me make a crucial decision.",
      date: "2 days ago",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "Rahul M.",
      location: "Delhi",
      rating: 5,
      text: "I was skeptical at first, but the predictions about my relationship were spot on. The remedies suggested have brought more harmony to my marriage.",
      date: "1 week ago",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "Anika S.",
      location: "Bangalore",
      rating: 4,
      text: "The consultation helped me understand my strengths better. I've applied the insights to my business and seen tangible improvements in just a month.",
      date: "2 weeks ago",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Services/Categories Section */}
        <section className="py-16 bg-gradient-to-b from-background to-astro-stardust/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Cosmic Services</h2>
              <p className="text-muted-foreground">
                Explore our range of astrology services designed to provide clarity
                and guidance in different areas of your life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Top Astrologers Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-stars pointer-events-none"></div>
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Top Astrologers</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Connect with our highly-rated, verified astrologers for a personalized consultation.
                </p>
              </div>
              <Link to="/astrologers">
                <Button variant="outline" className="border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologerData.map((astrologer) => (
                <AstrologerCard key={astrologer.id} {...astrologer} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gradient-to-b from-astro-deep-blue to-astro-midnight text-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose AstroTalk</h2>
              <p className="text-astro-stardust/80">
                We've helped over 2 million people find cosmic clarity through verified astrologers and personalized readings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-astro-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-astro-light-purple" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Verified Experts</h3>
                <p className="text-astro-stardust/70 text-sm">
                  All our astrologers are verified professionals with years of experience.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-astro-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-astro-light-purple" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Accurate Readings</h3>
                <p className="text-astro-stardust/70 text-sm">
                  Our astrologers provide insights with over 94% accuracy and satisfaction.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-astro-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-astro-light-purple" />
                </div>
                <h3 className="font-semibold text-xl mb-2">24/7 Availability</h3>
                <p className="text-astro-stardust/70 text-sm">
                  Get guidance anytime with our astrologers available round the clock.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-astro-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-astro-light-purple" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Private & Secure</h3>
                <p className="text-astro-stardust/70 text-sm">
                  Your consultations and personal details are kept 100% confidential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground">
                Hear from people who have found guidance and clarity through our astrology services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialData.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-astro-purple to-astro-violet text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready for Cosmic Guidance?</h2>
              <p className="text-lg mb-8">
                Connect with our expert astrologers now and get answers to your most pressing questions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-astro-purple hover:bg-astro-stardust transition-colors text-lg py-6 px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to Astrologer
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/20 transition-colors text-lg py-6 px-8">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
