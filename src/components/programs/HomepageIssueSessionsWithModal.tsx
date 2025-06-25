
import React from 'react';
import ProgramsWithModal from './ProgramsWithModal';

// Mock data for issue-based programs that would typically come from your data source
const issueBasedPrograms = [
  {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood through evidence-based techniques.',
    duration: '3 months',
    price: 25000,
    sessions: 12,
    enrollments: 127,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  },
  {
    id: 'anxiety',
    title: 'Anxiety Relief Program',
    description: 'Learn effective tools and techniques to help manage anxiety and worry through breathing exercises and cognitive restructuring.',
    duration: '10 weeks',
    price: 20000,
    sessions: 10,
    enrollments: 89,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  },
  {
    id: 'stress',
    title: 'Stress Management Mastery',
    description: 'Develop effective strategies to cope with and reduce stress in your daily life using proven stress management techniques.',
    duration: '8 weeks',
    price: 15000,
    sessions: 8,
    enrollments: 156,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  },
  {
    id: 'sleep',
    title: 'Sleep Quality Improvement',
    description: 'Comprehensive program to help improve sleep quality and address insomnia through sleep hygiene education and behavioral modifications.',
    duration: '6 weeks',
    price: 10000,
    sessions: 6,
    enrollments: 73,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  },
  {
    id: 'relationships',
    title: 'Relationship Enhancement Program',
    description: 'Expert guidance for building healthy and fulfilling relationships through communication skills and emotional intelligence development.',
    duration: '10 weeks',
    price: 25000,
    sessions: 10,
    enrollments: 94,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  },
  {
    id: 'self-esteem',
    title: 'Self-Esteem Building Program',
    description: 'Comprehensive program to help build confidence and improve self-image through self-awareness exercises and empowerment strategies.',
    duration: '8 weeks',
    price: 15500,
    sessions: 8,
    enrollments: 118,
    image: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png',
    category: 'issue-based'
  }
];

const HomepageIssueSessionsWithModal: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Issue-Based Support Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Targeted programs designed to address specific mental health concerns with expert guidance and proven techniques.
          </p>
        </div>

        <ProgramsWithModal 
          programs={issueBasedPrograms}
          className="max-w-6xl mx-auto"
        />
      </div>
    </section>
  );
};

export default HomepageIssueSessionsWithModal;
