
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AstrologerCard from '@/components/AstrologerCard';
import Footer from '@/components/Footer';

const Astrologers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  // Specialties filter checkboxes
  const [specialties, setSpecialties] = useState({
    vedic: false,
    tarot: false,
    numerology: false,
    palmistry: false,
    vastu: false,
    kundli: false,
  });
  
  // Languages filter checkboxes
  const [languages, setLanguages] = useState({
    english: false,
    hindi: false,
    tamil: false,
    telugu: false,
    kannada: false,
  });

  // Experience filter checkboxes
  const [experience, setExperience] = useState({
    lessThan5: false,
    between5And10: false,
    moreThan10: false,
  });

  // Sample astrologer data
  const astrologerData = [
    {
      id: 1,
      name: "Acharya Raman",
      experience: 15,
      specialties: ["Vedic", "Palmistry", "Tarot"],
      rating: 4.9,
      consultations: 35000,
      price: 30,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2070&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi"],
    },
    {
      id: 2,
      name: "Maya Sharma",
      experience: 10,
      specialties: ["Numerology", "Tarot"],
      rating: 4.8,
      consultations: 18500,
      price: 25,
      waitTime: "5 min wait",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi", "Tamil"],
    },
    {
      id: 3,
      name: "Guru Pranav",
      experience: 12,
      specialties: ["Kundli", "Horoscope"],
      rating: 4.7,
      consultations: 22800,
      price: 35,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi"],
    },
    {
      id: 4,
      name: "Kavita Joshi",
      experience: 8,
      specialties: ["Tarot", "Psychic"],
      rating: 4.6,
      consultations: 12600,
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
      specialties: ["Vedic", "Vastu", "Kundli"],
      rating: 4.9,
      consultations: 42000,
      price: 45,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
      online: true,
      languages: ["English", "Hindi", "Telugu"],
    },
    {
      id: 6,
      name: "Lakshmi Iyer",
      experience: 7,
      specialties: ["Numerology", "Palmistry"],
      rating: 4.5,
      consultations: 9800,
      price: 22,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
      online: true,
      languages: ["English", "Tamil", "Telugu"],
    },
  ];

  const handleResetFilters = () => {
    setSpecialties({
      vedic: false,
      tarot: false,
      numerology: false,
      palmistry: false,
      vastu: false,
      kundli: false,
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
  const filteredAstrologers = astrologerData.filter((astrologer) => {
    // Apply search filter
    if (searchTerm && !astrologer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply price filter
    if (astrologer.price < priceRange[0] || astrologer.price > priceRange[1]) {
      return false;
    }
    
    // Apply specialties filter
    const hasSelectedSpecialty = Object.values(specialties).some(value => value);
    if (hasSelectedSpecialty) {
      const astrologerSpecialtiesLower = astrologer.specialties.map(s => s.toLowerCase());
      const matchesSpecialty = Object.entries(specialties).some(([key, value]) => {
        return value && astrologerSpecialtiesLower.includes(key);
      });
      if (!matchesSpecialty) return false;
    }
    
    // Apply language filter
    const hasSelectedLanguage = Object.values(languages).some(value => value);
    if (hasSelectedLanguage) {
      const astrologerLanguagesLower = astrologer.languages.map(l => l.toLowerCase());
      const matchesLanguage = Object.entries(languages).some(([key, value]) => {
        return value && astrologerLanguagesLower.includes(key);
      });
      if (!matchesLanguage) return false;
    }
    
    // Apply experience filter
    const hasSelectedExperience = Object.values(experience).some(value => value);
    if (hasSelectedExperience) {
      if (experience.lessThan5 && astrologer.experience >= 5) {
        if (!experience.between5And10 && !experience.moreThan10) return false;
      }
      if (experience.between5And10 && (astrologer.experience < 5 || astrologer.experience > 10)) {
        if (!experience.lessThan5 && !experience.moreThan10) return false;
      }
      if (experience.moreThan10 && astrologer.experience <= 10) {
        if (!experience.lessThan5 && !experience.between5And10) return false;
      }
    }
    
    return true;
  });

  // Count active filters
  React.useEffect(() => {
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
      <div className="bg-astro-deep-blue text-white py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Our Astrologers</h1>
          <p className="text-astro-stardust/80">Connect with verified experts for personalized guidance</p>
        </div>
      </div>
      
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {filterCount > 0 && (
                    <Badge className="ml-2 bg-astro-purple">{filterCount}</Badge>
                  )}
                </div>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Desktop Filter Sidebar */}
            <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="p-6 border rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  {filterCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm h-auto py-1 px-2 hover:text-astro-purple"
                      onClick={handleResetFilters}
                    >
                      Reset All
                    </Button>
                  )}
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range (₹/min)</h4>
                  <div className="mb-4">
                    <Slider 
                      defaultValue={[0, 100]} 
                      max={100} 
                      step={1} 
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-2"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Specialties Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Specialties</h4>
                  <div className="space-y-2">
                    {Object.entries(specialties).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`specialty-${key}`} 
                          checked={value}
                          onCheckedChange={(checked) => 
                            setSpecialties({...specialties, [key]: !!checked})
                          }
                          className="data-[state=checked]:bg-astro-purple data-[state=checked]:border-astro-purple"
                        />
                        <label 
                          htmlFor={`specialty-${key}`}
                          className="text-sm font-medium capitalize cursor-pointer"
                        >
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Languages</h4>
                  <div className="space-y-2">
                    {Object.entries(languages).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`language-${key}`} 
                          checked={value}
                          onCheckedChange={(checked) => 
                            setLanguages({...languages, [key]: !!checked})
                          }
                          className="data-[state=checked]:bg-astro-purple data-[state=checked]:border-astro-purple"
                        />
                        <label 
                          htmlFor={`language-${key}`}
                          className="text-sm font-medium capitalize cursor-pointer"
                        >
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Experience Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Experience</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="exp-less-than-5" 
                        checked={experience.lessThan5}
                        onCheckedChange={(checked) => 
                          setExperience({...experience, lessThan5: !!checked})
                        }
                        className="data-[state=checked]:bg-astro-purple data-[state=checked]:border-astro-purple"
                      />
                      <label 
                        htmlFor="exp-less-than-5"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Less than 5 years
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="exp-5-to-10" 
                        checked={experience.between5And10}
                        onCheckedChange={(checked) => 
                          setExperience({...experience, between5And10: !!checked})
                        }
                        className="data-[state=checked]:bg-astro-purple data-[state=checked]:border-astro-purple"
                      />
                      <label 
                        htmlFor="exp-5-to-10"
                        className="text-sm font-medium cursor-pointer"
                      >
                        5-10 years
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="exp-more-than-10" 
                        checked={experience.moreThan10}
                        onCheckedChange={(checked) => 
                          setExperience({...experience, moreThan10: !!checked})
                        }
                        className="data-[state=checked]:bg-astro-purple data-[state=checked]:border-astro-purple"
                      />
                      <label 
                        htmlFor="exp-more-than-10"
                        className="text-sm font-medium cursor-pointer"
                      >
                        More than 10 years
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Astrologers List */}
            <div className="lg:w-3/4">
              {/* Search and Sort */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder="Search astrologers by name"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Results */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAstrologers.length} results
                </p>
                <div className="flex items-center space-x-1">
                  <p className="text-sm">Sort by:</p>
                  <Button variant="ghost" size="sm" className="text-sm">
                    Rating
                    <Star className="ml-1 h-3 w-3 fill-astro-gold text-astro-gold" />
                  </Button>
                </div>
              </div>
              
              {/* Astrologer Grid */}
              {filteredAstrologers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAstrologers.map((astrologer) => (
                    <AstrologerCard key={astrologer.id} {...astrologer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-lg font-medium mb-2">No astrologers found</p>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
                  <Button 
                    variant="outline" 
                    className="border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Astrologers;
