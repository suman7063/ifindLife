
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import TopTherapistsSection from '@/components/TopTherapistsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Users, Award, Clock, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Services/Categories Section */}
        <ServicesSection />

        {/* Top Therapists Section */}
        <TopTherapistsSection />

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
        <TestimonialsSection />

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
