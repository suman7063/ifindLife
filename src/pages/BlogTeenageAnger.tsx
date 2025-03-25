
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Heart } from 'lucide-react';

const BlogTeenageAnger = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-ifind-aqua mb-4">
              <span>Parenting</span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                August 10, 2023
              </span>
              <span>•</span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Dr. Lisa Patel
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Steps to Overcoming Teenage Anger</h1>
            
            <div className="h-80 rounded-lg overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1535056995008-48d3c6b8e89c?q=80&w=2071&auto=format&fit=crop" 
                alt="Teenage Anger" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Parenting a teenager can feel like navigating a minefield, especially when anger erupts seemingly out of nowhere. One moment, your child is calm and collected; the next, they're slamming doors and refusing to speak. While teenage anger is a normal part of development, understanding its roots and responding effectively can make this challenging period easier for the entire family.
              </p>
              
              <h2>Understanding Teenage Anger</h2>
              <p>
                Adolescence is a time of significant change—physically, emotionally, socially, and neurologically. The teenage brain, particularly the prefrontal cortex responsible for impulse control and emotional regulation, is still developing. Meanwhile, hormonal fluctuations can intensify emotions and make them harder to manage.
              </p>
              
              <p>
                Beyond these biological factors, teenagers face numerous stressors:
              </p>
              
              <ul>
                <li>Academic pressure and expectations</li>
                <li>Social challenges and peer relationships</li>
                <li>Identity formation and independence struggles</li>
                <li>Family conflicts and changing dynamics</li>
                <li>Exposure to social media and global issues</li>
              </ul>
              
              <p>
                It's important to recognize that anger often serves as a secondary emotion—one that masks more vulnerable feelings like fear, disappointment, embarrassment, or insecurity. When teens don't have the emotional vocabulary or confidence to express these underlying emotions, anger becomes the default response.
              </p>
              
              <h2>Signs of Unhealthy Anger in Teenagers</h2>
              <p>
                While occasional anger is normal, certain patterns may indicate a need for intervention:
              </p>
              
              <ul>
                <li>Frequent explosive outbursts disproportionate to triggers</li>
                <li>Physical aggression toward people, animals, or property</li>
                <li>Chronic irritability affecting daily functioning</li>
                <li>Self-destructive behaviors connected to anger</li>
                <li>Social withdrawal and relationship problems</li>
                <li>Academic decline related to emotional struggles</li>
              </ul>
              
              <h2>Effective Strategies for Parents</h2>
              <p>
                As a parent, you play a crucial role in helping your teenager manage anger effectively. Here are evidence-based approaches:
              </p>
              
              <h3>1. Maintain Calm During Outbursts</h3>
              <p>
                Your response sets the emotional tone. When your teen is angry, remain calm and composed—even if it's challenging. Take deep breaths, speak in a measured tone, and avoid matching their intensity.
              </p>
              
              <p>
                <strong>Try saying:</strong> "I can see you're really upset right now. I want to understand what's going on, but it might be better to talk when we're both calmer."
              </p>
              
              <h3>2. Create a Cooling-Off Protocol</h3>
              <p>
                Work with your teen (during a calm moment) to establish an agreed-upon protocol for when emotions run high. This might include taking space, using breathing techniques, or engaging in a physical activity to release tension.
              </p>
              
              <p>
                <strong>Example:</strong> "When either of us feels too angry to talk productively, we'll say 'I need some space' and take 20 minutes to cool down before continuing the conversation."
              </p>
              
              <h3>3. Look Beyond the Behavior</h3>
              <p>
                Approach anger as a symptom rather than the core issue. When your teen has calmed down, help them identify what might be beneath the anger—disappointment, fear, embarrassment, or another emotion.
              </p>
              
              <p>
                <strong>Try asking:</strong> "Before you got angry, what was going through your mind? How were you feeling about the situation?"
              </p>
              
              <h3>4. Teach Emotional Vocabulary</h3>
              <p>
                Many teens lack the language to articulate complex emotions. Help expand their emotional vocabulary by naming feelings and normalizing emotional experiences.
              </p>
              
              <p>
                <strong>Example:</strong> "It sounds like you might be feeling disappointed about not making the team, but also worried about what your friends will think. That's a lot to handle at once."
              </p>
              
              <h3>5. Establish Clear Boundaries</h3>
              <p>
                While anger is normal, certain expressions of it aren't acceptable. Establish and consistently enforce boundaries around behavior (not feelings), explaining the rationale behind them.
              </p>
              
              <p>
                <strong>Try saying:</strong> "It's completely okay to feel angry, but it's not okay to throw things or use hurtful language. If you need to release anger physically, you can go for a run or punch your pillow."
              </p>
              
              <h3>6. Model Healthy Anger Management</h3>
              <p>
                Your teen learns by watching you. Demonstrate constructive ways to handle your own anger, and be willing to apologize when you fall short.
              </p>
              
              <p>
                <strong>Example:</strong> "I realize I raised my voice earlier when I was frustrated. That wasn't the best way to handle it. Next time, I'll take a moment to calm down before we talk."
              </p>
              
              <h2>When to Seek Professional Help</h2>
              <p>
                While many anger issues can be addressed at home, some situations warrant professional support. Consider consulting a mental health professional if your teen:
              </p>
              
              <ul>
                <li>Shows persistent anger that interferes with daily functioning</li>
                <li>Engages in violent or destructive behavior</li>
                <li>Expresses thoughts of harming themselves or others</li>
                <li>Shows signs of depression or anxiety alongside anger</li>
                <li>Uses substances to cope with emotions</li>
                <li>Experiences significant academic or social decline</li>
              </ul>
              
              <h2>Conclusion</h2>
              <p>
                Helping your teenager navigate anger is not about eliminating this normal emotion but rather teaching them to express and channel it constructively. With patience, consistency, and compassion, you can guide your teen toward emotional resilience that will serve them well beyond adolescence.
              </p>
              
              <p>
                Remember that this developmental stage is temporary. By maintaining a supportive relationship through these challenging moments, you're building a foundation of trust and emotional intelligence that will benefit your child for years to come.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogTeenageAnger;
