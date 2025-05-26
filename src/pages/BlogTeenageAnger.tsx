
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, AlertTriangle, Heart, Shield } from 'lucide-react';

const BlogTeenageAnger = () => {
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
                src="/lovable-uploads/teenage-anger.jpg" 
                alt="Understanding Teenage Anger"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-ifind-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                      Teen Mental Health
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Understanding and Managing Teenage Anger: A Guide for Parents
                  </h1>
                  <div className="flex items-center text-white/90 text-sm">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      March 10, 2024
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Dr. Emily Rodriguez
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Article content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-lg text-gray-700 mb-6">
                  Teenage anger is a normal part of adolescent development, but it can be challenging for both teens and their families to navigate. Understanding the underlying causes and learning effective management strategies can help create a more harmonious home environment and support your teen's emotional growth.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Warning Signs</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Frequent explosive outbursts</li>
                      <li>• Verbal or physical aggression</li>
                      <li>• Withdrawal from family activities</li>
                      <li>• Declining academic performance</li>
                      <li>• Sleep or appetite changes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <Heart className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Healthy Responses</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Stay calm and composed</li>
                      <li>• Listen without judgment</li>
                      <li>• Set clear boundaries</li>
                      <li>• Validate their feelings</li>
                      <li>• Model emotional regulation</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Why Do Teenagers Experience Intense Anger?</h2>
                
                <p className="mb-4">
                  Teenage anger is often misunderstood by adults, but there are several biological and psychological factors that contribute to increased emotional intensity during adolescence:
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">Developmental Factors</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Brain Development:</strong> The teenage brain is still developing, particularly the prefrontal cortex responsible for impulse control and emotional regulation.
                    </div>
                    <div>
                      <strong>Hormonal Changes:</strong> Fluctuating hormones during puberty can significantly impact mood and emotional responses.
                    </div>
                    <div>
                      <strong>Identity Formation:</strong> Teens are working to establish their independence and identity, which can create internal conflict.
                    </div>
                    <div>
                      <strong>Social Pressures:</strong> Academic stress, peer relationships, and social media can contribute to overwhelming feelings.
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Effective Strategies for Parents</h2>

                <h3 className="text-xl font-semibold mt-6 mb-3">1. Create a Safe Communication Environment</h3>
                <ul className="list-disc list-inside mb-6 ml-4 space-y-2">
                  <li>Choose the right time and place for conversations</li>
                  <li>Use "I" statements instead of "you" statements</li>
                  <li>Avoid lecturing; focus on listening</li>
                  <li>Acknowledge their feelings before offering solutions</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2. Establish Clear Boundaries and Consequences</h3>
                <ul className="list-disc list-inside mb-6 ml-4 space-y-2">
                  <li>Set consistent rules about respectful communication</li>
                  <li>Make consequences clear and follow through</li>
                  <li>Focus on natural consequences rather than punishment</li>
                  <li>Be flexible when appropriate, but maintain core boundaries</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">3. Teach Emotional Regulation Skills</h3>
                <p className="mb-4">Help your teenager develop healthy coping mechanisms:</p>
                <ul className="list-disc list-inside mb-6 ml-4 space-y-2">
                  <li>Deep breathing exercises and mindfulness techniques</li>
                  <li>Physical exercise as an outlet for intense emotions</li>
                  <li>Journaling to process feelings</li>
                  <li>Creative expression through art, music, or writing</li>
                  <li>Problem-solving skills for challenging situations</li>
                </ul>

                <div className="bg-yellow-50 p-6 rounded-lg my-8">
                  <Shield className="h-8 w-8 text-yellow-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">De-escalation Techniques</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Stay Calm:</strong> Your emotional state will influence theirs. Take deep breaths and speak in a low, steady voice.</p>
                    <p><strong>Give Space:</strong> Sometimes teens need time to cool down before they can engage in productive conversation.</p>
                    <p><strong>Avoid Power Struggles:</strong> Pick your battles wisely and focus on the most important issues.</p>
                    <p><strong>Use Empathy:</strong> Try to understand their perspective, even if you don't agree with their behavior.</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Building Long-term Emotional Health</h2>
                
                <p className="mb-4">
                  Managing teenage anger isn't just about addressing immediate outbursts—it's about helping your teen develop lifelong emotional intelligence and resilience:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Encourage Self-Awareness</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Help them identify anger triggers</li>
                      <li>• Discuss the physical signs of anger</li>
                      <li>• Practice recognizing emotions early</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Foster Healthy Relationships</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Model respectful communication</li>
                      <li>• Encourage positive peer relationships</li>
                      <li>• Maintain family connection time</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">When to Seek Professional Help</h2>
                
                <p className="mb-4">
                  While some anger is normal during adolescence, certain signs indicate the need for professional intervention:
                </p>

                <div className="bg-red-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-red-800">Seek Help If Your Teen:</h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Shows frequent violent or aggressive behavior</li>
                    <li>• Threatens self-harm or suicide</li>
                    <li>• Engages in risky behaviors (substance use, reckless driving)</li>
                    <li>• Shows significant decline in academic or social functioning</li>
                    <li>• Experiences anger that seems disproportionate to triggers</li>
                    <li>• Family relationships are severely strained</li>
                  </ul>
                </div>

                <p className="mb-6">
                  Remember, seeking help is a sign of strength, not failure. Professional counselors can provide specialized techniques and support for both teens and families navigating challenging emotional periods.
                </p>

                <div className="bg-ifind-aqua/10 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold mb-3">Expert Support for Families</h3>
                  <p className="text-gray-700 mb-4">
                    Our teen specialists understand the unique challenges of adolescence and can provide both individual counseling for teens and family therapy to improve communication and relationships.
                  </p>
                  <Button asChild className="bg-ifind-aqua hover:bg-ifind-teal">
                    <Link to="/services/therapy-sessions">Get Family Support</Link>
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

export default BlogTeenageAnger;
