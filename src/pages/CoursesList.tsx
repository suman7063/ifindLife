
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/courses';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, Star, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { renderIcon } from '@/components/admin/sessions/sessionIcons';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const CoursesList: React.FC = () => {
  const { courses, loading } = useCourses();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get all unique categories
  const categories = Array.from(new Set(courses.map(course => course.category)));
  
  // Filter courses based on search query and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleCourseClick = (course: Course) => {
    navigate(`/course-preview/${course.id}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Issue-Based Learning Sessions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Self-paced video courses to help you understand and address specific issues
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="h-10"
            >
              All Categories
            </Button>
            
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="h-10"
              >
                {category.replace(/-/g, ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader className="px-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="px-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter className="px-6 flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card 
                key={course.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCourseClick(course)}
              >
                <div className="aspect-video w-full relative">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary">
                      Preview Course
                    </Button>
                  </div>
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className={`w-8 h-8 ${course.color} rounded-full flex items-center justify-center`}>
                      {renderIcon(course.icon)}
                    </div>
                  </div>
                </div>
                
                <CardHeader className="px-6">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {course.enrollmentCount}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-6">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {course.description}
                  </p>
                  
                  {course.instructorName && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img 
                          src={course.instructorImageUrl} 
                          alt={course.instructorName}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="text-sm">{course.instructorName}</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="px-6 flex justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1">{course.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <div className="font-bold text-lg">
                    ₹{course.price}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try changing your search terms or filters
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursesList;
