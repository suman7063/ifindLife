import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SouliInvestor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you!",
      description: "We'll get back to you shortly.",
    });
    setFormData({ name: "", email: "", organization: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/10">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-secondary/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex-1 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => navigate("/souli")}
            variant="ghost"
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>

          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Want to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Invest?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us in revolutionizing mental wellness. Let's discuss how you can be part of our journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/95 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 space-y-6 shadow-lg">
                <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 bg-background/50 backdrop-blur-sm border-2"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 bg-background/50 backdrop-blur-sm border-2"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="h-12 bg-background/50 backdrop-blur-sm border-2"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Tell us about your investment interests..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-32 bg-background/50 backdrop-blur-sm border-2"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg" size="lg">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info & Calendar */}
            <div className="space-y-8">
              {/* Calendly */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/95 backdrop-blur-xl border-2 border-accent/20 rounded-3xl p-8 space-y-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Schedule a Call</h3>
                  </div>
                  <p className="text-muted-foreground">Book a time that works for you</p>
                  <Button 
                    variant="outline" 
                    className="w-full h-12" 
                    asChild
                  >
                    <a href="https://calendly.com/dk-ifindlife/30min" target="_blank" rel="noopener noreferrer">
                      Open Calendar
                    </a>
                  </Button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/95 backdrop-blur-xl border-2 border-secondary/20 rounded-3xl p-8 space-y-6 shadow-lg">
                  <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email Us</p>
                        <a href="mailto:dk@ifindlife.com" className="text-muted-foreground hover:text-primary transition-colors">
                          dk@ifindlife.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Call Us</p>
                        <a href="tel:+919355966925" className="text-muted-foreground hover:text-secondary transition-colors">
                          +91 9355966925
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Visit Us</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          3rd Floor, Indian Accelerator,<br />
                          Iconic Tower, A 13 A, Block A,<br />
                          Industrial Area, Sector 62,<br />
                          Noida, Uttar Pradesh 201309
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={() => navigate("/souli")}
              variant="ghost"
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouliInvestor;
