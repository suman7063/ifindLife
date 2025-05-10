
import React from 'react';
import { Award, BookOpen, BrainCircuit, Globe, Briefcase, GraduationCap, Heart } from 'lucide-react';
import TeamMemberCard, { TeamMember } from './TeamMemberCard';

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Dev OM",
    title: "Cofounder and Chief Mentor",
    bio: "With over 20 years of global experience in emotional and mental wellness coaching, Master Dev Om is a globally recognized mindfulness and meditation coach. He was directly trained by father of mindfulness - Thich Nhat Hanh and the Dalai Lama. He created 'Light Mindfulness Meditation,' authored 9 books, and has trained and certified hundreds of meditation & mindfulness coaches worldwide.",
    image: "/lovable-uploads/7069b4db-6802-4e03-b1f1-bf1f03d2c176.png",
    highlights: [
      { icon: <BrainCircuit className="h-4 w-4" />, text: "Creator of 'Light Mindfulness Meditation'" },
      { icon: <BookOpen className="h-4 w-4" />, text: "Author of 9 books on mindfulness" },
      { icon: <Award className="h-4 w-4" />, text: "Trained by Thich Nhat Hanh and the Dalai Lama" }
    ]
  },
  {
    id: 2,
    name: "Dushyant Kohli",
    title: "Cofounder and CEO",
    bio: "Dushyant Kohli is a seasoned entrepreneur and Indian OTT veteran with co-founding experience (Khabri & Beatcast) and over a decade of CXO and growth hacking expertise. He has led B2C and B2B businesses across OTT, Edtech, podcasting, and gaming, and is also a certified Meditation teacher & Mindfulness Coach. He is an MBA from Ecole Des Pont Business School and PMP certification.",
    image: "/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png",
    highlights: [
      { icon: <Briefcase className="h-4 w-4" />, text: "Co-founded Khabri & Beatcast" },
      { icon: <Globe className="h-4 w-4" />, text: "Led B2C and B2B businesses across multiple industries" },
      { icon: <GraduationCap className="h-4 w-4" />, text: "MBA from Ecole Des Pont Business School" }
    ]
  },
  {
    id: 3,
    name: "Dr. Bhavna Khurana",
    title: "Programme Director at iFindLife (UK)",
    bio: "Dr. Bhavna Khurana, with over 20 years of global experience, is a PhD scholar in Cardiac Wellness and a pioneer in heart disease reversal through lifestyle change and mindfulness. She is the founder of I AM Fit (Singapore) and Soulversity (UK), offering mind-body wellness solutions. A certified Lifestyle Medicine Practitioner, Mindfulness Coach, and Meditation Teacher, Dr. Bhavna specializes in workplace wellness and mental health support through global Employee Assistance Programs (EAPs).",
    image: "/lovable-uploads/1b420877-7be1-4010-b806-5850cb719642.png",
    highlights: [
      { icon: <Heart className="h-4 w-4" />, text: "PhD in Cardiac Wellness & Founder of I AM Fit" },
      { icon: <BrainCircuit className="h-4 w-4" />, text: "Mindfulness Coach & Workplace Wellness Specialist" },
      { icon: <GraduationCap className="h-4 w-4" />, text: "Certified Lifestyle Medicine & Weight Management Coach" }
    ]
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-10 text-center">Our Leadership Team</h2>
        
        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
