
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Brain, Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogEmotionalIntelligence = () => {
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
                <span className="bg-ifind-aqua/10 px-3 py-1 rounded-full">Mental Health</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  June 15, 2023
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dushyant Kohli
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Unlocking the Secrets of Emotional Intelligence</h1>
              
              {/* Featured image */}
              <div className="h-80 rounded-lg overflow-hidden mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop" 
                  alt="Emotional Intelligence" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Blog content */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl mb-6">
                  Emotional intelligence (EI) is more than just a buzzword in psychology—it's a fundamental aspect of human interaction that influences everything from our personal relationships to our professional success. But what exactly is emotional intelligence, and why is it so crucial to our well-being?
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Emotional Intelligence</h2>
                <p>
                  Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions, as well as recognize, understand, and influence the emotions of others. In practical terms, this means being aware that emotions can drive our behavior and impact people (positively and negatively), and learning how to manage those emotions—both our own and others—especially when we are under pressure.
                </p>
                
                <p>
                  According to psychologist Daniel Goleman, who popularized the term, emotional intelligence consists of five key components:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong>Self-awareness:</strong> The ability to recognize and understand your moods, emotions, and drives, as well as their effect on others</li>
                  <li><strong>Self-regulation:</strong> The ability to control or redirect disruptive impulses and moods, and the propensity to suspend judgment and think before acting</li>
                  <li><strong>Motivation:</strong> A passion to work for reasons that go beyond money or status, and a propensity to pursue goals with energy and persistence</li>
                  <li><strong>Empathy:</strong> The ability to understand the emotional makeup of other people, and skill in treating people according to their emotional reactions</li>
                  <li><strong>Social skills:</strong> Proficiency in managing relationships and building networks, and an ability to find common ground and build rapport</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">The Impact of Emotional Intelligence on Mental Health</h2>
                <p>
                  Research has consistently shown that individuals with higher emotional intelligence tend to have better mental health, more satisfying relationships, and greater resilience in the face of stress and challenges. They're often more effective leaders and perform better in the workplace.
                </p>
                
                <p>
                  People with strong emotional intelligence are able to:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Recognize when they're experiencing stress or negative emotions</li>
                  <li>Understand what's causing these feelings</li>
                  <li>Regulate their emotional responses effectively</li>
                  <li>Communicate their feelings in constructive ways</li>
                  <li>Empathize with others who are experiencing difficulties</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Developing Your Emotional Intelligence</h2>
                <p>
                  The good news is that emotional intelligence can be developed and enhanced throughout life. Here are some strategies to strengthen your EI:
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Practice Self-awareness</h3>
                <p>
                  Take time each day to reflect on your emotions. What triggered them? How did you respond? Journaling can be a helpful tool for this practice.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Develop Mindfulness</h3>
                <p>
                  Mindfulness meditation can help you become more aware of your thoughts and feelings without judgment, allowing you to respond more thoughtfully rather than reacting automatically.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Seek Feedback</h3>
                <p>
                  Ask trusted friends, family members, or colleagues for honest feedback about how you interact with others and handle emotions.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Practice Active Listening</h3>
                <p>
                  Focus fully on what others are saying without planning your response. Try to understand their perspective and emotions before formulating your reply.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Expand Your Emotional Vocabulary</h3>
                <p>
                  Being able to precisely name your emotions helps you understand and communicate them more effectively. Instead of just saying you feel "bad," try to identify whether you're feeling disappointed, frustrated, anxious, or something else.
                </p>
                
                <div className="bg-ifind-aqua/10 p-6 rounded-lg my-8">
                  <h4 className="text-lg font-medium mb-3">Key Takeaway</h4>
                  <p className="italic">
                    "Emotional intelligence isn't about suppressing emotions—it's about understanding them and using that understanding to guide your thinking and behavior in ways that benefit both yourself and others."
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
                <p>
                  Developing emotional intelligence is a lifelong journey that requires practice and patience. By strengthening your EI, you'll not only improve your mental health and relationships but also enhance your ability to navigate life's challenges with resilience and grace.
                </p>
                
                <p>
                  Remember that emotional intelligence isn't about suppressing emotions—it's about understanding them and using that understanding to guide your thinking and behavior in ways that benefit both yourself and others.
                </p>
              </div>
            </div>
            
            {/* Related articles section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/blog/managing-thoughts" className="group">
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop" 
                      alt="Managing Thoughts" 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-ifind-aqua transition-colors">Managing Conflicting Random Thoughts</h4>
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

export default BlogEmotionalIntelligence;
