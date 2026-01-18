import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Sparkles, 
  Brain, 
  Compass, 
  Ear, 
  Users, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FindRightExpert = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-20">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Choose the Right Support for You
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At iFindLife, you can choose the kind of support that feels right for you in this moment:
            </p>
          </div>

          {/* Two Main Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="border-2 border-ifind-teal/30 hover:border-ifind-teal/60 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ifind-teal/10 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-ifind-teal" />
                </div>
                <CardTitle className="text-2xl text-ifind-teal">1. Solution & Guidance Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Professional support with mindfulness tools and practical guidance
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-ifind-purple/30 hover:border-ifind-purple/60 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ifind-purple/10 flex items-center justify-center">
                  <Ear className="w-8 h-8 text-ifind-purple" />
                </div>
                <CardTitle className="text-2xl text-ifind-purple">2. Listening-Only Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  A safe space to be heard without judgment or pressure
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Solution & Guidance Sessions Section */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ifind-teal/10 text-ifind-teal mb-4">
                <Compass className="w-5 h-5" />
                <span className="font-semibold">Solution & Guidance Sessions</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">(3 types of experts)</h2>
            </div>

            <Card className="mb-10 bg-muted/50">
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Explore a range of our mental health and emotional wellness professionals who support you not just through conversation, but also with mindfulness tools and simple inner energy balance techniques tailored to what you are facing right now. All our professionals are certified by Soulversity, trained directly and rigorously by Master Dev OM, and bring several hours of proven practice into each session, so you receive grounded, experience-based support. Together, they offer everything from quick emotional relief to deep, long-term resilience building—so you can choose the approach that best fits your current needs and inner journey.
                </p>
              </CardContent>
            </Card>

            {/* Mental Health Guide */}
            <ExpertTypeCard
              number="1.1"
              title="Mental Health Guide"
              icon={<Heart className="w-8 h-8" />}
              iconBg="bg-rose-500/10"
              iconColor="text-rose-500"
              borderColor="border-rose-500/30"
              description="Our Mental Health Guides offer a warm, safe space to share what you are going through, while giving you simple, practical steps for quick emotional and mental relief. They help you gain clarity, feel heard, and identify your next steps on the path to clarity and balance. They also guide you through short mindfulness/breathwork techniques for quick relief."
              offerings={[
                {
                  title: "Immediate Emotional Relief",
                  description: "Grounding questions, reframes, and simple actions you can take right away to feel lighter and calmer."
                },
                {
                  title: "Stress Reduction",
                  description: "Evidence-based practices to manage stress and anxiety effectively"
                },
                {
                  title: "Safe, Non-judgmental Space",
                  description: "A confidential environment where you can express yourself openly and honestly."
                },
                {
                  title: "Supportive Guidance + Mindfulness",
                  description: "Suggestions and reflections to for the next steps + quick guided meditation to help you recover."
                }
              ]}
              categoryLink="/experts/categories?category=mindfulness-expert"
            />

            {/* Mental Health and Mindfulness Coach */}
            <ExpertTypeCard
              number="1.2"
              title="Mental Health and Mindfulness Coach"
              icon={<Brain className="w-8 h-8" />}
              iconBg="bg-cyan-500/10"
              iconColor="text-cyan-500"
              borderColor="border-cyan-500/30"
              description="Our Mental Health and Mindfulness Coaches support you with clear strategies, structured sessions, and guided practices to manage stress, anxiety, and emotional instability. They combine emotional support, mindfulness tools, and habit-building so you can experience quick relief now and build long-term resilience. As needed, they also guide you through short to long nature healing/breathwork techniques."
              offerings={[
                {
                  title: "From Quick Relief to Long-Term Resilience Building",
                  description: "Simple, science-backed steps to ease your stress right now, combined with daily practices to strengthen your mind, emotions, and energy for the long run."
                },
                {
                  title: "Quick, Actionable Steps",
                  description: "Clear, step-by-step guidance you can implement immediately in your day to reduce mental and emotional load."
                },
                {
                  title: "Skills for Life Balance",
                  description: "Practical strategies/practices to handle triggers, improve focus, sleep better, and regulate emotions."
                },
                {
                  title: "Live Mindfulness & Breathwork Support",
                  description: "Guided mini-meditations, breathing techniques, and awareness exercises for quick relief now and long-term resilience."
                }
              ]}
              categoryLink="/experts/categories?category=life-coach"
            />

            {/* Mental Health and Spiritual Mentor */}
            <ExpertTypeCard
              number="1.3"
              title="Mental Health and Spiritual Mentor"
              icon={<Sparkles className="w-8 h-8" />}
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
              borderColor="border-purple-500/30"
              description="Our Mental Health and Spiritual Mentors help you work with both your mental/emotional pain and the deeper inner growth behind it. They guide you to release heavy energies, understand the energetic dynamics of your life situations, finding inner peace and grow in inner strength and awareness. They also support you on your journey of spiritual growth and self-discovery."
              offerings={[
                {
                  title: "Become a Transformed and Empowered Person",
                  description: "One-to-one guidance that helps you to grow into a more grounded, confident, and spiritually aligned version of yourself."
                },
                {
                  title: "Energetic Understanding of Challenges",
                  description: "Insight into the emotional and energetic layers of what you are going through, so your experiences start to make deeper sense."
                },
                {
                  title: "Attain Inner Peace",
                  description: "Practices and insights to cultivate permanent inner calm and spiritual well-being"
                },
                {
                  title: "Deeper Inner Work",
                  description: "Exploration of patterns, beliefs, and life themes that may be shaping your current experience + Guided Spiritual Meditations & Breathwork"
                }
              ]}
              categoryLink="/experts/categories?category=spiritual-mentor"
            />
          </section>

          {/* Listening-Only Sessions Section */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ifind-purple/10 text-ifind-purple mb-4">
                <Ear className="w-5 h-5" />
                <span className="font-semibold">Listening-Only Sessions</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">(2 types of experts)</h2>
            </div>

            <Card className="mb-10 bg-muted/50">
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Sometimes you simply need a human being who can hold space for you, without judgment or pressure to "fix" anything. Our listening-only sessions are grounded in the art of conscious listening as taught by Master Dev OM, and are designed to help you feel safe, heard, and emotionally lighter—while gently guiding you away from repetitive loops into more organized, clear expression.
                </p>
              </CardContent>
            </Card>

            {/* Listening Volunteers */}
            <ExpertTypeCard
              number="2.1"
              title="Listening Volunteers"
              icon={<Users className="w-8 h-8" />}
              iconBg="bg-teal-500/10"
              iconColor="text-teal-500"
              borderColor="border-teal-500/30"
              whoTheyAre="Listening Volunteers are trained in the basics of empathetic, non-judgmental listening. They create a warm, accepting space where you can speak freely and let your emotions flow, knowing that someone is truly present with you."
              offerings={[
                {
                  title: "Safe, Compassionate Space",
                  description: "They listen with full attention and empathy so you can release what you are carrying, without feeling rushed, analyzed, or judged."
                },
                {
                  title: "Emotional Support",
                  description: "A caring ear when you need someone to listen without judgment"
                },
                {
                  title: "Active Listening",
                  description: "Trained volunteers who focus entirely on understanding your perspective. By encouraging you to explain things in a clearer, more ordered way, they help you naturally discover insights and calm, often just by hearing your own story in a more coherent form."
                }
              ]}
              categoryLink="/experts/categories?category=listening-volunteer"
            />

            {/* Conscious Listening Experts */}
            <ExpertTypeCard
              number="2.2"
              title="Conscious Listening Experts"
              icon={<Ear className="w-8 h-8" />}
              iconBg="bg-indigo-500/10"
              iconColor="text-indigo-500"
              borderColor="border-indigo-500/30"
              whoTheyAre="Conscious Listening Experts are experienced listeners who have gone through a transformation process themselves through Soulversity's training. They combine compassionate presence with a more refined skill of reflecting, summarizing, and gently offering a positive direction at the end of your session."
              offerings={[
                {
                  title: "Deep, Conscious, Therapeutic Listening",
                  description: "They stay fully present with your emotions while mindfully interrupting repetitive patterns, so the space does not become stuck in the same story but gradually moves toward clarity and calm."
                },
                {
                  title: "Conscious Mirroring",
                  description: "They help you articulate your experience in a more structured way, bringing own sense of relief and understanding. Reflecting key points and offering a gentle, empowering direction"
                },
                {
                  title: "Complex Issue Processing",
                  description: "Specialized support for navigating challenging life situations and emotions"
                }
              ]}
              categoryLink="/experts/categories?category=listening-expert"
            />
          </section>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-ifind-teal/10 to-ifind-purple/10 border-0">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Choose the support that resonates with you and take the first step toward emotional wellness and inner peace.
                </p>
                <Link to="/experts/categories">
                  <Button size="lg" className="bg-ifind-teal hover:bg-ifind-teal/90">
                    Browse All Experts
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

interface ExpertTypeCardProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  description?: string;
  whoTheyAre?: string;
  offerings: Array<{
    title: string;
    description: string;
  }>;
  categoryLink: string;
}

const ExpertTypeCard: React.FC<ExpertTypeCardProps> = ({
  number,
  title,
  icon,
  iconBg,
  iconColor,
  borderColor,
  description,
  whoTheyAre,
  offerings,
  categoryLink
}) => {
  return (
    <Card className={`mb-8 border-2 ${borderColor} overflow-hidden`}>
      <CardHeader className="bg-muted/30">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">{number}</span>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {whoTheyAre && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-2">Who they are</h4>
            <p className="text-muted-foreground">{whoTheyAre}</p>
          </div>
        )}
        
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-4">What {title} Offer</h4>
          <div className="space-y-4">
            {offerings.map((offering, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-ifind-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-foreground">{offering.title}</h5>
                  <p className="text-sm text-muted-foreground">{offering.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to={categoryLink}>
          <Button variant="outline" className="w-full">
            View {title}s
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FindRightExpert;
