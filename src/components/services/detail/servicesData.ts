import React from 'react';
import { Brain, HeartHandshake, HeartPulse, Leaf, MessageCircle, Sparkles } from 'lucide-react';
import listeningWithGuidanceImage from '@/assets/listening-with-guidance.jpg';

// Service data with detailed descriptions and updated images - reordered and with updated color themes
export const servicesData = [
  {
    id: "mindful-listening",
    title: "Heart2Heart Listening Sessions",
    description: "A unique space where you can express yourself freely while being deeply heard without judgment or interruption.",
    image: "/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png",
    color: "bg-ifind-teal", // Changed from aqua to teal
    gradientColor: "from-ifind-teal/20 to-white", // Changed from aqua to teal
    textColor: "text-ifind-teal", // Changed from aqua to teal
    buttonColor: "bg-ifind-teal hover:bg-ifind-teal/90", // Changed from aqua to teal
    icon: React.createElement(MessageCircle, { className: "h-8 w-8 text-white" }),
    detailedDescription: "Our Heart2Heart Listening Sessions provide a unique opportunity to be truly heard in a non-judgmental, supportive environment. Unlike traditional therapy, the focus is entirely on giving you space to express yourself without interruption or advice-giving. Our trained listeners create a safe container for you to process thoughts, feelings, and experiences aloud, which can lead to profound insights and emotional release. This practice can be particularly helpful for clarifying thoughts, processing experiences, or simply feeling acknowledged and validated.",
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
    id: "listening-with-guidance",
    title: "Listening Session with Guidance",
    description: "Supportive listening sessions combined with gentle guidance and insights to help navigate life challenges.",
    image: listeningWithGuidanceImage,
    color: "bg-ifind-blue",
    gradientColor: "from-ifind-blue/20 to-white",
    textColor: "text-ifind-blue",
    buttonColor: "bg-ifind-blue hover:bg-ifind-blue/90",
    icon: React.createElement(HeartHandshake, { className: "h-8 w-8 text-white" }),
    detailedDescription: "Our Listening Session with Guidance offers the perfect balance between being heard and receiving supportive insights. These sessions begin with open listening where you can express yourself freely, followed by gentle guidance when you seek direction or perspective. Our trained facilitators provide a compassionate space for processing while offering thoughtful reflections and practical insights to help you move forward. This hybrid approach is ideal for those who want both the validation of being heard and the benefit of gentle guidance.",
    benefits: [
      "Combination of deep listening and supportive guidance",
      "Validation of your experiences and feelings",
      "Gentle insights and perspectives to aid decision-making",
      "Practical tools and strategies for moving forward",
      "Flexible sessions that adapt to your needs in the moment"
    ],
    duration: "50-minute sessions",
    process: "Sessions begin with open listening time where you can share freely. Your facilitator will then offer gentle guidance, insights, or practical strategies based on what you've shared and what feels most helpful for your situation."
  },
  {
    id: "therapy-sessions",
    title: "Therapy Sessions",
    description: "Professional therapy sessions to help you navigate life's challenges, manage mental health concerns, and enhance personal growth.",
    image: "/lovable-uploads/58321caf-3b5b-4a9d-91a1-44514ae2000b.png",
    color: "bg-ifind-purple",
    gradientColor: "from-ifind-purple/20 to-white",
    textColor: "text-ifind-purple",
    buttonColor: "bg-ifind-purple hover:bg-ifind-purple/90",
    icon: React.createElement(HeartPulse, { className: "h-8 w-8 text-white" }),
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
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    color: "bg-ifind-aqua", // Changed from gray-400 to aqua
    gradientColor: "from-ifind-aqua/20 to-white", // Changed from gray-300 to aqua
    textColor: "text-ifind-aqua", // Changed from gray-600 to aqua
    buttonColor: "bg-ifind-aqua hover:bg-ifind-aqua/90", // Changed from gray-500 to aqua
    icon: React.createElement(Brain, { className: "h-8 w-8 text-white" }),
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
    id: "offline-retreats",
    title: "Offline Retreats",
    description: "Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.",
    image: "/lovable-uploads/6c427c55-7a38-4dad-8c60-cc782cbc5bd7.png",
    color: "bg-amber-400",
    gradientColor: "from-amber-300/20 to-white",
    textColor: "text-amber-700",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    icon: React.createElement(Leaf, { className: "h-8 w-8 text-white" }),
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
    image: "/lovable-uploads/1086590e-2848-41ea-a5f9-40b33666bb9d.png",
    color: "bg-rose-400",
    gradientColor: "from-rose-300/20 to-white",
    textColor: "text-rose-600",
    buttonColor: "bg-rose-500 hover:bg-rose-600",
    icon: React.createElement(Sparkles, { className: "h-8 w-8 text-white" }),
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