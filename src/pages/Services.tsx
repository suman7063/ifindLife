
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      id: 'heart2heart-listening',
      title: 'Heart2Heart Listening Sessions',
      description: 'A unique space where you can express yourself freely while being deeply heard without judgment or interruption.',
      details: 'Our Heart2Heart Listening Sessions provide a unique opportunity to be truly heard in a non-judgmental, supportive environment. Unlike traditional therapy...',
      icon: '💙',
      color: 'bg-blue-100',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088&auto=format&fit=crop'
    },
    {
      id: 'therapy-sessions',
      title: 'Therapy Sessions',
      description: 'Professional therapy sessions to help you navigate life\'s challenges, manage mental health concerns, and enhance personal growth.',
      details: 'Our therapy sessions provide a safe, confidential space where you can explore your thoughts and feelings with a licensed professional. Using evidence-...',
      icon: '💜',
      color: 'bg-purple-100',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'guided-meditations',
      title: 'Guided Meditations',
      description: 'Expertly led meditation sessions to reduce stress, increase mindfulness, and cultivate inner peace and mental clarity.',
      details: 'Our guided meditation sessions help you cultivate mindfulness, reduce stress, and enhance overall well-being. Led by experienced meditation instructors...',
      icon: '🧘',
      color: 'bg-teal-100',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'offline-retreats',
      title: 'Offline Retreats',
      description: 'Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.',
      details: 'Our Offline Retreats offer a rare opportunity to disconnect from digital distractions and reconnect with yourself, nature, and authentic human connection...',
      icon: '🌄',
      color: 'bg-orange-100',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'life-coaching',
      title: 'Life Coaching',
      description: 'Goal-oriented coaching to help you clarify your vision, overcome obstacles, and achieve personal and professional success.',
      details: 'Our Life Coaching service helps you bridge the gap between where you are now and where you want to be. Working with a certified coach, you\'ll clarify...',
      icon: '❤️',
      color: 'bg-red-100',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const serviceCategories = [
    { name: 'Heart2Heart Listening Sessions', color: 'bg-teal-400' },
    { name: 'Therapy Sessions', color: 'bg-purple-500' },
    { name: 'Guided Meditations', color: 'bg-blue-500' },
    { name: 'Offline Retreats', color: 'bg-orange-500' },
    { name: 'Life Coaching', color: 'bg-red-500' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive mental wellness services tailored to your unique needs and journey
            </p>
          </div>

          {/* Service Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {serviceCategories.map((category, index) => (
              <span key={index} className={`px-4 py-2 rounded-full text-white text-sm ${category.color}`}>
                {category.name}
              </span>
            ))}
          </div>

          <div className="text-center mb-12">
            <button className="text-gray-600 hover:text-gray-800">
              + Explore Our Services
            </button>
          </div>

          {/* Services Grid */}
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                <div className="lg:w-1/2">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center text-2xl mb-6`}>
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-gray-600 mb-6">{service.details}</p>
                  <Button className={`${service.buttonColor} text-white px-6 py-3`}>
                    Learn More
                  </Button>
                </div>
                <div className="lg:w-1/2">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Our Services */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Practitioners</h3>
                <p className="text-gray-600">
                  Qualified professionals with extensive experience and a passion for helping others.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Approach</h3>
                <p className="text-gray-600">
                  Tailored solutions designed to meet your unique needs and wellness goals.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Convenient appointment times that work with your busy lifestyle.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Services;
