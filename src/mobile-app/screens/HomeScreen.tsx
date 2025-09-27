import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { servicesData } from '@/data/unifiedServicesData';
import { 
  Video,
  MessageSquare,
  Calendar,
  Star,
  ArrowRight,
  Heart,
  Users,
  Clock
} from 'lucide-react';

const quickActions = [
  {
    icon: Video,
    label: 'Live Call',
    description: 'Connect instantly',
    color: 'bg-ifind-aqua text-white',
    route: '/mobile-app/app/experts'
  },
  {
    icon: MessageSquare,
    label: 'Quick Chat',
    description: 'Start messaging',
    color: 'bg-ifind-teal text-white',
    route: '/mobile-app/app/experts'
  },
  {
    icon: Calendar,
    label: 'Book Session',
    description: 'Schedule ahead',
    color: 'bg-ifind-purple text-white',
    route: '/mobile-app/app/booking'
  }
];

const featuredExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    speciality: 'Anxiety & Stress',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    avatar: '/lovable-uploads/expert-1.jpg',
    available: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    speciality: 'Depression & Therapy',
    rating: 4.8,
    sessions: 950,
    price: 45,
    avatar: '/lovable-uploads/expert-2.jpg',
    available: false
  }
];

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

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

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={() => navigate(action.route)}
              className={`${action.color} hover:opacity-90 flex flex-col items-center justify-center h-20 rounded-xl`}
            >
              <action.icon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs opacity-80">{action.description}</span>
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
        {/* Featured Services */}
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

        {/* Featured Experts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal">
              Top Experts
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
            {featuredExperts.map((expert) => (
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