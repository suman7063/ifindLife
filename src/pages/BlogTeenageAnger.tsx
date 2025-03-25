
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Brain, Calendar, User, ArrowLeft } from 'lucide-react';
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
                  src="https://images.unsplash.com/photo-1581271940096-99d6d544eb34?q=80&w=2068&auto=format&fit=crop" 
                  alt="Teenage Anger" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Blog content */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl mb-6">
                  Adolescence is a time of intense emotions. As teenagers navigate the complex journey from childhood to adulthood, anger can often become a challenging emotion to manage—both for teens and their parents.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Teenage Anger</h2>
                <p>
                  Anger in teenagers is normal and often stems from the significant developmental changes they're experiencing. Their brains are still developing, particularly the prefrontal cortex, which is responsible for impulse control and rational decision-making. This biological reality, combined with hormonal changes and increasing social pressures, can create the perfect storm for emotional outbursts.
                </p>
                
                <p>
                  Common triggers for teenage anger include:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Feeling misunderstood or not listened to</li>
                  <li>Struggling with academic or social pressures</li>
                  <li>Seeking independence while still needing guidance</li>
                  <li>Experiencing relationship conflicts with peers</li>
                  <li>Hormonal changes affecting emotional regulation</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Strategies for Parents</h2>
                <p>
                  Helping your teenager manage anger effectively requires patience, understanding, and consistent support. Here are some approaches that can help:
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Stay Calm and Model Healthy Anger Management</h3>
                <p>
                  When your teen is angry, maintaining your own composure is crucial. By modeling calm responses to frustrating situations, you demonstrate healthy emotional regulation. Remember, teens learn more from what you do than what you say.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Listen Actively Without Judgment</h3>
                <p>
                  Create a safe space for your teen to express their feelings without fear of criticism. Practice active listening by giving your full attention, acknowledging their feelings, and asking clarifying questions to understand their perspective better.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Establish Clear Boundaries</h3>
                <p>
                  While it's important to validate your teen's emotions, it's equally important to set clear boundaries around behavior. Make it clear that while feeling angry is okay, aggressive or destructive actions are not acceptable.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Teach De-escalation Techniques</h3>
                <p>
                  Help your teenager develop strategies to cool down when emotions run high. These might include deep breathing exercises, temporarily removing themselves from triggering situations, or engaging in physical activity to release tension.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Strategies for Teenagers</h2>
                <p>
                  If you're a teenager struggling with anger, these approaches can help you gain more control over your emotions:
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Recognize Your Anger Cues</h3>
                <p>
                  Learn to identify the physical signs that indicate your anger is escalating. These might include a racing heart, clenched fists, or feeling hot. Recognizing these early warning signs gives you the opportunity to intervene before your anger takes over.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Develop a "Cooling Off" Routine</h3>
                <p>
                  Create a personal ritual for calming down when you feel anger building. This might involve listening to music, taking a walk, practicing mindfulness, or using visualization techniques to imagine a peaceful scene.
                </p>
                
                <h3 className="text-xl font-medium mt-6 mb-3">Challenge Negative Thought Patterns</h3>
                <p>
                  Anger often stems from perception. Practice questioning thoughts like "they always disrespect me" or "nothing ever goes my way." Look for evidence that contradicts these absolute statements and try to reframe situations in a more balanced way.
                </p>
                
                <div className="bg-ifind-aqua/10 p-6 rounded-lg my-8">
                  <h4 className="text-lg font-medium mb-3">Key Takeaway</h4>
                  <p className="italic">
                    "Anger itself isn't the problem—it's a normal human emotion. The goal isn't to eliminate anger but to express it in healthy, constructive ways that don't damage relationships or lead to regrettable actions."
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Professional Help</h2>
                <p>
                  While anger is a normal emotion, some situations warrant professional intervention. Consider seeking help if:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Anger regularly leads to aggressive or violent behavior</li>
                  <li>Anger issues are affecting school performance or relationships</li>
                  <li>Your teen expresses feelings of being out of control</li>
                  <li>Anger coincides with symptoms of depression or anxiety</li>
                  <li>Your family's efforts to address the issue haven't been successful</li>
                </ul>
                
                <p>
                  Mental health professionals can provide valuable tools and perspectives that help teenagers manage their emotions more effectively. Therapy approaches like Cognitive Behavioral Therapy (CBT) have proven particularly effective for anger management.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
                <p>
                  Navigating teenage anger requires patience, understanding, and consistent support. By approaching anger as a normal emotion that needs healthy expression rather than suppression, parents and teens can work together to develop healthier emotional regulation skills.
                </p>
                
                <p>
                  Remember that this phase of development is temporary. With the right support and strategies, teenagers can learn to manage their anger effectively, establishing emotional regulation skills that will serve them well throughout their lives.
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
