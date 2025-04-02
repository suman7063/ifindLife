import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-ifind-teal text-white py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 font-poppins">Find the Mental Health Support You Deserve</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover personalized programs, connect with expert therapists, and take control of your mental well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/programs-for-wellness-seekers">
              <Button size="lg" className="bg-white text-ifind-teal hover:bg-gray-100">
                Explore Programs
              </Button>
            </Link>
            <Link to="/experts">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Find an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <img
                src="/feature-personalized.svg"
                alt="Personalized Programs"
                className="mx-auto h-16 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Personalized Programs</h3>
              <p className="text-gray-600">
                Tailored mental health programs designed to meet your unique needs and goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <img
                src="/feature-expert.svg"
                alt="Expert Therapists"
                className="mx-auto h-16 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Expert Therapists</h3>
              <p className="text-gray-600">
                Connect with licensed and experienced therapists who can provide guidance and support.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <img
                src="/feature-assessment.svg"
                alt="Free Assessment"
                className="mx-auto h-16 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Free Assessment</h3>
              <p className="text-gray-600">
                Take our free mental health assessment to understand your needs and find the right resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Seeker Programs Section - RIGHT ALIGNED as requested */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-right">Programs for Wellness Seekers</h2>
            <p className="text-lg text-gray-600 max-w-3xl ml-auto text-right">
              Explore our wide range of mental health programs designed to support your personal growth and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Mindfulness Basics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Mindfulness Basics</h3>
                <p className="text-gray-600 mb-4">
                  Learn the fundamentals of mindfulness meditation and its application in daily life.
                </p>
                <Link to="/programs-for-wellness-seekers">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    View Program
                  </Button>
                </Link>
              </div>
            </div>

            {/* Program 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Anxiety Management"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Anxiety Management</h3>
                <p className="text-gray-600 mb-4">
                  Develop practical tools and techniques to manage anxiety symptoms and build resilience.
                </p>
                <Link to="/programs-for-wellness-seekers">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    View Program
                  </Button>
                </Link>
              </div>
            </div>

            {/* Program 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Sleep Improvement"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sleep Improvement</h3>
                <p className="text-gray-600 mb-4">
                  Transform your sleep habits with evidence-based strategies for better sleep quality.
                </p>
                <Link to="/programs-for-wellness-seekers">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    View Program
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Programs Section - LEFT ALIGNED as requested */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-left">Programs for Organizations</h2>
            <p className="text-lg text-gray-600 max-w-3xl text-left">
              We offer specialized mental health and wellness programs for businesses and academic institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Academic Programs" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Academic Institutions</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive mental health programs designed for schools, colleges, and universities to support students and staff.
                </p>
                <Link to="/programs-for-academic-institutes">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    View Academic Programs
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Business Programs" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Businesses</h3>
                <p className="text-gray-600 mb-4">
                  Tailored wellness solutions to support employee mental health, reduce stress, and improve workplace well-being.
                </p>
                <Link to="/programs-for-business">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    View Business Programs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "iFind has been a game-changer for my mental health. The personalized programs and expert support have made a real difference in my life."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="User 1"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">Sarah J.</p>
                  <p className="text-gray-500">Wellness Seeker</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "As a teacher, I was struggling with burnout. iFind's programs helped me manage stress and find a better work-life balance."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/2.jpg"
                  alt="User 2"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">Michael K.</p>
                  <p className="text-gray-500">Educator</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "iFind's business programs have transformed our workplace culture. Our employees are happier, healthier, and more productive."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  alt="User 3"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">Emily L.</p>
                  <p className="text-gray-500">HR Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with fixed "Book an Appointment" button */}
      <section className="bg-ifind-purple text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team of experts is here to guide you toward better mental well-being. Take the first step today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/experts">
              <Button size="lg" className="bg-white text-ifind-purple hover:bg-gray-100">
                Book an Appointment
              </Button>
            </Link>
            <Link to="/mental-health-assessment">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Take Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1508615070457-7ba751470442?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Emotional Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Power of Emotional Intelligence</h3>
                <p className="text-gray-600 mb-4">
                  Learn how emotional intelligence can improve your relationships and boost your career.
                </p>
                <Link to="/blog/emotional-intelligence">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-87b59e892dd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Managing Thoughts"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Managing Negative Thoughts</h3>
                <p className="text-gray-600 mb-4">
                  Discover effective techniques to challenge negative thoughts and cultivate a positive mindset.
                </p>
                <Link to="/blog/managing-thoughts">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1557682250-338e77abdc73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Teenage Anger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Understanding Teenage Anger</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to help teenagers manage their anger and develop healthy coping mechanisms.
                </p>
                <Link to="/blog/teenage-anger">
                  <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
