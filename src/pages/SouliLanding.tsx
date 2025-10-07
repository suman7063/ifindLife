import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import souliMascot from "@/assets/souli-mascot.png";
import { z } from "zod";
import { Sparkles, Heart, Brain, ArrowRight, CheckCircle2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
});

const SouliLanding = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [subscriberNumber, setSubscriberNumber] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot protection - honeypot field should be empty
    if (honeypot) {
      return;
    }
    
    // Validate email
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      toast({
        title: "Invalid email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current waitlist count
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      const subscriberNumber = (count || 0) + 1;

      // Insert into waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert({ 
          email: validation.data.email,
          subscriber_number: subscriberNumber,
          honeypot: null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already registered",
            description: "This email is already on the waitlist!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setSubscriberNumber(subscriberNumber);
        setIsConfirmed(true);
        setEmail("");
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/10">
        {/* Animated background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-10 animate-fade-in">
            {/* Success Icon with Mascot */}
            <div className="relative mx-auto w-40 h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-primary/30 shadow-2xl animate-scale-in">
                <img src={souliMascot} alt="Souli" className="w-24 h-24 object-contain" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                You're In! 🎉
              </h1>
              <div className="inline-block">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-8 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border-2 border-primary/20">
                  You're #{subscriberNumber}
                </p>
              </div>
              {subscriberNumber <= 500 && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full backdrop-blur-sm border border-primary/30 animate-scale-in" style={{ animationDelay: "0.3s" }}>
                  <Sparkles className="w-5 h-5 text-primary" />
                  <p className="text-xl font-bold text-primary">
                    You've secured 50% off!
                  </p>
                </div>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/90 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-10 space-y-6 shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Stay Tuned! ✨
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-xl leading-relaxed">
                    We'll send you an email with your <span className="font-bold text-primary">exclusive offer</span> when we launch in <span className="font-bold text-secondary">January 2025</span>.
                  </p>
                  <p className="text-lg">
                    Get ready to start your transformational journey from recovery to resilience.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Early Bird Pricing</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium">Priority Access</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">Exclusive Updates</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setIsConfirmed(false)}
              variant="outline"
              size="lg"
              className="mt-8 group hover:scale-105 transition-transform"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/10">
      {/* Dynamic floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-secondary/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-7xl mx-auto w-full space-y-16 animate-fade-in">
          
          {/* Hero Section with Mascot */}
          <div className="text-center space-y-12">
            {/* Floating Mascot */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-3xl animate-pulse" />
              <div className="relative">
                <img 
                  src={souliMascot} 
                  alt="Souli" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl animate-scale-in hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-primary/30 shadow-lg">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Coming January 2026
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[1.1]">
                Your transformational Journey from{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />
                  <span className="relative bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Recovery to Resilience
                  </span>
                </span>{" "}
                Begin
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                An AI companion that understands you, guides you through challenges, and helps you find mental & emotional balance—one conversation at a time.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-105 hover:shadow-2xl shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-2xl text-foreground">Real Recovery</h3>
                <p className="text-base text-muted-foreground text-center leading-relaxed">Navigate life's challenges with confidence and clarity</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:scale-105 hover:shadow-2xl shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-2xl text-foreground">Find Balance</h3>
                <p className="text-base text-muted-foreground text-center leading-relaxed">Achieve emotional harmony and inner peace every day</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-accent/20 hover:border-accent/40 transition-all hover:scale-105 hover:shadow-2xl shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-2xl text-foreground">Become Resilient</h3>
                <p className="text-base text-muted-foreground text-center leading-relaxed">Build lasting strength for whatever life brings</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-primary/30 rounded-[2rem] p-10 md:p-12 space-y-8 shadow-2xl">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    EARLY BIRD SPECIAL
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Join the First <span className="text-primary">500</span>
                </h2>
                
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-xl" />
                  <p className="relative text-6xl md:text-7xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    50% OFF
                  </p>
                </div>
                
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Be among the first to experience Souli and get exclusive lifetime benefits
                </p>
              </div>

              {/* Waitlist Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-16 text-lg bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary rounded-2xl px-6 placeholder:text-muted-foreground/50"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="h-16 px-12 font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all group hover:scale-105"
                  >
                    {isSubmitting ? (
                      "Joining..."
                    ) : (
                      <>
                        Secure Your Spot
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Limited spots • Early access won't last long
                </p>
              </form>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-6 opacity-60">
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by early adopters seeking mental wellness
            </p>
            <div className="flex flex-wrap justify-center gap-6 items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-lg">★</span>
                ))}
              </div>
              <span>•</span>
              <p className="font-medium">Built with ❤️ for your wellbeing</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SouliLanding;
