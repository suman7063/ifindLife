import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceBySlug } from '@/data/unifiedServicesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Video,
  MessageSquare,
  Star,
  Users,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const mockExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    avatar: 'SJ',
    rating: 4.9,
    sessions: 1200,
    price: 50,
    available: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    avatar: 'MC',
    rating: 4.8,
    sessions: 950,
    price: 45,
    available: false
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    avatar: 'ER',
    rating: 4.9,
    sessions: 800,
    price: 55,
    available: true
  }
];

export const ServiceDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  
  const service = getServiceBySlug(serviceId || '');

  if (!service) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Service not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <div className={`${service.gradientColor} p-6 rounded-b-3xl`}>
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${service.color.replace('bg-', 'bg-') + '/30'}`}>
            <service.icon className={`h-10 w-10 ${service.textColor}`} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
              {service.title}
            </h1>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                4.8 rating
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                120+ experts
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => navigate('/mobile-app/app/experts', { state: { serviceId } })}
            className="bg-white hover:bg-gray-50 text-ifind-charcoal flex flex-col items-center justify-center h-16 rounded-xl shadow-sm"
          >
            <Video className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Live Call</span>
          </Button>
          <Button
            onClick={() => navigate('/mobile-app/app/experts', { state: { serviceId } })}
            className="bg-white hover:bg-gray-50 text-ifind-charcoal flex flex-col items-center justify-center h-16 rounded-xl shadow-sm"
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Chat</span>
          </Button>
          <Button
            onClick={() => navigate('/mobile-app/app/booking', { state: { serviceId } })}
            className="bg-white hover:bg-gray-50 text-ifind-charcoal flex flex-col items-center justify-center h-16 rounded-xl shadow-sm"
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Book</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Description */}
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-3">
            About This Service
          </h2>
          <p className="text-muted-foreground leading-relaxed text-justify">
            {service.detailedDescription}
          </p>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-3">
            What You'll Gain
          </h2>
          <div className="space-y-3">
            {service.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-3">
            How It Works
          </h2>
          <div className="bg-white rounded-xl p-4 border border-border/50">
            <p className="text-muted-foreground leading-relaxed">
              {service.process}
            </p>
          </div>
        </div>

        {/* Available Experts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal">
              Available Experts
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/mobile-app/app/experts', { state: { serviceId } })}
              className="text-ifind-aqua p-0 h-auto"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockExperts.slice(0, 2).map((expert) => (
              <div
                key={expert.id}
                onClick={() => navigate(`/mobile-app/app/experts/${expert.id}`)}
                className="bg-white rounded-xl p-4 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {expert.avatar}
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
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {expert.rating}
                      </div>
                      <span>•</span>
                      <span>{expert.sessions} sessions</span>
                      <span>•</span>
                      <span className={expert.available ? 'text-green-600' : 'text-orange-600'}>
                        {expert.available ? 'Available now' : 'Busy'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-ifind-aqua/10 to-ifind-teal/10 rounded-xl p-6 text-center">
          <h3 className="text-lg font-poppins font-semibold text-ifind-charcoal mb-2">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground mb-4">
            Connect with an expert who understands your needs
          </p>
          <Button
            onClick={() => navigate('/mobile-app/app/experts', { state: { serviceId } })}
            className={`w-full ${service.buttonColor} text-white py-6`}
          >
            Find Your Expert
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};