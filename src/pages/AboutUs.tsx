
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, BrainCircuit, Globe, Briefcase, GraduationCap, Heart, Building } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dev OM",
      title: "Cofounder and Chief Mentor",
      bio: "With over 20 years of global experience in emotional and mental wellness coaching, Master Dev Om is a globally recognized mindfulness and meditation coach. He was directly trained by father of mindfulness - Thich Nhat Hanh and the Dalai Lama. He created 'Light Mindfulness Meditation,' authored 9 books, and has trained and certified hundreds of meditation & mindfulness coaches worldwide.",
      image: "/lovable-uploads/7069b4db-6802-4e03-b1f1-bf1f03d2c176.png",
      highlights: [
        { icon: <BrainCircuit className="h-4 w-4" />, text: "Creator of 'Light Mindfulness Meditation'" },
        { icon: <BookOpen className="h-4 w-4" />, text: "Author of 9 books on mindfulness" },
        { icon: <Award className="h-4 w-4" />, text: "Trained by Thich Nhat Hanh and the Dalai Lama" }
      ]
    },
    {
      id: 2,
      name: "Dushyant Kohli",
      title: "Cofounder and CEO",
      bio: "Dushyant Kohli is a seasoned entrepreneur and Indian OTT veteran with co-founding experience (Khabri & Beatcast) and over a decade of CXO and growth hacking expertise. He has led B2C and B2B businesses across OTT, Edtech, podcasting, and gaming, and is also a certified Meditation teacher & Mindfulness Coach. He is an MBA from Ecole Des Pont Business School and PMP certification.",
      image: "/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png",
      highlights: [
        { icon: <Briefcase className="h-4 w-4" />, text: "Co-founded Khabri & Beatcast" },
        { icon: <Globe className="h-4 w-4" />, text: "Led B2C and B2B businesses across multiple industries" },
        { icon: <GraduationCap className="h-4 w-4" />, text: "MBA from Ecole Des Pont Business School" }
      ]
    },
    {
      id: 3,
      name: "Dr. Bhavna Khurana",
      title: "Programme Director at iFindLife (UK)",
      bio: "Dr. Bhavna Khurana, with over 20 years of global experience, is a PhD scholar in Cardiac Wellness and a pioneer in heart disease reversal through lifestyle change and mindfulness. She is the founder of I AM Fit (Singapore) and Soulversity (UK), offering mind-body wellness solutions. A certified Lifestyle Medicine Practitioner, Mindfulness Coach, and Meditation Teacher, Dr. Bhavna specializes in workplace wellness and mental health support through global Employee Assistance Programs (EAPs).",
      image: "/lovable-uploads/1b420877-7be1-4010-b806-5850cb719642.png",
      highlights: [
        { icon: <Heart className="h-4 w-4" />, text: "PhD in Cardiac Wellness & Founder of I AM Fit" },
        { icon: <BrainCircuit className="h-4 w-4" />, text: "Mindfulness Coach & Workplace Wellness Specialist" },
        { icon: <GraduationCap className="h-4 w-4" />, text: "Certified Lifestyle Medicine & Weight Management Coach" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section with updated background color */}
        <section className="bg-gradient-to-r from-ifind-teal/20 to-ifind-purple/20 text-ifind-charcoal py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About iFindLife</h1>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Founded by experts in mental wellness and technology, iFindLife is dedicated to making mental health support accessible, effective, and personalized for everyone.
            </p>
          </div>
        </section>
        
        {/* Mission section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-8">
                At iFindLife, we believe that mental wellbeing is fundamental to living a fulfilled life. Our mission is to bridge the gap between traditional mental healthcare and modern technology, providing personalized mental wellness solutions that are accessible to everyone, regardless of their background or location.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-ifind-aqua/10 rounded-lg">
                  <div className="bg-ifind-aqua text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">Quality Care</h3>
                  <p className="text-gray-600 text-sm">Expert mental health professionals with proven track records</p>
                </div>
                
                <div className="text-center p-6 bg-ifind-purple/10 rounded-lg">
                  <div className="bg-ifind-purple text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">Accessibility</h3>
                  <p className="text-gray-600 text-sm">Breaking barriers to mental healthcare through technology</p>
                </div>
                
                <div className="text-center p-6 bg-ifind-teal/10 rounded-lg">
                  <div className="bg-ifind-teal text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">Applying the latest research and technology to mental wellness</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section with redesigned cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-10 text-center">Our Leadership Team</h2>
            
            <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative">
                    {/* Decorative element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ifind-aqua/20 to-ifind-purple/20 h-2 w-full" />
                    
                    <div className="flex flex-col md:flex-row">
                      {/* Left side - Image with gradient overlay */}
                      <div className="md:w-1/3 p-6 flex items-center justify-center bg-gradient-to-br from-ifind-teal/10 to-ifind-purple/10">
                        <div className="relative">
                          <Avatar className="h-40 w-40 ring-2 ring-white ring-offset-2 ring-offset-ifind-teal/20">
                            <AvatarImage 
                              src={member.image} 
                              alt={member.name} 
                              className={`object-cover ${member.id === 3 ? 'object-top' : ''}`} 
                            />
                            <AvatarFallback className="bg-ifind-teal text-white text-xl">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-2 -right-2 bg-ifind-aqua text-white text-xs py-1 px-2 rounded-full">
                            Founder
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Content */}
                      <div className="md:w-2/3 p-6">
                        <CardHeader className="pb-2 pt-0 px-0 md:pt-0">
                          <CardTitle className="text-2xl font-bold text-ifind-charcoal">{member.name}</CardTitle>
                          <CardDescription className="font-medium text-ifind-teal">{member.title}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <p className="text-gray-700 mb-4 leading-relaxed">{member.bio}</p>
                          
                          <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                            <h4 className="text-sm font-semibold text-ifind-charcoal mb-2">Key Highlights</h4>
                            <div className="space-y-2">
                              {member.highlights.map((highlight, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                  <div className="bg-ifind-teal/10 p-2 rounded-full text-ifind-teal group-hover:bg-ifind-teal group-hover:text-white transition-colors">
                                    {highlight.icon}
                                  </div>
                                  <p className="text-sm">{highlight.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-0 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex gap-2">
                            <div className="text-xs px-3 py-1 bg-ifind-aqua/10 text-ifind-aqua rounded-full">Mindfulness</div>
                            <div className="text-xs px-3 py-1 bg-ifind-purple/10 text-ifind-purple rounded-full">Wellness</div>
                            <div className="text-xs px-3 py-1 bg-ifind-teal/10 text-ifind-teal rounded-full">Mental Health</div>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Values section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-medium mb-2 text-ifind-teal">Compassion</h3>
                  <p className="text-gray-600 text-sm">We approach every individual with empathy and understanding, recognizing that each person's journey is unique.</p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-medium mb-2 text-ifind-teal">Excellence</h3>
                  <p className="text-gray-600 text-sm">We strive for the highest standards in the mental health services we provide, continuously improving our approach.</p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-medium mb-2 text-ifind-teal">Inclusivity</h3>
                  <p className="text-gray-600 text-sm">We believe mental health support should be accessible to everyone, regardless of background or circumstances.</p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-medium mb-2 text-ifind-teal">Innovation</h3>
                  <p className="text-gray-600 text-sm">We embrace technology and new approaches to enhance the effectiveness and reach of mental health support.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
