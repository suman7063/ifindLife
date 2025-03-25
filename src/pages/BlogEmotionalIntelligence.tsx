
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Brain, Calendar, User } from 'lucide-react';

const BlogEmotionalIntelligence = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-ifind-aqua mb-4">
              <span>Mental Health</span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                June 15, 2023
              </span>
              <span>•</span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Dr. Sarah Johnson
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Unlocking the Secrets of Emotional Intelligence</h1>
            
            <div className="h-80 rounded-lg overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1559029881-7cfd01ac1f10?q=80&w=2069&auto=format&fit=crop" 
                alt="Emotional Intelligence" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Emotional intelligence (EI) is more than just a buzzword in psychology—it's a fundamental aspect of human interaction that influences everything from our personal relationships to our professional success. But what exactly is emotional intelligence, and why is it so crucial to our well-being?
              </p>
              
              <h2>Understanding Emotional Intelligence</h2>
              <p>
                Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions, as well as recognize, understand, and influence the emotions of others. In practical terms, this means being aware that emotions can drive our behavior and impact people (positively and negatively), and learning how to manage those emotions—both our own and others—especially when we are under pressure.
              </p>
              
              <p>
                According to psychologist Daniel Goleman, who popularized the term, emotional intelligence consists of five key components:
              </p>
              
              <ul>
                <li><strong>Self-awareness:</strong> The ability to recognize and understand your moods, emotions, and drives, as well as their effect on others</li>
                <li><strong>Self-regulation:</strong> The ability to control or redirect disruptive impulses and moods, and the propensity to suspend judgment and think before acting</li>
                <li><strong>Motivation:</strong> A passion to work for reasons that go beyond money or status, and a propensity to pursue goals with energy and persistence</li>
                <li><strong>Empathy:</strong> The ability to understand the emotional makeup of other people, and skill in treating people according to their emotional reactions</li>
                <li><strong>Social skills:</strong> Proficiency in managing relationships and building networks, and an ability to find common ground and build rapport</li>
              </ul>
              
              <h2>The Impact of Emotional Intelligence on Mental Health</h2>
              <p>
                Research has consistently shown that individuals with higher emotional intelligence tend to have better mental health, more satisfying relationships, and greater resilience in the face of stress and challenges. They're often more effective leaders and perform better in the workplace.
              </p>
              
              <p>
                People with strong emotional intelligence are able to:
              </p>
              
              <ul>
                <li>Recognize when they're experiencing stress or negative emotions</li>
                <li>Understand what's causing these feelings</li>
                <li>Regulate their emotional responses effectively</li>
                <li>Communicate their feelings in constructive ways</li>
                <li>Empathize with others who are experiencing difficulties</li>
              </ul>
              
              <h2>Developing Your Emotional Intelligence</h2>
              <p>
                The good news is that emotional intelligence can be developed and enhanced throughout life. Here are some strategies to strengthen your EI:
              </p>
              
              <h3>Practice Self-awareness</h3>
              <p>
                Take time each day to reflect on your emotions. What triggered them? How did you respond? Journaling can be a helpful tool for this practice.
              </p>
              
              <h3>Develop Mindfulness</h3>
              <p>
                Mindfulness meditation can help you become more aware of your thoughts and feelings without judgment, allowing you to respond more thoughtfully rather than reacting automatically.
              </p>
              
              <h3>Seek Feedback</h3>
              <p>
                Ask trusted friends, family members, or colleagues for honest feedback about how you interact with others and handle emotions.
              </p>
              
              <h3>Practice Active Listening</h3>
              <p>
                Focus fully on what others are saying without planning your response. Try to understand their perspective and emotions before formulating your reply.
              </p>
              
              <h3>Expand Your Emotional Vocabulary</h3>
              <p>
                Being able to precisely name your emotions helps you understand and communicate them more effectively. Instead of just saying you feel "bad," try to identify whether you're feeling disappointed, frustrated, anxious, or something else.
              </p>
              
              <h2>Conclusion</h2>
              <p>
                Developing emotional intelligence is a lifelong journey that requires practice and patience. By strengthening your EI, you'll not only improve your mental health and relationships but also enhance your ability to navigate life's challenges with resilience and grace.
              </p>
              
              <p>
                Remember that emotional intelligence isn't about suppressing emotions—it's about understanding them and using that understanding to guide your thinking and behavior in ways that benefit both yourself and others.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEmotionalIntelligence;
