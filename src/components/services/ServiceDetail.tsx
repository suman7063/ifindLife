
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import InquiryForm from './InquiryForm';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Service data with detailed descriptions
const servicesData = [
  {
    id: "therapy-sessions",
    title: "Therapy Sessions",
    description: "Professional therapy sessions to help you navigate life's challenges, manage mental health concerns, and enhance personal growth.",
    image: "/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png",
    color: "bg-ifind-teal",
    detailedDescription: "Our therapy sessions provide a safe, confidential space where you can explore your thoughts and feelings with a licensed professional. Using evidence-based approaches tailored to your unique needs, our therapists help you develop coping strategies, process difficult emotions, and work toward meaningful change. Sessions can address various concerns including anxiety, depression, relationship issues, trauma, and personal growth.",
    benefits: [
      "Personalized treatment plans designed for your specific needs",
      "Evidence-based therapeutic techniques and approaches",
      "Convenient scheduling with both in-person and virtual options",
      "Compassionate, non-judgmental support from experienced professionals",
      "Practical strategies to implement in your daily life"
    ],
    duration: "50-minute sessions",
    process: "Begin with an initial assessment to determine your goals and create a personalized treatment plan. Followed by regular sessions where you'll work collaboratively with your therapist to address concerns and develop strategies for improvement."
  },
  {
    id: "guided-meditations",
    title: "Guided Meditations",
    description: "Expertly led meditation sessions to reduce stress, increase mindfulness, and cultivate inner peace and mental clarity.",
    image: "/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png",
    color: "bg-ifind-purple",
    detailedDescription: "Our guided meditation sessions help you cultivate mindfulness, reduce stress, and enhance overall well-being. Led by experienced meditation instructors, these sessions combine breathing techniques, visualization, and mindfulness practices to quiet the mind and bring awareness to the present moment. Perfect for both beginners and experienced practitioners, our guided meditations can be customized to address specific concerns such as stress, sleep issues, or emotional regulation.",
    benefits: [
      "Reduced stress and anxiety levels",
      "Improved focus and concentration",
      "Better sleep quality and relaxation",
      "Enhanced emotional regulation",
      "Greater self-awareness and mindfulness in daily life"
    ],
    duration: "30-60 minute sessions",
    process: "Sessions begin with a brief introduction and intention setting, followed by guided meditation practice. Each session concludes with time for reflection and integration of the experience."
  },
  {
    id: "mindful-listening",
    title: "Mindful Listening",
    description: "A unique space where you can express yourself freely while being deeply heard without judgment or interruption.",
    image: "/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png",
    color: "bg-ifind-lavender",
    detailedDescription: "Our Mindful Listening service provides a unique opportunity to be truly heard in a non-judgmental, supportive environment. Unlike traditional therapy, the focus is entirely on giving you space to express yourself without interruption or advice-giving. Our trained listeners create a safe container for you to process thoughts, feelings, and experiences aloud, which can lead to profound insights and emotional release. This practice can be particularly helpful for clarifying thoughts, processing experiences, or simply feeling acknowledged and validated.",
    benefits: [
      "Experience of being fully heard and acknowledged",
      "Clarification of thoughts and feelings through verbal expression",
      "Emotional release and reduced mental burden",
      "Increased self-understanding without external judgment",
      "Development of your own solutions through self-expression"
    ],
    duration: "45-minute sessions",
    process: "You'll be welcomed into a comfortable, private setting where you can speak freely about whatever is on your mind. The listener will maintain attentive, supportive presence without interrupting or offering advice unless specifically requested."
  },
  {
    id: "offline-retreats",
    title: "Offline Retreats",
    description: "Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.",
    image: "/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png",
    color: "bg-ifind-yellow",
    detailedDescription: "Our Offline Retreats offer a rare opportunity to disconnect from digital distractions and reconnect with yourself, nature, and authentic human connection. Set in carefully selected natural environments, these immersive experiences combine mindfulness practices, nature therapy, creative expression, and community building. Participants experience a digital detox while engaging in activities designed to foster presence, self-discovery, and renewal. Whether you're seeking respite from burnout, deeper connection, or simply time to reflect, our retreats provide a supportive environment for transformation.",
    benefits: [
      "Complete digital detox to reset your relationship with technology",
      "Reconnection with nature and its restorative effects",
      "Community building and authentic human connection",
      "Mindfulness practices to increase present-moment awareness",
      "Time and space for reflection and personal growth"
    ],
    duration: "Weekend (2-3 days) to week-long retreats",
    process: "Retreats begin with orientation and intention setting, followed by a structured but flexible schedule of individual and group activities. All meals and accommodations are provided in natural settings that support the retreat's purposes."
  },
  {
    id: "life-coaching",
    title: "Life Coaching",
    description: "Goal-oriented coaching to help you clarify your vision, overcome obstacles, and achieve personal and professional success.",
    image: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    color: "bg-ifind-pink",
    detailedDescription: "Our Life Coaching service helps you bridge the gap between where you are now and where you want to be. Working with a certified coach, you'll clarify your vision, identify obstacles, and develop actionable strategies to achieve your personal and professional goals. Unlike therapy, which often focuses on healing past issues, coaching is future-oriented and action-based. Your coach will provide accountability, perspective, and support as you work toward creating positive change in areas such as career development, relationships, health and wellness, or personal growth.",
    benefits: [
      "Clarity about your goals and values",
      "Actionable strategies to overcome obstacles",
      "Accountability and support for taking consistent action",
      "Expanded perspective on challenges and opportunities",
      "Accelerated progress toward meaningful objectives"
    ],
    duration: "50-minute sessions",
    process: "Begin with a discovery session to assess your current situation and define your goals. Follow-up sessions focus on developing strategies, taking action, evaluating progress, and adjusting your approach as needed."
  }
];

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get authentication state for the inquiry form
  const { isAuthenticated, currentUser } = useAuthSynchronization();
  
  // Find the service data based on the URL parameter
  const serviceData = servicesData.find(service => service.id === serviceId);
  
  // Handle case where service is not found
  useEffect(() => {
    if (!serviceData && serviceId) {
      toast.error("Service not found");
      navigate('/services');
    }
  }, [serviceData, serviceId, navigate]);
  
  if (!serviceData) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{serviceData.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{serviceData.description}</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About this Service</CardTitle>
              <CardDescription>Comprehensive support for your mental wellness journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {serviceData.detailedDescription}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {serviceData.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Duration</h3>
                <p className="text-gray-700 dark:text-gray-300">{serviceData.duration}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">What to Expect</h3>
                <p className="text-gray-700 dark:text-gray-300">{serviceData.process}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <div className={`h-48 ${serviceData.color}`}>
              <img 
                src={serviceData.image} 
                alt={serviceData.title} 
                className="w-full h-full object-cover mix-blend-overlay opacity-80" 
              />
            </div>
            <CardHeader>
              <CardTitle>Ready to Begin?</CardTitle>
              <CardDescription>Take the first step toward positive change</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Our experts are ready to support you on your journey to improved mental wellness and personal growth.
              </p>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className={`w-full ${serviceData.color === 'bg-ifind-teal' ? 'bg-ifind-teal hover:bg-ifind-teal/90' : 
                    serviceData.color === 'bg-ifind-purple' ? 'bg-ifind-purple hover:bg-ifind-purple/90' : 
                    serviceData.color === 'bg-ifind-lavender' ? 'bg-ifind-lavender hover:bg-ifind-lavender/90' : 
                    serviceData.color === 'bg-ifind-yellow' ? 'bg-ifind-yellow hover:bg-ifind-yellow/90' : 
                    'bg-ifind-pink hover:bg-ifind-pink/90'}`}>
                    Inquire Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Inquire about {serviceData.title}</DialogTitle>
                    <DialogDescription>
                      Please provide your information and we'll get back to you shortly.
                    </DialogDescription>
                  </DialogHeader>
                  <InquiryForm 
                    serviceName={serviceData.title} 
                    currentUser={currentUser} 
                    isAuthenticated={isAuthenticated} 
                    onSuccess={() => setIsDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              
              <Separator />
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="font-medium">Still have questions?</p>
                <p>Contact us at <a href="mailto:support@ifindlife.com" className="text-ifind-teal hover:underline">support@ifindlife.com</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/services')}>
          Back to Services
        </Button>
      </div>
    </div>
  );
};

export default ServiceDetail;
