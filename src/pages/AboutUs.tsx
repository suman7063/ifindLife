import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, BrainCircuit, Globe, Briefcase, GraduationCap, Heart, Building, GraduationCap as Education } from 'lucide-react';
const AboutUs = () => {
  const teamMembers = [{
    id: 1,
    name: "Dev OM",
    title: "Cofounder and Chief Mentor",
    bio: "With over 20 years of global experience in emotional and mental wellness coaching, Master Dev Om is a globally recognized mindfulness and meditation coach. He was directly trained by father of mindfulness - Thich Nhat Hanh and the Dalai Lama. He created 'Light Mindfulness Meditation,' authored 9 books, and has trained and certified hundreds of meditation & mindfulness coaches worldwide.",
    image: "/lovable-uploads/7069b4db-6802-4e03-b1f1-bf1f03d2c176.png",
    highlights: [{
      icon: <BrainCircuit className="h-4 w-4" />,
      text: "Creator of 'Light Mindfulness Meditation'"
    }, {
      icon: <BookOpen className="h-4 w-4" />,
      text: "Author of 9 books on mindfulness"
    }, {
      icon: <Award className="h-4 w-4" />,
      text: "Trained by Thich Nhat Hanh and the Dalai Lama"
    }]
  }, {
    id: 2,
    name: "Dushyant Kohli",
    title: "Cofounder and CEO",
    bio: "Dushyant Kohli is a seasoned entrepreneur and Indian OTT veteran with co-founding experience (Khabri & Beatcast) and over a decade of CXO and growth hacking expertise. He has led B2C and B2B businesses across OTT, Edtech, podcasting, and gaming, and is also a certified Meditation teacher & Mindfulness Coach. He is an MBA from Ecole Des Pont Business School and PMP certification.",
    image: "/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png",
    highlights: [{
      icon: <Briefcase className="h-4 w-4" />,
      text: "Co-founded Khabri & Beatcast"
    }, {
      icon: <Globe className="h-4 w-4" />,
      text: "Led B2C and B2B businesses across multiple industries"
    }, {
      icon: <GraduationCap className="h-4 w-4" />,
      text: "MBA from Ecole Des Pont Business School"
    }]
  }, {
    id: 3,
    name: "Dr. Bhavna Khurana",
    title: "Programme Director at iFindLife (UK)",
    bio: "Dr. Bhavna Khurana, with over 20 years of global experience, is a PhD scholar in Cardiac Wellness and a pioneer in heart disease reversal through lifestyle change and mindfulness. She is the founder of I AM Fit (Singapore) and Soulversity (UK), offering mind-body wellness solutions. A certified Lifestyle Medicine Practitioner, Mindfulness Coach, and Meditation Teacher, Dr. Bhavna specializes in workplace wellness and mental health support through global Employee Assistance Programs (EAPs).",
    image: "/lovable-uploads/ceb054b5-2e48-48c4-ae23-1b7f94a00301.png",
    highlights: [{
      icon: <Heart className="h-4 w-4" />,
      text: "PhD in Cardiac Wellness & Founder of I AM Fit"
    }, {
      icon: <BrainCircuit className="h-4 w-4" />,
      text: "Mindfulness Coach & Workplace Wellness Specialist"
    }, {
      icon: <Education className="h-4 w-4" />,
      text: "Certified Lifestyle Medicine & Weight Management Coach"
    }]
  }];
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-ifind-charcoal text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About iFindLife</h1>
            <p className="text-ifind-offwhite/80 max-w-3xl mx-auto">
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
        
        {/* Team section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-10 text-center">Our Leadership Team</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {teamMembers.map(member => <Card key={member.id} className="border-none shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="md:col-span-1 bg-ifind-charcoal flex items-center justify-center p-6">
                      <Avatar className="h-36 w-36 border-4 border-white">
                        
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="md:col-span-2 p-0">
                      <CardHeader>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.title}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                        <div className="space-y-2 mt-4">
                          {member.highlights.map((highlight, index) => <div key={index} className="flex items-start">
                              <div className="mr-2 text-ifind-aqua mt-1">{highlight.icon}</div>
                              <p className="text-sm">{highlight.text}</p>
                            </div>)}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>)}
            </div>
          </div>
        </section>
        
        {/* Values section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="font-medium mb-2 text-ifind-teal">Compassion</h3>
                  <p className="text-gray-600 text-sm">We approach every individual with empathy and understanding, recognizing that each person's journey is unique.</p>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="font-medium mb-2 text-ifind-teal">Excellence</h3>
                  <p className="text-gray-600 text-sm">We strive for the highest standards in the mental health services we provide, continuously improving our approach.</p>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="font-medium mb-2 text-ifind-teal">Inclusivity</h3>
                  <p className="text-gray-600 text-sm">We believe mental health support should be accessible to everyone, regardless of background or circumstances.</p>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="font-medium mb-2 text-ifind-teal">Innovation</h3>
                  <p className="text-gray-600 text-sm">We embrace technology and new approaches to enhance the effectiveness and reach of mental health support.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default AboutUs;