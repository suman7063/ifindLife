import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';
const Contact = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header Band */}
      <div className="bg-gradient-to-r from-ifind-teal/20 to-ifind-purple/20 text-ifind-charcoal py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help you. Fill out the form below or reach out directly.
          </p>
        </div>
      </div>
      
      <main className="flex-1">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Your Message
                      </label>
                      <Textarea id="message" rows={6} placeholder="Enter your message here..." />
                    </div>
                    <Button type="submit" className="w-full bg-ifind-aqua hover:bg-ifind-teal">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex">
                      <Mail className="h-6 w-6 text-ifind-aqua mr-4" />
                      <div>
                        <h3 className="font-medium">Email Us</h3>
                        <p className="text-gray-600">connect@ifindlife.com</p>
                      </div>
                    </div>
                    <div className="flex">
                      <Phone className="h-6 w-6 text-ifind-aqua mr-4" />
                      <div>
                        <h3 className="font-medium">Call Us</h3>
                        <p className="text-gray-600">+91 9355966925</p>
                      </div>
                    </div>
                    <div className="flex">
                      <MapPin className="h-6 w-6 text-ifind-aqua mr-4" />
                      <div>
                        <h3 className="font-medium">Visit Us</h3>
                        <p className="text-gray-600">
                          3rd Floor, Indian Accelerator,<br />
                          Iconic Tower, A 13 A, Block A,<br />
                          Industrial Area, Sector 62,<br />
                          Noida, Uttar Pradesh 201309
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Contact;