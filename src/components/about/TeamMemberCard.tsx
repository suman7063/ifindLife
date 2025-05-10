
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export interface TeamMemberHighlight {
  icon: React.ReactNode;
  text: string;
}

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
  highlights: TeamMemberHighlight[];
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Card key={member.id} className="overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        {/* Decorative element */}
        <div className="absolute inset-0 bg-gradient-to-r from-ifind-aqua/20 to-ifind-purple/20 h-2 w-full" />
        
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image with gradient overlay */}
          <div className="md:w-1/3 p-6 flex items-center justify-center bg-gradient-to-br from-ifind-teal/10 to-ifind-purple/10">
            <div className="relative">
              <Avatar className="h-40 w-40 ring-2 ring-white ring-offset-2 ring-offset-ifind-teal/20">
                <AvatarImage 
                  src={member.image} 
                  alt={member.name} 
                  className={`object-cover ${member.id === 3 ? 'object-top' : ''}`} 
                />
                <AvatarFallback className="bg-ifind-teal text-white text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-ifind-aqua text-white text-xs py-1 px-2 rounded-full">
                {member.id === 3 ? 'Program Director' : 'Founder'}
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="md:w-2/3 p-6">
            <CardHeader className="pb-2 pt-0 px-0 md:pt-0">
              <CardTitle className="text-2xl font-bold text-ifind-charcoal">{member.name}</CardTitle>
              <CardDescription className="font-medium text-ifind-teal">{member.title}</CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <p className="text-gray-700 mb-4 leading-relaxed">{member.bio}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-ifind-charcoal mb-2">Key Highlights</h4>
                <div className="space-y-2">
                  {member.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="bg-ifind-teal/10 p-2 rounded-full text-ifind-teal group-hover:bg-ifind-teal group-hover:text-white transition-colors">
                        {highlight.icon}
                      </div>
                      <p className="text-sm">{highlight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-0 mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <div className="text-xs px-3 py-1 bg-ifind-aqua/10 text-ifind-aqua rounded-full">Mindfulness</div>
                <div className="text-xs px-3 py-1 bg-ifind-purple/10 text-ifind-purple rounded-full">Wellness</div>
                <div className="text-xs px-3 py-1 bg-ifind-teal/10 text-ifind-teal rounded-full">Mental Health</div>
              </div>
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;
