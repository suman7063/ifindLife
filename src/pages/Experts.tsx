
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  bio: string;
  average_rating: number;
  reviews_count: number;
  profile_picture: string;
  city: string;
  country: string;
}

const Experts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);

  // Sample experts data in case database is empty
  const sampleExperts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Clinical Psychology',
      experience: '8 years',
      bio: 'Specialized in anxiety, depression, and trauma therapy. Passionate about helping individuals find their path to mental wellness.',
      average_rating: 4.9,
      reviews_count: 127,
      profile_picture: '/lovable-uploads/50267abc-f35e-4528-a0cf-90d80e5e5f84.png',
      city: 'New York',
      country: 'USA'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Relationship Counseling',
      experience: '12 years',
      bio: 'Expert in couples therapy and family counseling. Helping relationships thrive through evidence-based approaches.',
      average_rating: 4.8,
      reviews_count: 89,
      profile_picture: '/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png',
      city: 'Los Angeles',
      country: 'USA'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Life Coaching',
      experience: '6 years',
      bio: 'Empowering individuals to achieve their goals through personalized coaching strategies and mindfulness practices.',
      average_rating: 4.7,
      reviews_count: 156,
      profile_picture: '/lovable-uploads/58321caf-3b5b-4a9d-91a1-44514ae2000b.png',
      city: 'Chicago',
      country: 'USA'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialization: 'Stress Management',
      experience: '10 years',
      bio: 'Specialist in workplace stress, burnout prevention, and executive coaching for high-performing professionals.',
      average_rating: 4.9,
      reviews_count: 203,
      profile_picture: '/lovable-uploads/6c427c55-7a38-4dad-8c60-cc782cbc5bd7.png',
      city: 'Seattle',
      country: 'USA'
    }
  ];

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    filterExperts();
  }, [experts, searchTerm, selectedSpecialty]);

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .limit(20);

      if (error) {
        console.error('Error fetching experts:', error);
        setExperts(sampleExperts);
      } else if (data && data.length > 0) {
        setExperts(data);
      } else {
        setExperts(sampleExperts);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      setExperts(sampleExperts);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = experts;

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(expert =>
        expert.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    setFilteredExperts(filtered);
  };

  const specialties = ['All', 'Clinical Psychology', 'Relationship Counseling', 'Life Coaching', 'Stress Management', 'Trauma Therapy'];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-20">
          <Container>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading experts...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mental Health Experts</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with qualified professionals who are here to support your wellness journey. All our experts are licensed and experienced in their specialties.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={expert.profile_picture || '/lovable-uploads/50267abc-f35e-4528-a0cf-90d80e5e5f84.png'}
                      alt={expert.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold">{expert.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mb-2">
                      {expert.specialization}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {expert.experience} experience
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {expert.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(expert.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{expert.average_rating}</span>
                    <span className="text-sm text-gray-500">({expert.reviews_count} reviews)</span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">{expert.bio}</p>

                  <div className="space-y-2">
                    <Link to={`/expert/${expert.id}`}>
                      <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white">
                      Book Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No experts found matching your criteria. Please try different search terms or filters.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center bg-white rounded-lg p-8 shadow-md mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't Find the Right Expert?</h2>
            <p className="text-gray-600 mb-6">
              Our team can help match you with the perfect mental health professional based on your specific needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white">
                  Get Personalized Matching
                </Button>
              </Link>
              <Link to="/mental-health-assessment">
                <Button variant="outline" className="border-ifind-teal text-ifind-teal hover:bg-ifind-teal hover:text-white">
                  Take Assessment First
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Experts;
