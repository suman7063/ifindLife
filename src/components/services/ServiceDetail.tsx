
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, Users, Award, Heart, ShieldCheck } from 'lucide-react';
import InquiryForm from './InquiryForm';
import { useUserAuth } from '@/contexts/UserAuthContext';

// Define service data structure
interface ServiceData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  features: string[];
  duration: string;
  format: string;
  price: string;
  color: string;
}

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const { currentUser, isAuthenticated } = useUserAuth();
  
  // Service data mapping
  const serviceData: Record<string, ServiceData> = {
    "therapy-sessions": {
      id: "therapy-sessions",
      title: "Therapy Sessions",
      description: "Our therapy sessions provide a safe, confidential space for you to explore your thoughts, feelings, and challenges with a trained professional. Whether you're dealing with anxiety, depression, relationship issues, or just need someone to talk to, our therapists are here to support your mental health journey. We offer both in-person and online sessions to accommodate your preferences and schedule.",
      imageUrl: "/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png",
      benefits: [
        "Develop coping strategies for managing stress and anxiety",
        "Gain insights into your thoughts, feelings, and behaviors",
        "Improve your relationships and communication skills",
        "Build self-esteem and self-awareness",
        "Find solutions to specific problems you're facing"
      ],
      features: [
        "One-on-one sessions with a licensed therapist",
        "Personalized treatment plans",
        "Evidence-based therapeutic approaches",
        "Flexible scheduling options",
        "Virtual or in-person sessions"
      ],
      duration: "50 minutes",
      format: "Individual, Couples, or Family",
      price: "Starting at $80 per session",
      color: "bg-ifind-teal"
    },
    "guided-meditations": {
      id: "guided-meditations",
      title: "Guided Meditations",
      description: "Experience the transformative power of mindfulness with our guided meditation sessions. Led by experienced meditation instructors, these sessions will help you cultivate present-moment awareness, reduce stress, and develop a deeper connection with yourself. Suitable for beginners and experienced practitioners alike, our guided meditations offer a path to inner peace and mental clarity in today's busy world.",
      imageUrl: "/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png",
      benefits: [
        "Reduce stress and anxiety",
        "Improve focus and concentration",
        "Enhance emotional well-being",
        "Promote better sleep",
        "Develop mindfulness skills for everyday life"
      ],
      features: [
        "Expert instruction from experienced meditation guides",
        "Various meditation techniques (breath awareness, body scan, loving-kindness)",
        "Small group sizes for personalized attention",
        "Suitable for all experience levels",
        "Digital recordings available for home practice"
      ],
      duration: "30-45 minutes",
      format: "Group or Private",
      price: "Starting at $15 per session",
      color: "bg-ifind-purple"
    },
    "mindful-listening": {
      id: "mindful-listening",
      title: "Mindful Listening",
      description: "Our Mindful Listening service provides a unique opportunity to be truly heard without judgment or interruption. Unlike traditional therapy, these sessions focus entirely on giving you space to express yourself freely while our trained listeners practice deep, attentive listening. This process can help clarify your thoughts, process emotions, and gain new perspectives simply through the act of voicing your experiences to someone fully present with you.",
      imageUrl: "/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png",
      benefits: [
        "Experience being fully heard without judgment",
        "Clarify your thoughts through verbalization",
        "Process emotions in a safe, supportive environment",
        "Reduce feelings of isolation and disconnection",
        "Gain clarity without advice or intervention"
      ],
      features: [
        "Non-directive, non-judgmental listening",
        "Confidential and respectful environment",
        "No advice or solutions—just attentive presence",
        "Flexible session duration based on your needs",
        "Available in-person or online"
      ],
      duration: "30-60 minutes",
      format: "One-on-One",
      price: "Starting at $40 per session",
      color: "bg-ifind-lavender"
    },
    "offline-retreats": {
      id: "offline-retreats",
      title: "Offline Retreats",
      description: "Disconnect to reconnect with our immersive offline retreats. These carefully curated experiences provide an opportunity to step away from digital distractions and daily pressures to focus on your wellbeing. Set in peaceful, natural environments, our retreats combine mindfulness practices, wellness activities, and community connection to help you reset, recharge, and return to your life with renewed clarity and purpose.",
      imageUrl: "/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png",
      benefits: [
        "Digital detox in a supportive environment",
        "Reconnect with nature and yourself",
        "Learn sustainable wellbeing practices",
        "Build meaningful connections with like-minded people",
        "Return home refreshed with new perspectives"
      ],
      features: [
        "Comfortable accommodations in natural settings",
        "Nutritious, balanced meals",
        "Diverse program of mindfulness and wellness activities",
        "Small groups for personalized attention",
        "Expert facilitators and wellness professionals"
      ],
      duration: "2-7 days",
      format: "Group Retreat",
      price: "Starting at $350 per person",
      color: "bg-ifind-yellow"
    },
    "life-coaching": {
      id: "life-coaching",
      title: "Life Coaching",
      description: "Our life coaching service empowers you to bridge the gap between where you are now and where you want to be. Working with a professional coach, you'll clarify your goals, identify obstacles, and develop actionable strategies to create positive change. Unlike therapy, coaching focuses on future-oriented growth and specific outcomes, helping you unlock your potential and create a more fulfilling life aligned with your values and aspirations.",
      imageUrl: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
      benefits: [
        "Gain clarity on your goals and purpose",
        "Develop strategies to overcome obstacles",
        "Increase self-confidence and motivation",
        "Improve work-life balance",
        "Accelerate personal and professional growth"
      ],
      features: [
        "Structured, goal-oriented approach",
        "Accountability partnerships",
        "Personalized action plans",
        "Regular progress assessments",
        "Flexible scheduling to fit your lifestyle"
      ],
      duration: "45-60 minutes",
      format: "Individual",
      price: "Starting at $95 per session",
      color: "bg-ifind-pink"
    }
  };
  
  // Get the current service data
  const service = serviceId ? serviceData[serviceId] : null;
  
  // Handle missing service
  if (!service) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="mb-8">The service you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <a href="/services">Return to Services</a>
        </Button>
      </div>
    );
  }
  
  const handleInquire = () => {
    setShowInquiryForm(true);
  };
  
  const handleInquirySuccess = () => {
    setShowInquiryForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {showInquiryForm ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Inquire about {service.title}</h2>
            <InquiryForm 
              serviceName={service.title}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              onSuccess={handleInquirySuccess}
            />
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="md:w-1/2">
              <div className={`w-full h-72 rounded-lg overflow-hidden ${service.color}`}>
                <img 
                  src={service.imageUrl} 
                  alt={service.title}
                  className="w-full h-full object-cover object-center mix-blend-overlay opacity-80" 
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-ifind-teal" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-ifind-purple" />
                  <span>{service.format}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-1 text-ifind-pink" />
                  <span>Flexible Scheduling</span>
                </div>
              </div>
              <div className="mb-6">
                <span className="font-semibold">{service.price}</span>
              </div>
              <Button onClick={handleInquire} size="lg" className="bg-ifind-purple hover:bg-ifind-purple/90">
                Inquire Now
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Benefits
              </h2>
              <ul className="space-y-2">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-ifind-teal mr-2">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-ifind-teal" />
                Features
              </h2>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-ifind-purple mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={handleInquire} size="lg" className="bg-ifind-purple hover:bg-ifind-purple/90">
              Book Your {service.title} Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
