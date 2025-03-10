
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Phone, User, Briefcase } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import ExpertRegistrationForm from '@/components/expert/ExpertRegistrationForm';

const ExpertLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would authenticate against a backend
    const storedExperts = localStorage.getItem('ifindlife-experts');
    if (storedExperts) {
      const experts = JSON.parse(storedExperts);
      const expert = experts.find(
        (exp: any) => exp.email === loginEmail && exp.password === loginPassword
      );
      
      if (expert) {
        localStorage.setItem('ifindlife-expert-auth', JSON.stringify({
          id: expert.id,
          name: expert.name,
          email: expert.email
        }));
        toast.success('Login successful!');
        navigate('/expert-dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } else {
      toast.error('Invalid email or password');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="relative w-8 h-8">
                <div className="absolute w-8 h-8 bg-astro-purple rounded-full opacity-70"></div>
                <div className="absolute w-4 h-4 bg-astro-gold rounded-full top-1 left-2"></div>
              </div>
              <span className="font-bold text-2xl text-gradient">For Mental Health Experts</span>
            </Link>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Join as Expert</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-astro-purple hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-astro-purple hover:bg-astro-violet">
                    Sign In as Expert
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <ExpertRegistrationForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
