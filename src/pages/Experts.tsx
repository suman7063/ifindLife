
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Phone, Mail } from 'lucide-react';

const Experts = () => {
  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Clinical Psychology",
      experience: "8+ years",
      rating: 4.8,
      reviews: 124,
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
      bio: "Specializes in anxiety, depression, and cognitive behavioral therapy with a compassionate approach.",
      languages: ["English", "Spanish"],
      availability: "Available Today"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Marriage & Family Therapy",
      experience: "12+ years",
      rating: 4.9,
      reviews: 89,
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
      bio: "Expert in relationship counseling and family dynamics with multicultural sensitivity.",
      languages: ["English", "Mandarin"],
      availability: "Available Tomorrow"
    },
    {
      id: 3,
      name: "Dr. Lisa Thompson",
      specialization: "Trauma & PTSD Therapy",
      experience: "10+ years",
      rating: 4.7,
      reviews: 156,
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?q=80&w=2070&auto=format&fit=crop",
      bio: "Specialized in trauma recovery and EMDR therapy for healing and resilience building.",
      languages: ["English"],
      availability: "Available This Week"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Addiction Counseling",
      experience: "15+ years",
      rating: 4.6,
      reviews: 203,
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop",
      bio: "Comprehensive addiction treatment and recovery support with holistic approaches.",
      languages: ["English", "French"],
      availability: "Available Today"
    },
    {
      id: 5,
      name: "Dr. Emma Rodriguez",
      specialization: "Child & Adolescent Psychology",
      experience: "9+ years",
      rating: 4.8,
      reviews: 97,
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
      bio: "Dedicated to helping children and teens navigate emotional and behavioral challenges.",
      languages: ["English", "Spanish"],
      availability: "Available Tomorrow"
    },
    {
      id: 6,
      name: "Dr. David Clarke",
      specialization: "Mindfulness & Meditation",
      experience: "11+ years",
      rating: 4.9,
      reviews: 142,
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=2070&auto=format&fit=crop",
      bio: "Integrates mindfulness practices with traditional therapy for holistic healing.",
      languages: ["English"],
      availability: "Available This Week"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mental Health Experts</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with qualified professionals who are here to support your wellness journey. Our licensed therapists and counselors are ready to help you achieve your mental health goals.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search by name</label>
                <input 
                  type="text" 
                  placeholder="Search experts..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ifind-aqua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ifind-aqua">
                  <option>All Specializations</option>
                  <option>Clinical Psychology</option>
                  <option>Marriage & Family Therapy</option>
                  <option>Trauma & PTSD</option>
                  <option>Addiction Counseling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ifind-aqua">
                  <option>All Locations</option>
                  <option>New York, NY</option>
                  <option>Los Angeles, CA</option>
                  <option>Chicago, IL</option>
                  <option>Miami, FL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ifind-aqua">
                  <option>Any Time</option>
                  <option>Available Today</option>
                  <option>Available Tomorrow</option>
                  <option>Available This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={expert.image} 
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{expert.name}</h3>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {expert.availability}
                    </span>
                  </div>
                  
                  <p className="text-ifind-aqua font-medium mb-2">{expert.specialization}</p>
                  <p className="text-gray-600 text-sm mb-3">{expert.bio}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{expert.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({expert.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{expert.location}</span>
                    <span className="ml-4">{expert.experience} experience</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Languages: {expert.languages.join(', ')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">
                      Book Session
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Can't find the right expert for you? Let us help you find the perfect match.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call Us: +91 9355966925
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email: connect@ifindlife.com
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Experts;
