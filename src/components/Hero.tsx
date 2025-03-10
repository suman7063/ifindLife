
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCall, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

const Hero = () => {
  const [volume, setVolume] = React.useState([70]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-ifind-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-ifind-aqua/10 rounded-full blur-3xl"></div>
      
      <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col space-y-6 max-w-xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-ifind-offwhite border-ifind-aqua/40 text-ifind-aqua">
            <Star className="mr-1 h-3 w-3 fill-ifind-aqua text-ifind-aqua" />
            <span>4.8/5 from 35k+ consultations</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Discover Your</span>
            <span className="text-gradient">Mental Wellness</span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Connect with verified mental health experts for personalized guidance about your emotional well-being, relationships, and personal growth. Get support when you need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white px-6 py-6 text-lg rounded-full shadow-lg shadow-ifind-aqua/25 hover:shadow-ifind-teal/25 transition-all">
              <PhoneCall className="mr-2 h-5 w-5" />
              Talk to a Therapist
            </Button>
            <Button variant="outline" className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white px-6 py-6 text-lg rounded-full">
              Free Mental Health Assessment
            </Button>
          </div>
          
          <div className="flex items-center pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-ifind-offwhite flex items-center justify-center text-xs font-medium">
                  {['🧠', '💭', '🌱', '✨'][i-1]}
                </div>
              ))}
            </div>
            <span className="ml-3 text-sm font-medium">
              Join 2M+ people finding emotional balance
            </span>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-br from-ifind-offwhite to-white p-4 rounded-2xl shadow-xl">
          <div className="bg-black rounded-xl overflow-hidden aspect-video mb-4">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/rUJFj6yLWSw?autoplay=0"
              title="Empowering Mental Wellness Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h3 className="font-semibold text-lg mb-3">Set Your Motivation Level</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">🔈</span>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">🔊</span>
            </div>
            <div className="mt-3 text-center text-sm text-muted-foreground">
              Adjust the slider to control your journey's intensity
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
