import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowRight, Clock, Star, Users } from 'lucide-react';

const categories = [
  'All',
  'Therapy',
  'Meditation',
  'Coaching',
  'Support Groups',
  'Wellness'
];

export const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { services, loading } = useUnifiedServices();

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           service.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col bg-background">
      <div className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="pl-10 pr-12"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-ifind-aqua hover:bg-ifind-aqua/90 text-white'
                  : 'hover:bg-ifind-aqua/10 hover:text-ifind-aqua'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Header Stats */}
        <div className="bg-gradient-to-r from-ifind-aqua/10 to-ifind-teal/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-poppins font-bold text-ifind-charcoal">
                Wellness Services
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose the perfect support for your journey
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-ifind-aqua">{filteredServices.length}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 px-6 pb-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => {
              // Parse colors - they are hex values now
              const backgroundColor = service.color || '#5AC8FA';
              const textColor = service.textColor || service.color || '#5AC8FA';
              const buttonColors = service.buttonColor?.split('|') || [backgroundColor, backgroundColor];
              const mainButtonColor = buttonColors[0] || backgroundColor;
              
              return (
                <div
                  key={service.id}
                  onClick={() => navigate(`/mobile-app/app/services/${service.slug || service.id}`)}
                  className="bg-white rounded-xl p-5 border border-border/50 hover:border-ifind-aqua/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${backgroundColor}33` }} // 20% opacity
                    >
                      <service.icon 
                        className="h-8 w-8" 
                        style={{ color: textColor }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-poppins font-semibold text-ifind-charcoal text-lg leading-tight">
                          {service.title}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.formattedDuration || service.duration || '50 min'}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            4.8
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            120+ experts
                          </div>
                        </div>
                        
                        <Badge 
                          className="text-white text-xs"
                          style={{ backgroundColor: mainButtonColor }}
                        >
                          Popular
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Benefits Preview */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="flex flex-wrap gap-2">
                        {service.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-background/50 border-ifind-aqua/20 text-muted-foreground"
                          >
                            {benefit.length > 30 ? `${benefit.substring(0, 30)}...` : benefit}
                          </Badge>
                        ))}
                        {service.benefits.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-background/50 border-ifind-aqua/20 text-ifind-aqua">
                            +{service.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-poppins font-medium text-ifind-charcoal mb-2">
              No services found
            </h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};