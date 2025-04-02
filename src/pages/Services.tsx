
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Headphones, Map, Compass } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      id: 'therapy-sessions',
      title: 'Therapy Sessions',
      description: 'One-on-one sessions with licensed therapists tailored to your specific needs, helping you navigate through life challenges with professional guidance.',
      icon: <Heart className="h-16 w-16 md:h-24 md:w-24 text-ifind-purple" />,
      details: 'Our therapy sessions provide a safe, confidential space where you can openly discuss your concerns with a qualified professional. Whether you're dealing with anxiety, depression, relationship issues, or simply seeking personal growth, our therapists employ evidence-based approaches to help you develop insights and coping strategies.'
    },
    {
      id: 'guided-meditations',
      title: 'Guided Meditations',
      description: 'Expertly crafted meditation sessions designed to reduce stress, enhance focus, and promote overall mental wellbeing through mindfulness practices.',
      icon: <Brain className="h-16 w-16 md:h-24 md:w-24 text-ifind-teal" />,
      details: 'Our guided meditation sessions are designed for all experience levels, from beginners to advanced practitioners. Led by experienced meditation guides, these sessions incorporate various techniques including mindfulness, breath awareness, visualization, and progressive relaxation to help you cultivate inner peace and enhance your mental clarity.'
    },
    {
      id: 'mindful-listening',
      title: 'Mindful Listening',
      description: 'A unique service where trained professionals provide dedicated attention to your thoughts and feelings without judgment, fostering emotional relief.',
      icon: <Headphones className="h-16 w-16 md:h-24 md:w-24 text-ifind-aqua" />,
      details: 'Mindful listening offers a unique space where you can express yourself fully while being truly heard. Unlike traditional therapy, the focus is entirely on allowing you to verbalize your thoughts and feelings with a compassionate listener who provides their complete, non-judgmental attention without offering solutions or advice unless requested.'
    },
    {
      id: 'offline-retreats',
      title: 'Offline Retreats',
      description: 'Immersive in-person experiences in serene locations designed to disconnect from digital distractions and reconnect with your inner self.',
      icon: <Map className="h-16 w-16 md:h-24 md:w-24 text-orange-500" />,
      details: 'Our offline retreats take place in carefully selected, peaceful environments where you can temporarily step away from the demands of everyday life and technology. These retreats combine various wellness practices including meditation, yoga, nature walks, creative expression, and group sharing circles to facilitate deep personal reflection and renewal.'
    },
    {
      id: 'life-coaching',
      title: 'Life Coaching',
      description: 'Goal-oriented guidance to help you identify objectives, overcome obstacles, and create actionable strategies for personal and professional growth.',
      icon: <Compass className="h-16 w-16 md:h-24 md:w-24 text-purple-500" />,
      details: 'Life coaching is a collaborative process focused on helping you clarify your vision, set meaningful goals, and develop effective strategies to achieve them. Our certified coaches employ powerful questioning techniques and accountability structures to help you navigate transitions, overcome limiting beliefs, and maximize your potential in career, relationships, health, or personal development.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-ifind-purple/10 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Our Mental Wellness Services</h1>
            <p className="text-lg text-gray-700">
              At iFindLife, we offer a comprehensive range of services designed to support your journey to mental wellbeing. 
              Each service is delivered by qualified professionals committed to providing personalized care tailored to your unique needs.
            </p>
          </div>

          <div className="space-y-24 mb-16">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="flex-1 flex justify-center">
                  <div className={`rounded-full p-6 ${
                    service.id === 'therapy-sessions' ? 'bg-ifind-purple/10' :
                    service.id === 'guided-meditations' ? 'bg-ifind-teal/10' :
                    service.id === 'mindful-listening' ? 'bg-ifind-aqua/10' :
                    service.id === 'offline-retreats' ? 'bg-orange-500/10' :
                    'bg-purple-500/10'
                  }`}>
                    {service.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <p className="text-gray-600 mb-6">{service.details}</p>
                  <Button 
                    asChild
                    className={`
                      ${service.id === 'therapy-sessions' ? 'bg-ifind-purple hover:bg-ifind-purple/90' :
                        service.id === 'guided-meditations' ? 'bg-ifind-teal hover:bg-ifind-teal/90' :
                        service.id === 'mindful-listening' ? 'bg-ifind-aqua hover:bg-ifind-aqua/90' :
                        service.id === 'offline-retreats' ? 'bg-orange-500 hover:bg-orange-500/90' :
                        'bg-purple-500 hover:bg-purple-500/90'
                      }
                    `}
                  >
                    <Link to={`/services/${service.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-ifind-purple/10 rounded-lg shadow-md p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Not Sure What You Need?</h2>
            <p className="text-gray-700 mb-6">
              We understand that finding the right support can be overwhelming. Our team is here to help you 
              determine which services might be most beneficial for your specific situation.
            </p>
            <Button asChild className="bg-ifind-purple hover:bg-ifind-purple/90">
              <Link to="/mental-health-assessment">
                Take Our Free Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
