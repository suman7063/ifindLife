
import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { ArrowDown, Brain, HeartPulse, Leaf, MessageCircle, Sparkles } from 'lucide-react';

// Data for each service with icons and images
const servicesData = [
  {
    id: "therapy-sessions",
    title: "Therapy Sessions",
    description: "Professional therapy sessions to help you navigate life's challenges, manage mental health concerns, and enhance personal growth.",
    detailedDescription: "Our therapy sessions provide a safe, confidential space where you can explore your thoughts and feelings with a licensed professional. Using evidence-based approaches tailored to your unique needs, our therapists help you develop coping strategies, process difficult emotions, and work toward meaningful change.",
    icon: <HeartPulse className="h-16 w-16 mb-4 text-ifind-teal" />,
    image: "/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png",
    color: "bg-ifind-teal",
    textColor: "text-ifind-teal",
    borderColor: "border-ifind-teal"
  },
  {
    id: "guided-meditations",
    title: "Guided Meditations",
    description: "Expertly led meditation sessions to reduce stress, increase mindfulness, and cultivate inner peace and mental clarity.",
    detailedDescription: "Our guided meditation sessions help you cultivate mindfulness, reduce stress, and enhance overall well-being. Led by experienced meditation instructors, these sessions combine breathing techniques, visualization, and mindfulness practices to quiet the mind and bring awareness to the present moment.",
    icon: <Brain className="h-16 w-16 mb-4 text-ifind-purple" />,
    image: "/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png",
    color: "bg-ifind-purple",
    textColor: "text-ifind-purple",
    borderColor: "border-ifind-purple"
  },
  {
    id: "mindful-listening",
    title: "Mindful Listening",
    description: "A unique space where you can express yourself freely while being deeply heard without judgment or interruption.",
    detailedDescription: "Our Mindful Listening service provides a unique opportunity to be truly heard in a non-judgmental, supportive environment. Unlike traditional therapy, the focus is entirely on giving you space to express yourself without interruption or advice-giving.",
    icon: <MessageCircle className="h-16 w-16 mb-4 text-ifind-lavender" />,
    image: "/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png",
    color: "bg-ifind-lavender",
    textColor: "text-ifind-lavender",
    borderColor: "border-ifind-lavender"
  },
  {
    id: "offline-retreats",
    title: "Offline Retreats",
    description: "Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.",
    detailedDescription: "Our Offline Retreats offer a rare opportunity to disconnect from digital distractions and reconnect with yourself, nature, and authentic human connection. Set in carefully selected natural environments, these immersive experiences combine mindfulness practices, nature therapy, creative expression, and community building.",
    icon: <Leaf className="h-16 w-16 mb-4 text-ifind-yellow" />,
    image: "/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png",
    color: "bg-ifind-yellow",
    textColor: "text-ifind-yellow",
    borderColor: "border-ifind-yellow"
  },
  {
    id: "life-coaching",
    title: "Life Coaching",
    description: "Goal-oriented coaching to help you clarify your vision, overcome obstacles, and achieve personal and professional success.",
    detailedDescription: "Our Life Coaching service helps you bridge the gap between where you are now and where you want to be. Working with a certified coach, you'll clarify your vision, identify obstacles, and develop actionable strategies to achieve your personal and professional goals.",
    icon: <Sparkles className="h-16 w-16 mb-4 text-ifind-pink" />,
    image: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    color: "bg-ifind-pink",
    textColor: "text-ifind-pink",
    borderColor: "border-ifind-pink"
  }
];

const Services = () => {
  // References for scrolling to sections
  const servicesRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to services section
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive mental wellness services tailored to your unique needs and journey.
              </p>
              
              {/* Service Navigation Menu */}
              <div className="flex justify-center mb-8">
                <NavigationMenu>
                  <NavigationMenuList className="flex flex-wrap justify-center gap-2">
                    {servicesData.map((service) => (
                      <NavigationMenuItem key={service.id}>
                        <NavigationMenuLink 
                          className={cn(navigationMenuTriggerStyle(), `text-white ${service.color}`)}
                          href={`#${service.id}`}
                        >
                          {service.title}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              
              <Button onClick={scrollToServices} variant="outline" className="mt-4 animate-bounce">
                <ArrowDown className="mr-2 h-4 w-4" /> Explore Our Services
              </Button>
            </div>
            
            <div ref={servicesRef} className="space-y-24">
              {servicesData.map((service, index) => (
                <section 
                  key={service.id} 
                  id={service.id} 
                  className={`scroll-mt-24 ${index % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-900 py-8 rounded-xl'}`}
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                    <div className="md:w-1/2">
                      <div className={`${service.color} p-4 rounded-xl overflow-hidden h-80`}>
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover mix-blend-overlay opacity-80 rounded-lg" 
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 space-y-4">
                      <div className="flex flex-col items-center md:items-start">
                        {service.icon}
                        <h2 className={`text-3xl font-bold ${service.textColor}`}>{service.title}</h2>
                      </div>
                      
                      <p className="text-lg text-gray-700 dark:text-gray-300">{service.description}</p>
                      <p className="text-gray-600 dark:text-gray-400">{service.detailedDescription}</p>
                      
                      <div className="pt-4">
                        <Button asChild className={`${service.color} hover:${service.color}/90`}>
                          <Link to={`/services/${service.id}`}>Learn More</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-ifind-lavender/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Services?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-teal">
                <div className="w-12 h-12 bg-ifind-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Practitioners</h3>
                <p className="text-gray-600 dark:text-gray-300">Qualified professionals with extensive experience and a passion for helping others.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-purple">
                <div className="w-12 h-12 bg-ifind-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Approach</h3>
                <p className="text-gray-600 dark:text-gray-300">Tailored solutions designed to meet your unique needs and wellness goals.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-pink">
                <div className="w-12 h-12 bg-ifind-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-300">Convenient appointment times that work with your busy lifestyle.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
