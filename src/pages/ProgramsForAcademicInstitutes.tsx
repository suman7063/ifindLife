import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, BookOpen, GraduationCap } from 'lucide-react';

const ProgramsForAcademicInstitutes = () => {
  const academicPrograms = [
    {
      id: 1,
      title: "Student Stress Management Program",
      description: "Comprehensive program designed to help students manage academic stress, exam anxiety, and maintain mental wellness during their studies.",
      category: "Stress Management",
      duration: "8 weeks",
      sessions: 16,
      price: 299.99,
      image: "/lovable-uploads/program-exam.jpg",
      features: [
        "Exam anxiety reduction techniques",
        "Time management skills",
        "Mindfulness practices for students",
        "Group sessions and peer support"
      ],
      targetAudience: "High school and college students",
      expert: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Academic Performance Enhancement",
      description: "Evidence-based program to improve focus, concentration, and academic performance through mental wellness techniques.",
      category: "Performance Enhancement",
      duration: "10 weeks",
      sessions: 20,
      price: 399.99,
      image: "/lovable-uploads/program-time.jpg",
      features: [
        "Cognitive enhancement techniques",
        "Memory improvement strategies",
        "Focus and attention training",
        "Study optimization methods"
      ],
      targetAudience: "University students and researchers",
      expert: "Prof. Michael Chen"
    },
    {
      id: 3,
      title: "Educator Wellness Program",
      description: "Specialized program for teachers and educators to manage burnout, stress, and maintain mental wellness while supporting students.",
      category: "Educator Support",
      duration: "6 weeks",
      sessions: 12,
      price: 249.99,
      image: "/lovable-uploads/program-leadership.jpg",
      features: [
        "Burnout prevention strategies",
        "Classroom stress management",
        "Work-life balance techniques",
        "Student support strategies"
      ],
      targetAudience: "Teachers and educational staff",
      expert: "Dr. Emily Rodriguez"
    }
  ];

  return (
    <>
      <Navbar />
      
      <Container className="py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Programs for Academic Institutes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized mental wellness programs designed for educational institutions, students, and educators to enhance academic performance and well-being.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <GraduationCap className="h-8 w-8 text-ifind-teal" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Students Helped</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-ifind-teal" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600">Institutions</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-8 w-8 text-ifind-teal" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">15+</h3>
              <p className="text-gray-600">Program Modules</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-ifind-teal" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {academicPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:order-2">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:order-1 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-md bg-ifind-aqua/10 px-2 py-1 text-xs font-medium text-ifind-aqua ring-1 ring-inset ring-ifind-aqua/20">
                          {program.category}
                        </span>
                      </div>
                      <CardTitle className="text-2xl">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <p className="text-gray-600">{program.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Duration:</span> {program.duration}
                        </div>
                        <div>
                          <span className="font-semibold">Sessions:</span> {program.sessions}
                        </div>
                        <div>
                          <span className="font-semibold">Target:</span> {program.targetAudience}
                        </div>
                        <div>
                          <span className="font-semibold">Expert:</span> {program.expert}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Program Features:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {program.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-2xl font-bold text-ifind-teal">${program.price}</span>
                          <span className="text-gray-500 ml-1">per program</span>
                        </div>
                        <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-ifind-aqua/10 to-ifind-lavender/10 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of educational institutions that have already implemented our mental wellness programs and seen remarkable improvements in student and educator well-being.
            </p>
            <Button size="lg" className="bg-ifind-teal hover:bg-ifind-teal/90">
              Contact Us for Institutional Programs
            </Button>
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default ProgramsForAcademicInstitutes;
