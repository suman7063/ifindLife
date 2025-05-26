
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Brain, Lightbulb, Target } from 'lucide-react';

const BlogManagingThoughts = () => {
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
                src="/lovable-uploads/managing-thoughts.jpg" 
                alt="Managing Negative Thoughts"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-ifind-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mental Wellness
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Managing Negative Thoughts: A Practical Guide to Mental Clarity
                  </h1>
                  <div className="flex items-center text-white/90 text-sm">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      March 12, 2024
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Dr. Michael Chen
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Article content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-lg text-gray-700 mb-6">
                  Negative thoughts are a natural part of the human experience, but when they become overwhelming or persistent, they can significantly impact our mental health and overall quality of life. Learning to manage these thoughts effectively is a crucial skill for maintaining emotional balance and resilience.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <Brain className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Recognize</h3>
                    <p className="text-gray-700 text-sm">
                      Identify negative thought patterns as they arise
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <Lightbulb className="h-10 w-10 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Reframe</h3>
                    <p className="text-gray-700 text-sm">
                      Challenge and restructure unhelpful thinking
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <Target className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Redirect</h3>
                    <p className="text-gray-700 text-sm">
                      Focus energy on positive, actionable solutions
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Understanding Negative Thought Patterns</h2>
                
                <p className="mb-4">
                  Negative thinking often follows predictable patterns that psychologists call "cognitive distortions." Recognizing these patterns is the first step toward managing them effectively:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">Common Cognitive Distortions</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-ifind-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong>All-or-Nothing Thinking:</strong> Seeing things in black and white categories without recognizing middle ground.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-ifind-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong>Catastrophizing:</strong> Expecting the worst possible outcome in any situation.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-ifind-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong>Mind Reading:</strong> Assuming you know what others are thinking about you.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-ifind-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong>Personalization:</strong> Blaming yourself for things outside your control.
                      </div>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Practical Strategies for Managing Negative Thoughts</h2>

                <h3 className="text-xl font-semibold mt-6 mb-3">1. The STOP Technique</h3>
                <p className="mb-4">
                  When you notice a negative thought arising, use this simple acronym:
                </p>
                <ul className="list-disc list-inside mb-6 ml-4">
                  <li><strong>S</strong>top what you're doing</li>
                  <li><strong>T</strong>ake a deep breath</li>
                  <li><strong>O</strong>bserve the thought without judgment</li>
                  <li><strong>P</strong>roceed with intention and awareness</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2. Thought Record Keeping</h3>
                <p className="mb-4">
                  Maintain a journal where you record negative thoughts along with:
                </p>
                <ul className="list-disc list-inside mb-6 ml-4">
                  <li>The situation that triggered the thought</li>
                  <li>The emotion you felt (and its intensity 1-10)</li>
                  <li>Evidence for and against the thought</li>
                  <li>A more balanced, realistic thought</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">3. The 5-4-3-2-1 Grounding Technique</h3>
                <p className="mb-4">
                  When overwhelmed by negative thoughts, ground yourself by identifying:
                </p>
                <ul className="list-disc list-inside mb-6 ml-4">
                  <li>5 things you can see</li>
                  <li>4 things you can touch</li>
                  <li>3 things you can hear</li>
                  <li>2 things you can smell</li>
                  <li>1 thing you can taste</li>
                </ul>

                <div className="bg-yellow-50 p-6 rounded-lg my-8">
                  <h3 className="text-xl font-semibold mb-3">Remember: Progress, Not Perfection</h3>
                  <p className="text-gray-700">
                    Managing negative thoughts is a skill that takes time to develop. Be patient with yourself and celebrate small victories along the way. Every time you notice and challenge a negative thought, you're building mental resilience.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">When to Seek Professional Help</h2>
                
                <p className="mb-4">
                  While these techniques are helpful for managing everyday negative thoughts, consider seeking professional support if you experience:
                </p>

                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>Persistent negative thoughts that interfere with daily activities</li>
                  <li>Thoughts of self-harm or suicide</li>
                  <li>Inability to control worrying or rumination</li>
                  <li>Significant changes in sleep, appetite, or energy levels</li>
                  <li>Withdrawal from social activities and relationships</li>
                </ul>

                <div className="bg-ifind-aqua/10 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold mb-3">Get Professional Support</h3>
                  <p className="text-gray-700 mb-4">
                    Our experienced therapists can help you develop personalized strategies for managing negative thoughts and building mental resilience. Don't hesitate to reach out for support.
                  </p>
                  <Button asChild className="bg-ifind-aqua hover:bg-ifind-teal">
                    <Link to="/services/therapy-sessions">Schedule a Session</Link>
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

export default BlogManagingThoughts;
