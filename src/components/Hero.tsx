
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCall, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-stars pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-astro-light-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-astro-violet/10 rounded-full blur-3xl"></div>
      
      <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col space-y-6 max-w-xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-astro-stardust border-astro-purple/40 text-astro-purple">
            <Star className="mr-1 h-3 w-3 fill-astro-gold text-astro-gold" />
            <span>4.8/5 from 35k+ consultations</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Discover Your</span>
            <span className="text-gradient">Cosmic Journey</span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Connect with verified astrologers for personalized readings about your career, relationships, and life path. Get guidance when you need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-astro-purple hover:bg-astro-violet text-white px-6 py-6 text-lg rounded-full shadow-lg shadow-astro-purple/25 hover:shadow-astro-violet/25 transition-all">
              <PhoneCall className="mr-2 h-5 w-5" />
              Talk to Astrologer
            </Button>
            <Button variant="outline" className="border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white px-6 py-6 text-lg rounded-full">
              Get Daily Horoscope
            </Button>
          </div>
          
          <div className="flex items-center pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-astro-stardust flex items-center justify-center text-xs font-medium">
                  {String.fromCodePoint(0x1F30C + i)}
                </div>
              ))}
            </div>
            <span className="ml-3 text-sm font-medium">
              Join 2M+ people finding cosmic clarity
            </span>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-br from-astro-stardust to-white p-1 rounded-2xl shadow-xl">
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="bg-astro-purple/10 p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-astro-purple to-astro-violet rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">♈</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Your Cosmic Compatibility</h3>
              <div className="grid grid-cols-4 gap-4 w-full max-w-sm my-4">
                {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((sign, i) => (
                  <div key={i} className="h-12 w-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl hover:bg-astro-stardust cursor-pointer transition-colors">
                    {sign}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-astro-purple hover:bg-astro-violet">
                Check Compatibility
              </Button>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">Popular Questions</h3>
              <div className="space-y-3">
                {[
                  "When will I find my soulmate?",
                  "Is this the right career for me?",
                  "What does my future hold?",
                  "How can I improve my finances?"
                ].map((q, i) => (
                  <Link key={i} to="/astrologers" className="flex items-center justify-between p-3 rounded-lg hover:bg-astro-stardust/50 transition-colors">
                    <span>{q}</span>
                    <ChevronRight className="h-4 w-4 text-astro-purple" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
