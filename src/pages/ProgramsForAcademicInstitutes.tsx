
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Target, Phone, Mail } from 'lucide-react';

const ProgramsForAcademicInstitutes: React.FC = () => {
  const programs = [
    {
      title: "Student Mental Health Support",
      description: "Comprehensive mental health programs for students dealing with academic stress, anxiety, and social pressures.",
      features: ["Individual counseling", "Group therapy sessions", "Crisis intervention", "Stress management workshops"],
      price: "Contact for pricing",
      duration: "Ongoing support"
    },
    {
      title: "Faculty Wellness Program",
      description: "Support programs for teachers and faculty members to manage work-related stress and maintain work-life balance.",
      features: ["Burnout prevention", "Work-life balance coaching", "Peer support groups", "Mental health resources"],
      price: "Contact for pricing",
      duration: "Quarterly programs"
    },
    {
      title: "Campus-wide Mental Health Initiative",
      description: "Institutional programs to create a mentally healthy campus environment with awareness and prevention.",
      features: ["Mental health awareness campaigns", "Training programs", "Policy development", "Resource centers"],
      price: "Contact for pricing",
      duration: "Annual programs"
    }
  ];

  const benefits = [
    {
      icon: <GraduationCap className="h-8 w-8 text-ifind-teal" />,
      title: "Improved Academic Performance",
      description: "Students with better mental health show improved focus, learning capacity, and academic achievement."
    },
    {
      icon: <Users className="h-8 w-8 text-ifind-teal" />,
      title: "Enhanced Campus Community",
      description: "Create a supportive environment where students and staff feel valued and understood."
    },
    {
      icon: <Target className="h-8 w-8 text-ifind-teal" />,
      title: "Reduced Dropout Rates",
      description: "Mental health support significantly reduces student dropout rates and improves retention."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-ifind-teal" />,
      title: "Faculty Development",
      description: "Support educators in managing their own well-being to better serve their students."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mental Health Programs for Academic Institutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive mental health solutions for schools, colleges, and universities to support students, faculty, and staff
            </p>
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
              Request Consultation
            </Button>
          </div>
        </Container>
      </div>

      {/* Programs Section */}
      <div className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Academic Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tailored mental health programs designed specifically for educational institutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-ifind-teal rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{program.price}</span>
                      <span className="text-sm text-gray-500">{program.duration}</span>
                    </div>
                    <Button className="w-full mt-4 bg-ifind-teal hover:bg-ifind-teal/90">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Academic Programs?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Evidence-based programs that create lasting positive impact on your educational community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Contact us to discuss how we can create a customized mental health program for your institution
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5 text-ifind-teal" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5 text-ifind-teal" />
                <span>academic@ifindlove.com</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ifind-teal hover:bg-ifind-teal/90">
                Schedule Consultation
              </Button>
              <Button variant="outline">
                Download Brochure
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramsForAcademicInstitutes;
