import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { servicesData } from '@/data/unifiedServicesData';
import { 
  Video,
  Calendar,
  Star,
  ArrowRight,
  Heart,
  Users,
  Clock,
  Smile,
  Frown,
  Angry,
  Compass,
  Play
} from 'lucide-react';

const moodOptions = [
  {
    id: 'happy',
    icon: Smile,
    label: 'Happy',
    description: 'Ready to learn',
    color: 'bg-green-500',
    content: 'recorded-sessions'
  },
  {
    id: 'sad',
    icon: Frown,
    label: 'Sad',
    description: 'Need help',
    color: 'bg-blue-500',
    content: 'live-experts'
  },
  {
    id: 'angry',
    icon: Angry,
    label: 'Angry',
    description: 'Want to vent',
    color: 'bg-red-500',
    content: 'listening-experts'
  },
  {
    id: 'usual',
    icon: Compass,
    label: 'Usual',  
    description: 'Will explore',
    color: 'bg-ifind-aqua',
    content: 'services'
  }
];

const recordedSessions = [
  {
    id: 1,
    title: 'Morning Meditation',
    expert: 'Dr. Sarah Johnson',
    duration: '15 min',
    thumbnail: '/lovable-uploads/session-1.jpg'
  },
  {
    id: 2,
    title: 'Stress Relief Techniques',
    expert: 'Dr. Michael Chen',
    duration: '20 min',
    thumbnail: '/lovable-uploads/session-2.jpg'
  }
];

const liveExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    speciality: 'Anxiety & Stress',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    available: true,
    type: 'therapist'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    speciality: 'Depression & Therapy',
    rating: 4.8,
    sessions: 950,
    price: 45,
    available: true,
    type: 'therapist'
  }
];

const listeningExperts = [
  {
    id: 3,
    name: 'Emma Wilson',
    speciality: 'Active Listening',
    rating: 4.7,
    sessions: 800,
    price: 25,
    available: true,
    type: 'listener'
  },
  {
    id: 4,
    name: 'James Brown',
    speciality: 'Compassionate Listening',
    rating: 4.6,
    sessions: 650,
    price: 20,
    available: true,
    type: 'listener'
  }
];

const topExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    speciality: 'Anxiety & Stress',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    available: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    speciality: 'Depression & Therapy',
    rating: 4.8,
    sessions: 950,
    price: 45,
    available: false
  }
];

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('happy');

  const renderMoodContent = (moodId: string) => {
    switch (moodId) {
      case 'happy':
        return (
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-ifind-charcoal">Recorded Sessions</h3>
            {recordedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-ifind-aqua/20 rounded-xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-ifind-aqua" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-poppins font-medium text-ifind-charcoal mb-1">
                      {session.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {session.expert} • {session.duration}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'sad':
        return (
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-ifind-charcoal">Live Experts Available</h3>
            {liveExperts.map((expert) => (
              <div
                key={expert.id}
                onClick={() => navigate(`/mobile-app/app/experts/${expert.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {expert.name.charAt(0)}
                      </span>
                    </div>
                    {expert.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-poppins font-medium text-ifind-charcoal">
                        {expert.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        ${expert.price}/session
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {expert.speciality}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {expert.rating}
                      </div>
                      <span>•</span>
                      <span>{expert.sessions} sessions</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'angry':
        return (
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-ifind-charcoal">Listening Experts</h3>
            {listeningExperts.map((expert) => (
              <div
                key={expert.id}
                onClick={() => navigate(`/mobile-app/app/experts/${expert.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-teal to-ifind-purple rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {expert.name.charAt(0)}
                      </span>
                    </div>
                    {expert.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-poppins font-medium text-ifind-charcoal">
                        {expert.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        ${expert.price}/session
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {expert.speciality}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {expert.rating}
                      </div>
                      <span>•</span>
                      <span>{expert.sessions} sessions</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'usual':
        return (
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-ifind-charcoal">Explore Services</h3>
            {servicesData.slice(0, 4).map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/mobile-app/app/services/${service.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color.replace('bg-', 'bg-') + '/20'}`}>
                    <service.icon className={`h-6 w-6 ${service.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-poppins font-medium text-ifind-charcoal mb-1">
                      {service.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-ifind-aqua/10 via-ifind-teal/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-muted-foreground">
            How are you feeling today?
          </p>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {moodOptions.map((mood) => (
            <Button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`${
                selectedMood === mood.id 
                  ? `${mood.color} text-white` 
                  : 'bg-white text-ifind-charcoal border border-border'
              } hover:opacity-90 flex flex-col items-center justify-center h-20 rounded-xl transition-all duration-300`}
            >
              <mood.icon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">{mood.label}</span>
              <span className="text-xs opacity-80">{mood.description}</span>
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-ifind-aqua/10 rounded-full mx-auto mb-1">
              <Heart className="h-4 w-4 text-ifind-aqua" />
            </div>
            <p className="text-xl font-bold text-ifind-charcoal">12</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-ifind-teal/10 rounded-full mx-auto mb-1">
              <Users className="h-4 w-4 text-ifind-teal" />
            </div>
            <p className="text-xl font-bold text-ifind-charcoal">5</p>
            <p className="text-xs text-muted-foreground">Experts</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-ifind-purple/10 rounded-full mx-auto mb-1">
              <Clock className="h-4 w-4 text-ifind-purple" />
            </div>
            <p className="text-xl font-bold text-ifind-charcoal">18h</p>
            <p className="text-xs text-muted-foreground">Total Time</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Mood-based Content */}
        <div>
          {renderMoodContent(selectedMood)}
        </div>

        {/* Top Experts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal">
              Top Experts Online
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/mobile-app/app/experts')}
              className="text-ifind-aqua p-0 h-auto"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {topExperts.map((expert) => (
              <div
                key={expert.id}
                onClick={() => navigate(`/mobile-app/app/experts/${expert.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {expert.name.charAt(0)}
                      </span>
                    </div>
                    {expert.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-poppins font-medium text-ifind-charcoal">
                        {expert.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        ${expert.price}/session
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {expert.speciality}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {expert.rating}
                      </div>
                      <span>•</span>
                      <span>{expert.sessions} sessions</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal">
              Popular Services
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/mobile-app/app/services')}
              className="text-ifind-aqua p-0 h-auto"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {servicesData.slice(0, 3).map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/mobile-app/app/services/${service.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color.replace('bg-', 'bg-') + '/20'}`}>
                    <service.icon className={`h-6 w-6 ${service.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-medium text-ifind-charcoal mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-4">
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ifind-charcoal">
                    Session with Dr. Sarah Johnson
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed • 2 hours ago
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  Completed
                </Badge>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ifind-charcoal">
                    Upcoming session scheduled
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tomorrow at 3:00 PM
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  Scheduled
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};