
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, TrendingUp, Shield, Users, Phone, Mail } from 'lucide-react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

const ProgramsForBusiness: React.FC = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  // Ensure page loads from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs = [
    {
      title: "Employee Assistance Program (EAP)",
      description: "Comprehensive mental health support for your employees with 24/7 access to counselors and resources.",
      features: ["24/7 helpline", "Individual counseling", "Work-life balance support", "Crisis intervention"],
      price: "From ₹500/employee/month",
      duration: "Annual contracts"
    },
    {
      title: "Leadership Wellness Coaching",
      description: "Specialized programs for executives and managers to maintain mental wellness while leading teams effectively.",
      features: ["Executive coaching", "Stress management", "Decision-making support", "Leadership development"],
      price: "From ₹25,000/month",
      duration: "6-12 month programs"
    },
    {
      title: "Workplace Mental Health Training",
      description: "Training programs to create mentally healthy workplaces and improve team dynamics.",
      features: ["Manager training", "Team workshops", "Mental health awareness", "Policy development"],
      price: "From ₹15,000/session",
      duration: "Custom duration"
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-ifind-teal" />,
      title: "Increased Productivity",
      description: "Employees with better mental health are more productive, creative, and engaged at work."
    },
    {
      icon: <Shield className="h-8 w-8 text-ifind-teal" />,
      title: "Reduced Absenteeism",
      description: "Mental health support significantly reduces sick days and improves employee retention."
    },
    {
      icon: <Users className="h-8 w-8 text-ifind-teal" />,
      title: "Better Team Dynamics",
      description: "Improved communication and collaboration through enhanced emotional intelligence."
    },
    {
      icon: <Briefcase className="h-8 w-8 text-ifind-teal" />,
      title: "Employer Brand Enhancement",
      description: "Attract and retain top talent by demonstrating commitment to employee wellbeing."
    }
  ];

  const industries = [
    "Technology & IT",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Retail & E-commerce",
    "Education",
    "Government",
    "Non-profit Organizations"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section - Brand Color Theme */}
      <div className="bg-gradient-to-br from-ifind-teal/10 to-ifind-aqua/10 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mental Health Solutions for Businesses
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive workplace mental health programs to enhance employee wellbeing, productivity, and create a positive work culture
            </p>
            <Button 
              className="bg-ifind-teal hover:bg-ifind-teal/90 text-white"
              onClick={() => setIsLeadFormOpen(true)}
            >
              Inquire Now
            </Button>
          </div>
        </Container>
      </div>

      {/* Programs Section */}
      <div className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Business Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scalable mental health solutions designed for organizations of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="h-full border-ifind-aqua/30 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-ifind-charcoal">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-ifind-aqua rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="mb-2">
                      <span className="font-semibold text-lg">{program.price}</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">{program.duration}</span>
                    </div>
                    <Button 
                      className="w-full bg-ifind-aqua hover:bg-ifind-aqua/90 text-white"
                      onClick={() => setIsLeadFormOpen(true)}
                    >
                      Inquire Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-ifind-offwhite">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Invest in Employee Mental Health?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The business case for workplace mental health is clear - happier employees drive better business outcomes
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

      {/* Industries Section */}
      <div className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our programs are tailored to meet the specific needs of various industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border border-ifind-teal/20">
                <span className="text-gray-700 font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Contact Section - Brand Color Theme */}
      <div className="py-16 bg-ifind-teal text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workplace?</h2>
            <p className="text-white/90 mb-8">
              Let's discuss how our mental health programs can benefit your organization and employees
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5" />
                <span>+91 9355966925</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5" />
                <span>business@ifindlife.com</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-ifind-teal hover:bg-gray-100"
                onClick={() => setIsLeadFormOpen(true)}
              >
                Inquire Now
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-ifind-teal"
                onClick={() => setIsLeadFormOpen(true)}
              >
                Download Case Studies
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Footer />

      <LeadCaptureForm
        open={isLeadFormOpen}
        onOpenChange={setIsLeadFormOpen}
        title="Business Mental Health Solutions Inquiry"
        type="business"
      />
    </div>
  );
};

export default ProgramsForBusiness;
