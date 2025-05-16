
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Programs for Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4 text-ifind-teal text-center">For Academic Institutes</h3>
            <p className="mb-6 text-gray-700 text-center">
              Comprehensive mental health programs designed for schools, colleges, and universities to support students, teachers, and staff.
            </p>
            <div className="flex justify-center">
              <Link to="/programs-for-academic-institutes">
                <Button className="bg-ifind-teal hover:bg-ifind-teal/80 text-white">
                  View Academic Programs
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4 text-ifind-teal text-center">For Businesses</h3>
            <p className="mb-6 text-gray-700 text-center">
              Mental health and wellness solutions to support your organization, improve productivity, and create a positive work environment.
            </p>
            <div className="flex justify-center">
              <Link to="/programs-for-business">
                <Button className="bg-ifind-teal hover:bg-ifind-teal/80 text-white">
                  View Business Programs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
