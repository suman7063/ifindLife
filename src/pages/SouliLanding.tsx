import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import souliMascot from "@/assets/souli-mascot.png";
import { z } from "zod";
import { Sparkles, Heart, Brain, ArrowRight, CheckCircle2, Share2, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
});

const SouliLanding = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [subscriberNumber, setSubscriberNumber] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with friends and family",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent("Check out Souli - Your AI companion for mental & emotional balance");
  
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
  };

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
      
      {/* Navigation */}
      <div className="relative z-10 px-6 pt-6">
        <div className="max-w-7xl mx-auto flex justify-end gap-4">
          <Button
            onClick={() => navigate("/souli/team")}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            Meet the Team
          </Button>
          <Button
            onClick={() => navigate("/souli/investor")}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            Want to Invest?
          </Button>
        </div>
      </div>

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
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                Your transformational<br />
                Journey from<br />
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />
                  <span className="relative bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Recovery to Resilience
                  </span>
                </span><br />
                Begin
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                An AI companion that understands you, guides you through challenges, and helps you break the recurring patterns and find balance to heal the root cause.
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
                  Be among the first to experience Souli and get exclusive launch benefits
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

          {/* Share Section */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 md:p-10 space-y-6 shadow-xl text-center">
              <div className="flex items-center justify-center gap-2">
                <Share2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Share with friends & family
                </h3>
              </div>
              <p className="text-muted-foreground text-lg">
                They might thank you later
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border-2 hover:border-primary/50 transition-all group"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 rounded-xl border-2 hover:border-green-500/50 hover:bg-green-50 transition-all"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </Button>
                  
                  <Button
                    onClick={() => window.open(shareLinks.linkedin, '_blank')}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 rounded-xl border-2 hover:border-blue-500/50 hover:bg-blue-50 transition-all"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      toast({
                        title: "Instagram",
                        description: "Copy the link and share it in your Instagram bio or stories!",
                      });
                      handleCopyLink();
                    }}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 rounded-xl border-2 hover:border-pink-500/50 hover:bg-pink-50 transition-all"
                    title="Share on Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </Button>
                </div>
              </div>
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
      
      <Footer />
    </div>
  );
};

export default SouliLanding;
