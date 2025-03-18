
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
      icon: <span className="text-3xl">🧠</span>,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      href: "/services/quickease",
      color: "bg-ifind-aqua/10"
    },
    {
      icon: <span className="text-3xl">🌱</span>,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      href: "/services/resilience",
      color: "bg-ifind-purple/10"
    },
    {
      icon: <span className="text-3xl">✨</span>,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      href: "/services/superhuman",
      color: "bg-ifind-teal/10"
    },
    {
      icon: <span className="text-3xl">🔄</span>,
      title: "Stress Management",
      description: "Effective techniques to reduce and manage daily stress",
      href: "/services/stress",
      color: "bg-ifind-charcoal/10"
    },
    {
      icon: <span className="text-3xl">💭</span>,
      title: "Mindfulness",
      description: "Present-moment awareness practices for mental clarity",
      href: "/services/mindfulness",
      color: "bg-ifind-aqua/10"
    },
    {
      icon: <span className="text-3xl">🌟</span>,
      title: "Personal Growth",
      description: "Holistic approaches to self-improvement and fulfillment",
      href: "/services/growth",
      color: "bg-ifind-purple/10"
    },
  ];

  const therapistData = [
    {
      id: 1,
      name: "Dr. Raman Sharma",
      experience: 15,
      specialties: ["Anxiety", "Depression", "CBT"],
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
      specialties: ["Trauma", "EMDR"],
      rating: 4.8,
      consultations: 18500,
      price: 25,
      waitTime: "5 min wait",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      online: true
    },
    {
      id: 3,
      name: "Dr. Pranav Gupta",
      experience: 12,
      specialties: ["Stress", "Mindfulness"],
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
        <section className="py-16 bg-gradient-to-b from-background to-ifind-offwhite/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Mental & Emotional Wellness Solutions</h2>
              <p className="text-muted-foreground">
                Explore our range of mental wellness services designed to provide clarity
                and guidance for your emotional well-being and personal growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Top Therapists Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Top Mental Wellness Experts</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Connect with our highly-rated, verified therapists for a personalized consultation.
                </p>
              </div>
              <Link to="/therapists">
                <Button variant="outline" className="border-ifind-purple text-ifind-purple hover:bg-ifind-purple hover:text-white">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapistData.map((therapist) => (
                <AstrologerCard key={therapist.id} {...therapist} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gradient-to-b from-ifind-charcoal to-ifind-charcoal/90 text-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose iFindLife</h2>
              <p className="text-ifind-offwhite/80">
                We've helped over 2 million people find mental clarity through verified mental wellness experts and personalized guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-ifind-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-ifind-aqua" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Verified Experts</h3>
                <p className="text-ifind-offwhite/70 text-sm">
                  All our therapists are verified professionals with years of experience.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-ifind-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-ifind-aqua" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Evidence-Based</h3>
                <p className="text-ifind-offwhite/70 text-sm">
                  Our therapists provide insights with scientifically proven methods and approaches.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-ifind-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-ifind-aqua" />
                </div>
                <h3 className="font-semibold text-xl mb-2">24/7 Availability</h3>
                <p className="text-ifind-offwhite/70 text-sm">
                  Get guidance anytime with our mental wellness experts available round the clock.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg text-center hover:bg-white/10 transition-colors">
                <div className="bg-ifind-purple/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-ifind-aqua" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Private & Secure</h3>
                <p className="text-ifind-offwhite/70 text-sm">
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
                Hear from people who have found guidance and clarity through our mental wellness services.
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
        <section className="py-16 bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready for Mental Wellness Support?</h2>
              <p className="text-lg mb-8">
                Connect with our expert therapists now and get help with your mental and emotional challenges.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to a Therapist
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/20 transition-colors text-lg py-6 px-8">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Video Consultation
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
