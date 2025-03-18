
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchSort from '@/components/experts/SearchSort';
import FilterPanel from '@/components/experts/FilterPanel';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import { Expert } from '@/types/expert';

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  // Filter state
  const [specialties, setSpecialties] = useState({
    anxiety: false,
    depression: false,
    stress: false,
    relationships: false,
    trauma: false,
    selfEsteem: false,
  });
  
  const [languages, setLanguages] = useState({
    english: false,
    hindi: false,
    tamil: false,
    telugu: false,
    kannada: false,
  });

  const [experience, setExperience] = useState({
    lessThan5: false,
    between5And10: false,
    moreThan10: false,
  });

  // Sample expert data
  const expertData: Expert[] = [
    {
      id: 1,
      name: "Dr. Raman Sharma",
      experience: 15,
      specialties: ["Anxiety", "Depression", "CBT"],
      rating: 4.9,
      consultations: 2300,
      price: 30,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2070&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi"],
    },
    {
      id: 2,
      name: "Dr. Maya Patel",
      experience: 10,
      specialties: ["Trauma", "EMDR"],
      rating: 4.8,
      consultations: 1800,
      price: 25,
      waitTime: "5 min wait",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi", "Tamil"],
    },
    {
      id: 3,
      name: "Dr. Pranav Gupta",
      experience: 12,
      specialties: ["Stress", "Mindfulness"],
      rating: 4.7,
      consultations: 1500,
      price: 35,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi"],
    },
    {
      id: 4,
      name: "Dr. Kavita Joshi",
      experience: 8,
      specialties: ["Relationships", "Family Therapy"],
      rating: 4.6,
      consultations: 1200,
      price: 28,
      waitTime: "10 min wait",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi", "Kannada"],
    },
    {
      id: 5,
      name: "Dr. Vijay Kumar",
      experience: 20,
      specialties: ["Anxiety", "Self-Esteem", "Depression"],
      rating: 4.9,
      consultations: 3000,
      price: 45,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi", "Telugu"],
    },
    {
      id: 6,
      name: "Dr. Lakshmi Iyer",
      experience: 7,
      specialties: ["Youth Counseling", "Behavioral Therapy"],
      rating: 4.5,
      consultations: 980,
      price: 22,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
      online: true,
      languages: ["English", "Tamil", "Telugu"],
    },
  ];

  const handleResetFilters = () => {
    setSpecialties({
      anxiety: false,
      depression: false,
      stress: false,
      relationships: false,
      trauma: false,
      selfEsteem: false,
    });
    setLanguages({
      english: false,
      hindi: false,
      tamil: false,
      telugu: false,
      kannada: false,
    });
    setExperience({
      lessThan5: false,
      between5And10: false,
      moreThan10: false,
    });
    setPriceRange([0, 100]);
    setFilterCount(0);
  };

  // Filter function
  const filteredExperts = expertData.filter((expert) => {
    // Apply search filter
    if (searchTerm && !expert.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply price filter
    if (expert.price < priceRange[0] || expert.price > priceRange[1]) {
      return false;
    }
    
    // Apply specialties filter
    const hasSelectedSpecialty = Object.values(specialties).some(value => value);
    if (hasSelectedSpecialty) {
      const expertSpecialtiesLower = expert.specialties.map(s => s.toLowerCase());
      const matchesSpecialty = Object.entries(specialties).some(([key, value]) => {
        return value && expertSpecialtiesLower.includes(key.toLowerCase());
      });
      if (!matchesSpecialty) return false;
    }
    
    // Apply language filter
    const hasSelectedLanguage = Object.values(languages).some(value => value);
    if (hasSelectedLanguage) {
      const expertLanguagesLower = expert.languages.map(l => l.toLowerCase());
      const matchesLanguage = Object.entries(languages).some(([key, value]) => {
        return value && expertLanguagesLower.includes(key);
      });
      if (!matchesLanguage) return false;
    }
    
    // Apply experience filter
    const hasSelectedExperience = Object.values(experience).some(value => value);
    if (hasSelectedExperience) {
      if (experience.lessThan5 && expert.experience >= 5) {
        if (!experience.between5And10 && !experience.moreThan10) return false;
      }
      if (experience.between5And10 && (expert.experience < 5 || expert.experience > 10)) {
        if (!experience.lessThan5 && !experience.moreThan10) return false;
      }
      if (experience.moreThan10 && expert.experience <= 10) {
        if (!experience.lessThan5 && !experience.between5And10) return false;
      }
    }
    
    return true;
  });

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.values(specialties).forEach(value => { if (value) count++; });
    Object.values(languages).forEach(value => { if (value) count++; });
    Object.values(experience).forEach(value => { if (value) count++; });
    if (priceRange[0] > 0 || priceRange[1] < 100) count++;
    setFilterCount(count);
  }, [specialties, languages, experience, priceRange]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-ifind-charcoal text-white py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Our Mental Health Experts</h1>
          <p className="text-ifind-offwhite/80">Connect with licensed professionals for personalized support</p>
        </div>
      </div>
      
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              specialties={specialties}
              setSpecialties={setSpecialties}
              languages={languages}
              setLanguages={setLanguages}
              experience={experience}
              setExperience={setExperience}
              filterCount={filterCount}
              onResetFilters={handleResetFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
            
            <div className="lg:w-3/4">
              <SearchSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              
              <ExpertsGrid
                experts={filteredExperts}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Experts;
