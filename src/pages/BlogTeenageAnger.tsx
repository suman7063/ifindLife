
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogTeenageAnger = () => {
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
                <span className="bg-ifind-aqua/10 px-3 py-1 rounded-full">Parenting</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  August 10, 2023
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dushyant Kohli
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Steps to Overcoming Teenage Anger</h1>
              
              {/* Featured image */}
              <div className="h-80 rounded-lg overflow-hidden mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1523496897114-5b77cc0c4c42?q=80&w=2070&auto=format&fit=crop" 
                  alt="Teenage Anger" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Blog content */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl mb-6">
                  Parenting a teenager can feel like navigating a minefield, especially when anger erupts seemingly out of nowhere. One moment, your child is calm and collected; the next, they're slamming doors and refusing to speak. While teenage anger is a normal part of development, understanding its roots and responding effectively can make this challenging period easier for the entire family.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Teenage Anger</h2>
                <p>
                  Adolescence is a time of significant change—physically, emotionally, socially, and neurologically. The teenage brain, particularly the prefrontal cortex responsible for impulse control and emotional regulation, is still developing. Meanwhile, hormonal fluctuations can intensify emotions and make them harder to manage.
                </p>
                
                <p>
                  Beyond these biological factors, teenagers face numerous stressors:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Academic pressure and expectations</li>
                  <li>Social challenges and peer relationships</li>
                  <li>Identity formation and independence struggles</li>
                  <li>Family conflicts and changing dynamics</li>
                  <li>Exposure to social media and global issues</li>
                </ul>
                
                <p>
                  It's important to recognize that anger often serves as a secondary emotion—one that masks more vulnerable feelings like fear, disappointment, embarrassment, or insecurity. When teens don't have the emotional vocabulary or confidence to express these underlying emotions, anger becomes the default response.
                </p>
                
                <div className="bg-ifind-aqua/10 p-6 rounded-lg my-8">
                  <h4 className="text-lg font-medium mb-3">Remember This</h4>
                  <p className="italic">
                    "Behind every angry outburst is an unmet need or unexpressed emotion. Our job as parents is not to control the anger, but to help our teens discover and address what lies beneath it."
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Signs of Unhealthy Anger in Teenagers</h2>
                <p>
                  While occasional anger is normal, certain patterns may indicate a need for intervention:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Frequent explosive outbursts disproportionate to triggers</li>
                  <li>Physical aggression toward people, animals, or property</li>
                  <li>Chronic irritability affecting daily functioning</li>
                  <li>Self-destructive behaviors connected to anger</li>
                  <li>Social withdrawal and relationship problems</li>
                  <li>Academic decline related to emotional struggles</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Effective Strategies for Parents</h2>
                <p>
                  As a parent, you play a crucial role in helping your teenager manage anger effectively. Here are evidence-based approaches:
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">1. Maintain Calm During Outbursts</h3>
                <p>
                  Your response sets the emotional tone. When your teen is angry, remain calm and composed—even if it's challenging. Take deep breaths, speak in a measured tone, and avoid matching their intensity.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Try saying:</strong> "I can see you're really upset right now. I want to understand what's going on, but it might be better to talk when we're both calmer."</p>
                </div>
                
                <h3 className="text-xl font-medium mt-6 mb-3">2. Create a Cooling-Off Protocol</h3>
                <p>
                  Work with your teen (during a calm moment) to establish an agreed-upon protocol for when emotions run high. This might include taking space, using breathing techniques, or engaging in a physical activity to release tension.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Example:</strong> "When either of us feels too angry to talk productively, we'll say 'I need some space' and take 20 minutes to cool down before continuing the conversation."</p>
                </div>
                
                <h3 className="text-xl font-medium mt-6 mb-3">3. Look Beyond the Behavior</h3>
                <p>
                  Approach anger as a symptom rather than the core issue. When your teen has calmed down, help them identify what might be beneath the anger—disappointment, fear, embarrassment, or another emotion.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Try asking:</strong> "Before you got angry, what was going through your mind? How were you feeling about the situation?"</p>
                </div>
                
                <h3 className="text-xl font-medium mt-6 mb-3">4. Teach Emotional Vocabulary</h3>
                <p>
                  Many teens lack the language to articulate complex emotions. Help expand their emotional vocabulary by naming feelings and normalizing emotional experiences.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Example:</strong> "It sounds like you might be feeling disappointed about not making the team, but also worried about what your friends will think. That's a lot to handle at once."</p>
                </div>
                
                <h3 className="text-xl font-medium mt-6 mb-3">5. Establish Clear Boundaries</h3>
                <p>
                  While anger is normal, certain expressions of it aren't acceptable. Establish and consistently enforce boundaries around behavior (not feelings), explaining the rationale behind them.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p><strong>Try saying:</strong> "It's completely okay to feel angry, but it's not okay to throw things or use hurtful language. If you need to release anger physically, you can go for a run or punch your pillow."</p>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Professional Help</h2>
                <p>
                  While many anger issues can be addressed at home, some situations warrant professional support. Consider consulting a mental health professional if your teen:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Shows persistent anger that interferes with daily functioning</li>
                  <li>Engages in violent or destructive behavior</li>
                  <li>Expresses thoughts of harming themselves or others</li>
                  <li>Shows signs of depression or anxiety alongside anger</li>
                  <li>Uses substances to cope with emotions</li>
                  <li>Experiences significant academic or social decline</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
                <p>
                  Helping your teenager navigate anger is not about eliminating this normal emotion but rather teaching them to express and channel it constructively. With patience, consistency, and compassion, you can guide your teen toward emotional resilience that will serve them well beyond adolescence.
                </p>
                
                <p>
                  Remember that this developmental stage is temporary. By maintaining a supportive relationship through these challenging moments, you're building a foundation of trust and emotional intelligence that will benefit your child for years to come.
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogTeenageAnger;
