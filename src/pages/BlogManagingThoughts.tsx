
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogManagingThoughts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back navigation */}
            <Link to="/" className="inline-flex items-center text-ifind-aqua hover:text-ifind-aqua/80 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              {/* Blog header */}
              <div className="flex items-center space-x-2 text-sm text-ifind-aqua mb-4">
                <span className="bg-ifind-aqua/10 px-3 py-1 rounded-full">Self-Improvement</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  July 22, 2023
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dushyant Kohli
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Managing Conflicting Random Thoughts</h1>
              
              {/* Featured image */}
              <div className="h-80 rounded-lg overflow-hidden mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop" 
                  alt="Managing Thoughts" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Blog content */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl mb-6">
                  Have you ever found yourself caught in a mental storm of conflicting thoughts, unable to focus or make decisions? Those random, sometimes contradictory thoughts that pop into your mind throughout the day can be more than just a nuisance—they can impact your productivity, mood, and overall mental well-being.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Thought Patterns</h2>
                <p>
                  Our minds generate thousands of thoughts daily—some purposeful, others seemingly random. When these thoughts conflict with each other or with our goals and values, they can create internal friction and emotional distress. Understanding the nature of these conflicting thoughts is the first step toward managing them effectively.
                </p>
                
                <p>
                  Conflicting thoughts often arise from:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong>Cognitive dissonance:</strong> When we hold contradictory beliefs or values</li>
                  <li><strong>Decision paralysis:</strong> When multiple options seem equally appealing or unappealing</li>
                  <li><strong>Overthinking:</strong> When we analyze situations excessively without reaching a conclusion</li>
                  <li><strong>External influences:</strong> When societal or peer expectations conflict with our own desires</li>
                  <li><strong>Inner critic vs. inner advocate:</strong> When self-doubt battles with self-confidence</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">The Impact of Conflicting Thoughts</h2>
                <p>
                  When left unmanaged, conflicting thoughts can lead to:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Indecisiveness and procrastination</li>
                  <li>Increased anxiety and stress</li>
                  <li>Reduced focus and productivity</li>
                  <li>Diminished self-trust</li>
                  <li>Mental fatigue</li>
                </ul>
                
                <div className="bg-ifind-aqua/10 p-6 rounded-lg my-8">
                  <h4 className="text-lg font-medium mb-3">Expert Insight</h4>
                  <p className="italic">
                    "The mind is like a busy intersection. Thoughts come from all directions, but you decide which ones get to pass through and which ones need to wait."
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Strategies for Managing Conflicting Thoughts</h2>
                <p>
                  Fortunately, several evidence-based approaches can help you navigate the maze of conflicting thoughts:
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">1. Mindful Awareness</h3>
                <p>
                  Practicing mindfulness allows you to observe your thoughts without immediately reacting to them. By creating distance between yourself and your thoughts, you can see them as passing mental events rather than objective truths.
                </p>
                
                <p>
                  <strong>Practice:</strong> When you notice conflicting thoughts, pause and observe them without judgment. Name the thoughts: "I'm having the thought that I should work harder" or "I'm noticing a thought about needing rest."
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">2. Thought Recording</h3>
                <p>
                  Writing down your thoughts can help externalize them and make patterns more visible.
                </p>
                
                <p>
                  <strong>Practice:</strong> Create a simple two-column table. In one column, write down a conflicting thought; in the other, write an alternative perspective. For example:
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Thought:</strong> "I'll never get all this work done."</p>
                  <p><strong>Alternative:</strong> "I can break this down into smaller tasks and make progress step by step."</p>
                </div>
                
                <h3 className="text-xl font-medium mt-6 mb-3">3. Values Clarification</h3>
                <p>
                  When thoughts conflict, returning to your core values can provide direction.
                </p>
                
                <p>
                  <strong>Practice:</strong> Identify your top 3-5 values (e.g., health, growth, connection). When conflicting thoughts arise, ask yourself: "Which choice best aligns with my values?"
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">4. Cognitive Defusion</h3>
                <p>
                  This technique helps you "unstick" from thoughts by changing your relationship with them.
                </p>
                
                <p>
                  <strong>Practice:</strong> Try saying your thoughts in a silly voice, singing them as a song, or prefacing them with "My mind is telling me that..." These approaches help you see thoughts as mental productions rather than reality.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">5. Dedicated Worry Time</h3>
                <p>
                  Setting aside specific time to process conflicting thoughts can prevent them from hijacking your entire day.
                </p>
                
                <p>
                  <strong>Practice:</strong> Schedule 15-20 minutes daily for "thought processing." When conflicting thoughts arise outside this time, note them briefly and return to them during your designated period.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Professional Support</h2>
                <p>
                  While these strategies are effective for managing normal levels of conflicting thoughts, persistent or severe thought patterns that significantly impact your functioning may require professional support. Consider consulting a mental health professional if:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Conflicting thoughts regularly prevent you from completing daily tasks</li>
                  <li>You experience significant distress from intrusive or unwanted thoughts</li>
                  <li>Strategies for managing thoughts provide little or no relief</li>
                  <li>Your thoughts include content about harming yourself or others</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
                <p>
                  Conflicting thoughts are a normal part of human experience, but they don't have to control your mental landscape. By developing awareness of your thought patterns and implementing strategies to manage them effectively, you can reduce mental friction and create more space for clarity, decisiveness, and peace of mind.
                </p>
                
                <p>
                  Remember that managing thoughts is a skill that improves with practice. Be patient with yourself as you develop this important aspect of mental wellness.
                </p>
              </div>
            </div>
            
            {/* Related articles section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/blog/emotional-intelligence" className="group">
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop" 
                      alt="Emotional Intelligence" 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-ifind-aqua transition-colors">Unlocking the Secrets of Emotional Intelligence</h4>
                </Link>
                <Link to="/blog/teenage-anger" className="group">
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1523496897114-5b77cc0c4c42?q=80&w=2070&auto=format&fit=crop" 
                      alt="Teenage Anger" 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-ifind-aqua transition-colors">Steps to Overcoming Teenage Anger</h4>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogManagingThoughts;
