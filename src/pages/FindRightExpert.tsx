import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
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
import { Link, useNavigate } from 'react-router-dom';
import ExpertCardSimplified from '@/components/expert-card/ExpertCardSimplified';
import { ExpertCardData } from '@/components/expert-card/types';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Hook to fetch experts by category
const useCategoryExperts = (category: string, limit: number = 3) => {
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data, error } = await supabase.rpc('get_approved_experts');
        
        if (error) throw error;
        
        const filteredExperts = (data || [])
          .filter((expert: any) => expert.category === category)
          .slice(0, limit)
          .map((dbExpert: any): ExpertCardData => ({
            id: String(dbExpert.id),
            auth_id: dbExpert.auth_id,
            name: dbExpert.name || 'Unknown Expert',
            profilePicture: dbExpert.profile_picture || '',
            specialization: dbExpert.specialization || 'General Counseling',
            experience: typeof dbExpert.experience === 'string' ? parseInt(dbExpert.experience) || 0 : Number(dbExpert.experience) || 0,
            averageRating: Number(dbExpert.average_rating) || 4.5,
            reviewsCount: Number(dbExpert.reviews_count) || 0,
            price: 30,
            verified: Boolean(dbExpert.verified),
            status: 'offline' as const,
            waitTime: 'Not Available',
            category: dbExpert.category || category,
            dbStatus: dbExpert.status
          }));
        
        setExperts(filteredExperts);
      } catch (err) {
        console.error('Error fetching category experts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [category, limit]);

  return { experts, loading };
};

const FindRightExpert = () => {
  const navigate = useNavigate();
  
  // Fetch experts for each category
  const { experts: mentalHealthGuides, loading: loadingMHG } = useCategoryExperts('mindfulness-expert', 3);
  const { experts: mindfulnessCoaches, loading: loadingMC } = useCategoryExperts('life-coach', 3);
  const { experts: spiritualMentors, loading: loadingSM } = useCategoryExperts('spiritual-mentor', 3);
  const { experts: listeningVolunteers, loading: loadingLV } = useCategoryExperts('listening-volunteer', 3);
  const { experts: listeningExperts, loading: loadingLE } = useCategoryExperts('listening-expert', 3);

  const handleExpertClick = (expert: ExpertCardData) => {
    navigate(`/experts/${expert.auth_id || expert.id}`);
  };

  const handleConnectNow = (type: 'video' | 'voice') => {
    console.log('Connect now:', type);
  };

  const handleBookNow = () => {
    console.log('Book now clicked');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section - matching other pages */}
        <section className="bg-gradient-to-r from-ifind-teal/20 to-ifind-purple/20 text-ifind-charcoal py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Choose the Right Support for You
            </h1>
            <p className="text-gray-700 max-w-3xl mx-auto">
              At iFindLife, you can choose the kind of support that feels right for you in this moment.
            </p>
          </div>
        </section>

        <Container className="py-12 md:py-16">
          {/* Quick Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <a href="#solution-guidance" className="block">
              <Card className="h-full border-2 border-ifind-teal/30 hover:border-ifind-teal transition-all duration-300 hover:shadow-lg cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-ifind-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-7 h-7 text-ifind-teal" />
                  </div>
                  <h2 className="text-xl font-bold text-ifind-teal mb-1">Solution & Guidance Sessions</h2>
                  <p className="text-sm text-muted-foreground">3 types of experts</p>
                </CardContent>
              </Card>
            </a>

            <a href="#listening-only" className="block">
              <Card className="h-full border-2 border-ifind-purple/30 hover:border-ifind-purple transition-all duration-300 hover:shadow-lg cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-ifind-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ear className="w-7 h-7 text-ifind-purple" />
                  </div>
                  <h2 className="text-xl font-bold text-ifind-purple mb-1">Listening-Only Sessions</h2>
                  <p className="text-sm text-muted-foreground">2 types of experts</p>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* ==================== SECTION 1: Solution & Guidance Sessions ==================== */}
          <section id="solution-guidance" className="mb-20 scroll-mt-24">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-ifind-teal/10 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-ifind-teal" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    1. Solution & Guidance Sessions
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">(3 types of experts)</p>
                </div>
              </div>
              
              <div className="bg-ifind-teal/5 border-l-4 border-ifind-teal rounded-r-lg p-5 mt-4">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Explore a range of our mental health and emotional wellness professionals who support you not just through conversation, but also with mindfulness tools and simple inner energy balance techniques tailored to what you are facing right now. All our professionals are certified by Soulversity, trained directly and rigorously by Master Dev OM, and bring several hours of proven practice into each session, so you receive grounded, experience-based support. Together, they offer everything from quick emotional relief to deep, long-term resilience building—so you can choose the approach that best fits your current needs and inner journey.
                </p>
              </div>
            </div>

            {/* 3 Expert Types Grid */}
            <div className="space-y-10">
              {/* 1.1 Mental Health Guide */}
              <ExpertTypeCard
                number="1.1"
                title="Mental Health Guide"
                icon={<Heart className="w-6 h-6" />}
                accentColor="teal"
                description="Our Mental Health Guides offer a warm, safe space to share what you are going through, while giving you simple, practical steps for quick emotional and mental relief."
                offerings={[
                  { title: "Immediate Emotional Relief", desc: "Grounding questions, reframes, and simple actions to feel lighter and calmer." },
                  { title: "Stress Reduction", desc: "Evidence-based practices to manage stress and anxiety effectively." },
                  { title: "Safe, Non-judgmental Space", desc: "A confidential environment to express yourself openly." },
                  { title: "Supportive Guidance + Mindfulness", desc: "Suggestions for next steps + quick guided meditation." }
                ]}
                categoryLink="/experts/categories?category=mindfulness-expert"
                experts={mentalHealthGuides}
                loading={loadingMHG}
                onExpertClick={handleExpertClick}
                onConnectNow={handleConnectNow}
                onBookNow={handleBookNow}
              />

              {/* 1.2 Mental Health and Mindfulness Coach */}
              <ExpertTypeCard
                number="1.2"
                title="Mental Health & Mindfulness Coach"
                icon={<Brain className="w-6 h-6" />}
                accentColor="aqua"
                description="Our Coaches support you with clear strategies, structured sessions, and guided practices to manage stress, anxiety, and emotional instability."
                offerings={[
                  { title: "Quick Relief to Long-Term Resilience", desc: "Science-backed steps for immediate and lasting wellbeing." },
                  { title: "Quick, Actionable Steps", desc: "Clear guidance to reduce mental and emotional load." },
                  { title: "Skills for Life Balance", desc: "Strategies to handle triggers, improve focus, and regulate emotions." },
                  { title: "Live Mindfulness & Breathwork", desc: "Guided techniques for quick relief and long-term resilience." }
                ]}
                categoryLink="/experts/categories?category=life-coach"
                experts={mindfulnessCoaches}
                loading={loadingMC}
                onExpertClick={handleExpertClick}
                onConnectNow={handleConnectNow}
                onBookNow={handleBookNow}
              />

              {/* 1.3 Mental Health and Spiritual Mentor */}
              <ExpertTypeCard
                number="1.3"
                title="Mental Health & Spiritual Mentor"
                icon={<Sparkles className="w-6 h-6" />}
                accentColor="purple"
                description="Our Mentors help you work with both your mental/emotional pain and the deeper inner growth behind it, guiding you to release heavy energies."
                offerings={[
                  { title: "Become Transformed & Empowered", desc: "Grow into a grounded, confident, spiritually aligned version of yourself." },
                  { title: "Energetic Understanding", desc: "Insight into emotional and energetic layers of your experiences." },
                  { title: "Attain Inner Peace", desc: "Practices to cultivate permanent inner calm and spiritual well-being." },
                  { title: "Deeper Inner Work", desc: "Exploration of patterns + Guided Spiritual Meditations." }
                ]}
                categoryLink="/experts/categories?category=spiritual-mentor"
                experts={spiritualMentors}
                loading={loadingSM}
                onExpertClick={handleExpertClick}
                onConnectNow={handleConnectNow}
                onBookNow={handleBookNow}
              />
            </div>
          </section>

          {/* ==================== SECTION 2: Listening-Only Sessions ==================== */}
          <section id="listening-only" className="mb-16 scroll-mt-24">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-ifind-purple/10 flex items-center justify-center">
                  <Ear className="w-6 h-6 text-ifind-purple" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    2. Listening-Only Sessions
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">(2 types of experts)</p>
                </div>
              </div>
              
              <div className="bg-ifind-purple/5 border-l-4 border-ifind-purple rounded-r-lg p-5 mt-4">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Sometimes you simply need a human being who can hold space for you, without judgment or pressure to "fix" anything. Our listening-only sessions are grounded in the art of conscious listening as taught by Master Dev OM, and are designed to help you feel safe, heard, and emotionally lighter—while gently guiding you away from repetitive loops into more organized, clear expression.
                </p>
              </div>
            </div>

            {/* 2 Expert Types Grid */}
            <div className="space-y-10">
              {/* 2.1 Listening Volunteers */}
              <ListeningExpertCard
                number="2.1"
                title="Listening Volunteers"
                icon={<Users className="w-6 h-6" />}
                accentColor="teal"
                whoTheyAre="Listening Volunteers are trained in the basics of empathetic, non-judgmental listening. They create a warm, accepting space where you can speak freely and let your emotions flow, knowing that someone is truly present with you."
                offerings={[
                  { title: "Safe, Compassionate Space", desc: "Listen with full attention and empathy so you can release what you're carrying." },
                  { title: "Emotional Support", desc: "A caring ear when you need someone to listen without judgment." },
                  { title: "Active Listening", desc: "Help you naturally discover insights by hearing your own story in a more coherent form." }
                ]}
                categoryLink="/experts/categories?category=listening-volunteer"
                experts={listeningVolunteers}
                loading={loadingLV}
                onExpertClick={handleExpertClick}
                onConnectNow={handleConnectNow}
                onBookNow={handleBookNow}
              />

              {/* 2.2 Conscious Listening Experts */}
              <ListeningExpertCard
                number="2.2"
                title="Conscious Listening Experts"
                icon={<Ear className="w-6 h-6" />}
                accentColor="purple"
                whoTheyAre="Conscious Listening Experts are experienced listeners who have gone through a transformation process themselves through Soulversity's training. They combine compassionate presence with refined skills of reflecting, summarizing, and gently offering a positive direction."
                offerings={[
                  { title: "Deep, Conscious Listening", desc: "Stay fully present while mindfully interrupting repetitive patterns toward clarity." },
                  { title: "Conscious Mirroring", desc: "Help you articulate your experience, reflecting key points and offering empowering direction." },
                  { title: "Complex Issue Processing", desc: "Specialized support for navigating challenging life situations and emotions." }
                ]}
                categoryLink="/experts/categories?category=listening-expert"
                experts={listeningExperts}
                loading={loadingLE}
                onExpertClick={handleExpertClick}
                onConnectNow={handleConnectNow}
                onBookNow={handleBookNow}
              />
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-ifind-teal/10 to-ifind-purple/10 border-0">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-bold mb-3">Ready to Begin Your Journey?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
                  Choose the support that resonates with you and take the first step toward emotional wellness and inner peace.
                </p>
                <Link to="/experts/categories">
                  <Button size="lg" className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
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

// Card for Solution & Guidance experts with expert cards
interface ExpertTypeCardProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  accentColor: 'teal' | 'aqua' | 'purple';
  description: string;
  offerings: Array<{ title: string; desc: string }>;
  categoryLink: string;
  experts: ExpertCardData[];
  loading: boolean;
  onExpertClick: (expert: ExpertCardData) => void;
  onConnectNow: (type: 'video' | 'voice') => void;
  onBookNow: () => void;
}

const ExpertTypeCard: React.FC<ExpertTypeCardProps> = ({
  number,
  title,
  icon,
  accentColor,
  description,
  offerings,
  categoryLink,
  experts,
  loading,
  onExpertClick,
  onConnectNow,
  onBookNow
}) => {
  const colorClasses = {
    teal: { bg: 'bg-ifind-teal/10', text: 'text-ifind-teal', border: 'border-ifind-teal/30', hoverBorder: 'hover:border-ifind-teal/60' },
    aqua: { bg: 'bg-ifind-aqua/10', text: 'text-ifind-aqua', border: 'border-ifind-aqua/30', hoverBorder: 'hover:border-ifind-aqua/60' },
    purple: { bg: 'bg-ifind-purple/10', text: 'text-ifind-purple', border: 'border-ifind-purple/30', hoverBorder: 'hover:border-ifind-purple/60' }
  };

  const colors = colorClasses[accentColor];

  // Expert card skeleton loader
  const ExpertCardSkeleton = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className={`border-2 ${colors.border} ${colors.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
            {icon}
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">{number}</span>
            <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">{title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>

        {/* Offerings */}
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {offerings.map((offering, index) => (
            <div key={index} className="flex gap-2">
              <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
              <div>
                <span className="text-sm font-medium text-foreground">{offering.title}</span>
                <p className="text-xs text-muted-foreground">{offering.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Cards Section */}
        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-foreground">Top Experts</h4>
            <Link to={categoryLink}>
              <Button variant="ghost" size="sm" className={`${colors.text} hover:${colors.bg}`}>
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ExpertCardSkeleton key={i} />
              ))}
            </div>
          ) : experts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No experts available in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((expert) => (
                <ExpertCardSimplified
                  key={expert.id}
                  expert={expert}
                  onClick={() => onExpertClick(expert)}
                  onConnectNow={onConnectNow}
                  onBookNow={onBookNow}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Card for Listening experts with expert cards
interface ListeningExpertCardProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  accentColor: 'teal' | 'purple';
  whoTheyAre: string;
  offerings: Array<{ title: string; desc: string }>;
  categoryLink: string;
  experts: ExpertCardData[];
  loading: boolean;
  onExpertClick: (expert: ExpertCardData) => void;
  onConnectNow: (type: 'video' | 'voice') => void;
  onBookNow: () => void;
}

const ListeningExpertCard: React.FC<ListeningExpertCardProps> = ({
  number,
  title,
  icon,
  accentColor,
  whoTheyAre,
  offerings,
  categoryLink,
  experts,
  loading,
  onExpertClick,
  onConnectNow,
  onBookNow
}) => {
  const colorClasses = {
    teal: { bg: 'bg-ifind-teal/10', text: 'text-ifind-teal', border: 'border-ifind-teal/30', hoverBorder: 'hover:border-ifind-teal/60' },
    purple: { bg: 'bg-ifind-purple/10', text: 'text-ifind-purple', border: 'border-ifind-purple/30', hoverBorder: 'hover:border-ifind-purple/60' }
  };

  const colors = colorClasses[accentColor];

  // Expert card skeleton loader
  const ExpertCardSkeleton = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className={`border-2 ${colors.border} ${colors.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
            {icon}
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">{number}</span>
            <h3 className="text-lg md:text-xl font-bold text-foreground">{title}</h3>
          </div>
        </div>

        {/* Who They Are */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-foreground mb-2">Who they are</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{whoTheyAre}</p>
        </div>

        {/* Offerings */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">What they offer</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {offerings.map((offering, index) => (
              <div key={index} className="flex gap-2.5">
                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                <div>
                  <span className="text-sm font-medium text-foreground">{offering.title}</span>
                  <p className="text-xs text-muted-foreground">{offering.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Cards Section */}
        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-foreground">Top Experts</h4>
            <Link to={categoryLink}>
              <Button variant="ghost" size="sm" className={`${colors.text} hover:${colors.bg}`}>
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <ExpertCardSkeleton key={i} />
              ))}
            </div>
          ) : experts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No experts available in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((expert) => (
                <ExpertCardSimplified
                  key={expert.id}
                  expert={expert}
                  onClick={() => onExpertClick(expert)}
                  onConnectNow={onConnectNow}
                  onBookNow={onBookNow}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FindRightExpert;
