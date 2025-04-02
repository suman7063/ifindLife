
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Heart, Brain, Headphones, Map, Compass, Home } from 'lucide-react';
import InquiryForm from './InquiryForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserAuth } from '@/hooks/useUserAuth';

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  details: string;
  benefits: string[];
  process: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserAuth();
  const [isInquiryOpen, setIsInquiryOpen] = React.useState(false);

  const servicesData: Record<string, ServiceInfo> = {
    'therapy-sessions': {
      id: 'therapy-sessions',
      title: 'Therapy Sessions',
      description: 'One-on-one sessions with licensed therapists tailored to your specific needs, helping you navigate through life challenges with professional guidance.',
      icon: <Heart className="h-12 w-12 text-ifind-purple" />,
      details: 'Our therapy sessions provide a safe, confidential space where you can openly discuss your concerns with a qualified professional. Whether you're dealing with anxiety, depression, relationship issues, or simply seeking personal growth, our therapists employ evidence-based approaches to help you develop insights and coping strategies.',
      benefits: [
        'Personalized treatment plans tailored to your specific needs',
        'Safe, confidential environment to express thoughts and feelings',
        'Professional guidance through difficult life transitions',
        'Evidence-based techniques for managing symptoms',
        'Development of healthy coping mechanisms and self-awareness',
        'Regular assessment of progress and adjustment of approach as needed'
      ],
      process: [
        {
          title: 'Initial Assessment',
          description: 'A comprehensive evaluation to understand your needs, history, and goals for therapy.'
        },
        {
          title: 'Treatment Planning',
          description: 'Collaborative development of a personalized approach based on your specific situation and objectives.'
        },
        {
          title: 'Regular Sessions',
          description: 'Ongoing 50-minute appointments focused on addressing your concerns and building coping skills.'
        },
        {
          title: 'Progress Evaluation',
          description: 'Periodic review of your advancement toward goals with adjustments to the treatment plan as needed.'
        }
      ],
      faqs: [
        {
          question: 'How long does each therapy session last?',
          answer: 'Standard sessions last 50 minutes, though initial consultations may be longer to allow for thorough assessment.'
        },
        {
          question: 'How many sessions will I need?',
          answer: 'The number of sessions varies greatly depending on your specific situation and goals. Some benefit from short-term therapy (8-12 sessions), while others find longer-term support more beneficial. Your therapist will discuss recommendations after your initial assessment.'
        },
        {
          question: 'Is what I share confidential?',
          answer: 'Yes, therapy sessions are confidential with legal exceptions that include risk of harm to yourself or others, suspected abuse of children or vulnerable adults, or if records are court-ordered.'
        },
        {
          question: 'Can I switch therapists if I don\'t feel the right connection?',
          answer: 'Absolutely. The therapeutic relationship is crucial for effective therapy, and we're happy to help you find a better match if needed.'
        }
      ]
    },
    'guided-meditations': {
      id: 'guided-meditations',
      title: 'Guided Meditations',
      description: 'Expertly crafted meditation sessions designed to reduce stress, enhance focus, and promote overall mental wellbeing through mindfulness practices.',
      icon: <Brain className="h-12 w-12 text-ifind-teal" />,
      details: 'Our guided meditation sessions are designed for all experience levels, from beginners to advanced practitioners. Led by experienced meditation guides, these sessions incorporate various techniques including mindfulness, breath awareness, visualization, and progressive relaxation to help you cultivate inner peace and enhance your mental clarity.',
      benefits: [
        'Reduced stress and anxiety levels',
        'Improved focus and concentration',
        'Enhanced emotional regulation and resilience',
        'Better sleep quality',
        'Increased self-awareness and mindfulness in daily life',
        'Cultivation of positive mental states such as compassion and gratitude'
      ],
      process: [
        {
          title: 'Orientation',
          description: 'Introduction to meditation basics and setting of personal intentions for your practice.'
        },
        {
          title: 'Guided Practice',
          description: 'Instructor-led meditation sessions using various techniques appropriate for your experience level.'
        },
        {
          title: 'Reflection and Integration',
          description: 'Discussion of experience and guidance on applying mindfulness to everyday situations.'
        },
        {
          title: 'Personalized Recommendations',
          description: 'Suggestions for continued practice, including techniques and frequency suited to your lifestyle.'
        }
      ],
      faqs: [
        {
          question: 'Do I need prior meditation experience?',
          answer: 'No, our guided meditations are designed for all levels, with special attention to beginners who are just starting their meditation journey.'
        },
        {
          question: 'How long are the meditation sessions?',
          answer: 'Sessions typically range from 30-60 minutes, including guidance, practice time, and brief discussion.'
        },
        {
          question: 'What should I wear to a meditation session?',
          answer: 'Comfortable, loose-fitting clothing that won\'t distract you during the practice is recommended.'
        },
        {
          question: 'Will I be sitting in uncomfortable positions?',
          answer: 'No, we emphasize comfort during meditation. Sessions can be done sitting on chairs, cushions, or even lying down depending on your preference and physical needs.'
        }
      ]
    },
    'mindful-listening': {
      id: 'mindful-listening',
      title: 'Mindful Listening',
      description: 'A unique service where trained professionals provide dedicated attention to your thoughts and feelings without judgment, fostering emotional relief.',
      icon: <Headphones className="h-12 w-12 text-ifind-aqua" />,
      details: 'Mindful listening offers a unique space where you can express yourself fully while being truly heard. Unlike traditional therapy, the focus is entirely on allowing you to verbalize your thoughts and feelings with a compassionate listener who provides their complete, non-judgmental attention without offering solutions or advice unless requested.',
      benefits: [
        'Experience of being fully heard and validated',
        'Emotional release through expressing unfiltered thoughts and feelings',
        'Clarity gained through the process of articulating experiences',
        'Reduced feelings of isolation and loneliness',
        'Development of self-compassion through reflected acceptance',
        'Opportunity to process experiences without pressure to take specific actions'
      ],
      process: [
        {
          title: 'Setting Intentions',
          description: 'Brief discussion of what you\'d like to focus on during the session, if you have a specific topic in mind.'
        },
        {
          title: 'Mindful Expression',
          description: 'Uninterrupted time to share your thoughts, feelings, and experiences at your own pace.'
        },
        {
          title: 'Reflective Listening',
          description: 'Your listener may occasionally reflect back what they\'ve heard to ensure understanding and deepen your awareness.'
        },
        {
          title: 'Closing Reflection',
          description: 'Optional opportunity to discuss how the experience felt and any insights gained.'
        }
      ],
      faqs: [
        {
          question: 'How is mindful listening different from therapy?',
          answer: 'While therapy is typically goal-oriented and involves professional intervention, mindful listening focuses solely on providing space for you to be heard without advice or direction. Listeners don\'t diagnose or treat mental health conditions.'
        },
        {
          question: 'Do I need to prepare what I want to talk about?',
          answer: 'No preparation is necessary. You\'re welcome to arrive with a specific topic or simply speak about whatever emerges in the moment.'
        },
        {
          question: 'What if I don\'t know what to say or run out of things to talk about?',
          answer: 'This is completely normal and part of the process. Your listener is comfortable with silence, and often important thoughts emerge after pauses. There\'s no pressure to fill the time with constant talking.'
        },
        {
          question: 'Is confidentiality maintained in mindful listening sessions?',
          answer: 'Yes, our mindful listeners adhere to strict confidentiality policies, with the same exceptions as therapy (risk of harm to self or others, abuse of vulnerable populations, and legal requirements).'
        }
      ]
    },
    'offline-retreats': {
      id: 'offline-retreats',
      title: 'Offline Retreats',
      description: 'Immersive in-person experiences in serene locations designed to disconnect from digital distractions and reconnect with your inner self.',
      icon: <Map className="h-12 w-12 text-orange-500" />,
      details: 'Our offline retreats take place in carefully selected, peaceful environments where you can temporarily step away from the demands of everyday life and technology. These retreats combine various wellness practices including meditation, yoga, nature walks, creative expression, and group sharing circles to facilitate deep personal reflection and renewal.',
      benefits: [
        'Complete digital detox to reset mental patterns',
        'Immersion in nature for restoration and perspective',
        'Community connection with like-minded individuals',
        'Exposure to multiple wellness practices to find what resonates with you',
        'Structured program balanced with personal time for reflection',
        'Tools and techniques to incorporate mindfulness into daily life after the retreat'
      ],
      process: [
        {
          title: 'Pre-Retreat Preparation',
          description: 'Guidance on how to prepare, what to bring, and setting intentions for your retreat experience.'
        },
        {
          title: 'Arrival and Orientation',
          description: 'Welcome, introduction to the retreat space and program, and surrender of digital devices.'
        },
        {
          title: 'Immersive Experience',
          description: 'Participation in structured activities and personal time within a supportive community environment.'
        },
        {
          title: 'Re-Integration Planning',
          description: 'Preparation for returning to daily life with strategies to maintain the benefits gained.'
        }
      ],
      faqs: [
        {
          question: 'Do I really have to give up my phone and other devices?',
          answer: 'Yes, our retreats are designed as a true digital detox. We provide a contact number for emergencies that you can share with family, but participants surrender their devices upon arrival.'
        },
        {
          question: 'What are the accommodations like?',
          answer: 'Accommodations vary by retreat location but are always clean, comfortable, and thoughtfully designed. Options range from private rooms to shared cabins, with details provided for each specific retreat.'
        },
        {
          question: 'What if I\'ve never meditated or done yoga before?',
          answer: 'No prior experience is necessary. All activities are led with beginners in mind, with modifications offered for different experience and ability levels.'
        },
        {
          question: 'Are meals provided and can you accommodate dietary restrictions?',
          answer: 'Yes, all meals are included and are typically vegetarian with whole food emphasis. We can accommodate most dietary restrictions with advance notice.'
        }
      ]
    },
    'life-coaching': {
      id: 'life-coaching',
      title: 'Life Coaching',
      description: 'Goal-oriented guidance to help you identify objectives, overcome obstacles, and create actionable strategies for personal and professional growth.',
      icon: <Compass className="h-12 w-12 text-purple-500" />,
      details: 'Life coaching is a collaborative process focused on helping you clarify your vision, set meaningful goals, and develop effective strategies to achieve them. Our certified coaches employ powerful questioning techniques and accountability structures to help you navigate transitions, overcome limiting beliefs, and maximize your potential in career, relationships, health, or personal development.',
      benefits: [
        'Clarity on your values, goals, and direction',
        'Actionable strategies to achieve specific outcomes',
        'Identification and breakthrough of limiting beliefs and patterns',
        'Accountability to maintain motivation and progress',
        'Development of decision-making skills and confidence',
        'Enhanced self-awareness and alignment between actions and values'
      ],
      process: [
        {
          title: 'Discovery Session',
          description: 'In-depth conversation to understand your current situation, aspirations, and challenges.'
        },
        {
          title: 'Goal Setting',
          description: 'Collaborative development of clear, meaningful, and achievable objectives.'
        },
        {
          title: 'Action Planning',
          description: 'Creation of specific strategies to overcome obstacles and move toward desired outcomes.'
        },
        {
          title: 'Regular Check-ins',
          description: 'Ongoing sessions to review progress, adjust approaches, and maintain accountability.'
        }
      ],
      faqs: [
        {
          question: 'How is coaching different from therapy?',
          answer: 'While therapy often focuses on healing past wounds and treating psychological conditions, coaching is primarily future-oriented and action-focused, helping functional individuals bridge the gap between their current and desired state.'
        },
        {
          question: 'How long does the coaching relationship typically last?',
          answer: 'Most clients work with a coach for 3-6 months, with sessions occurring weekly or bi-weekly. However, this varies based on individual goals and circumstances.'
        },
        {
          question: 'Will my coach tell me what to do with my life?',
          answer: 'No, coaches don\'t provide direct advice or answers. Instead, they help you discover your own insights and solutions through powerful questioning and collaborative exploration.'
        },
        {
          question: 'How quickly will I see results from coaching?',
          answer: 'Many clients report immediate benefits in terms of clarity and motivation. Tangible results depend on your goals and consistent action, with significant changes typically occurring within 2-3 months of regular sessions and committed action.'
        }
      ]
    }
  };

  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-8">The service you're looking for doesn't exist or may have been moved.</p>
          <Button onClick={() => navigate('/services')}>
            View All Services
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/services/${service.id}`}>{service.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center mb-8 text-center">
          {service.icon}
          <h1 className="text-3xl font-bold mt-4 mb-2">{service.title}</h1>
          <p className="text-gray-600 max-w-3xl">{service.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Service</h2>
          <p className="text-gray-700 mb-6">{service.details}</p>

          <h3 className="text-lg font-semibold mb-2">Benefits</h3>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            {service.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-2">Our Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {service.process.map((step, index) => (
              <div key={index} className="border rounded p-4">
                <h4 className="font-medium mb-1">{index + 1}. {step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-ifind-purple hover:bg-ifind-purple/90">
                Inquire About This Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Inquire About {service.title}</DialogTitle>
                <DialogDescription>
                  Please provide your information and we'll get back to you soon.
                </DialogDescription>
              </DialogHeader>
              <InquiryForm 
                serviceName={service.title} 
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                onSuccess={() => setIsInquiryOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium mb-1">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceDetail;
