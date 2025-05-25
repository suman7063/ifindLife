
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, FileText } from 'lucide-react';

const Help = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
        </div>
      </section>

      {/* Help Content */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="text-center p-6 border rounded-lg">
            <MessageCircle className="h-12 w-12 text-ifind-teal mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90">Start Chat</Button>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <Phone className="h-12 w-12 text-ifind-purple mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
            <Button variant="outline">Call Now</Button>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <Mail className="h-12 w-12 text-ifind-aqua mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us your questions via email</p>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <FileText className="h-12 w-12 text-ifind-charcoal mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">FAQ</h3>
            <p className="text-gray-600 mb-4">Browse frequently asked questions</p>
            <Button variant="outline" asChild>
              <Link to="/faqs">View FAQs</Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to assist you with any questions or concerns you may have.
          </p>
          <Button className="bg-ifind-teal hover:bg-ifind-teal/90" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default Help;
