
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Heart, Brain, Users } from 'lucide-react';

const BlogEmotionalIntelligence = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-ifind-purple">
              <Link to="/blog">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>
          
          {/* Article header */}
          <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-96 relative overflow-hidden">
              <img 
                src="/lovable-uploads/emotional-intelligence.jpg" 
                alt="Understanding Emotional Intelligence"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-ifind-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mental Health
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Understanding Emotional Intelligence: The Key to Better Relationships
                  </h1>
                  <div className="flex items-center text-white/90 text-sm">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      March 15, 2024
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Dr. Sarah Johnson
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Article content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-lg text-gray-700 mb-6">
                  Emotional intelligence is one of the most important skills you can develop for personal and professional success. It's the ability to understand, use, and manage your emotions in positive ways to relieve stress, communicate effectively, empathize with others, overcome challenges, and defuse conflict.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <Heart className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Self-Awareness</h3>
                    <p className="text-gray-700">
                      Understanding your emotions and their impact on your thoughts and behavior. This includes recognizing your emotional triggers and understanding how your feelings affect others.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <Brain className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Self-Regulation</h3>
                    <p className="text-gray-700">
                      Managing your emotions in healthy ways, taking initiative, following through on commitments, and adapting to change with flexibility and resilience.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">The Four Components of Emotional Intelligence</h2>
                
                <p className="mb-4">
                  Emotional intelligence consists of four key components that work together to help you navigate social complexities and make personal decisions that achieve positive results:
                </p>

                <ol className="list-decimal list-inside mb-6 space-y-3">
                  <li className="mb-2">
                    <strong>Self-Awareness:</strong> The ability to recognize and understand your moods, emotions, and drives, as well as their effect on others.
                  </li>
                  <li className="mb-2">
                    <strong>Self-Regulation:</strong> The ability to control or redirect disruptive impulses and moods, and the propensity to think before acting.
                  </li>
                  <li className="mb-2">
                    <strong>Motivation:</strong> A passion to work for internal reasons that go beyond money and status, and a propensity to pursue goals with energy and persistence.
                  </li>
                  <li className="mb-2">
                    <strong>Empathy:</strong> The ability to understand the emotional makeup of other people and skill in treating people according to their emotional reactions.
                  </li>
                </ol>

                <div className="bg-yellow-50 p-6 rounded-lg my-8">
                  <Users className="h-8 w-8 text-yellow-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Social Skills in Action</h3>
                  <p className="text-gray-700">
                    People with strong emotional intelligence are skilled at managing relationships and building networks. They can find common ground and build rapport with people from all walks of life.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Developing Your Emotional Intelligence</h2>
                
                <p className="mb-4">
                  Unlike IQ, which remains relatively fixed throughout life, emotional intelligence can be developed and improved over time. Here are some practical strategies:
                </p>

                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>Practice mindfulness meditation to increase self-awareness</li>
                  <li>Keep an emotion journal to track your feelings and reactions</li>
                  <li>Ask for feedback from trusted friends and colleagues</li>
                  <li>Practice active listening in your conversations</li>
                  <li>Learn to pause before reacting in emotional situations</li>
                  <li>Develop empathy by trying to see situations from others' perspectives</li>
                </ul>

                <p className="mb-4">
                  Remember, developing emotional intelligence is a journey, not a destination. It requires consistent practice and self-reflection, but the benefits to your relationships, career, and overall well-being are immeasurable.
                </p>

                <div className="bg-ifind-aqua/10 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold mb-3">Take Action Today</h3>
                  <p className="text-gray-700 mb-4">
                    Start your emotional intelligence journey with our guided programs and expert support. Our therapists can help you develop these crucial skills through personalized sessions and practical exercises.
                  </p>
                  <Button asChild className="bg-ifind-aqua hover:bg-ifind-teal">
                    <Link to="/services/therapy-sessions">Book a Session</Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogEmotionalIntelligence;
