
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { UserProfile } from '@/types/supabase';

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  hasExpertProfile: boolean;
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  isLoggingOut: boolean;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isAuthenticated,
  hasExpertProfile,
  userLogout,
  expertLogout,
  sessionType,
  isLoggingOut
}) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    if (hasExpertProfile) {
      await expertLogout();
    } else {
      await userLogout();
    }
    setOpen(false);
  };

  // Create dashboard link based on user role
  const getDashboardLink = () => {
    if (hasExpertProfile) {
      return "/expert-dashboard";
    } else if (isAuthenticated && sessionType === 'user') {
      return "/user-dashboard";
    }
    return "/user-login";
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="px-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b pb-4">
              <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
                <img 
                  src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
                  alt="iFindLife" 
                  className="h-8 transform scale-150 origin-left" 
                />
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>

            <div className="flex flex-col gap-3 mt-6 flex-1 overflow-y-auto">
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/">Home</Link>
                </Button>
              </SheetClose>
              
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/about">About</Link>
                </Button>
              </SheetClose>
              
              <SheetClose asChild>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/experts">Experts</Link>
                </Button>
              </SheetClose>

              {/* Programs Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="programs">
                  <AccordionTrigger className="py-2 px-4 hover:no-underline hover:bg-accent rounded-md">
                    Programs
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className="flex flex-col gap-1 py-1">
                      <SheetClose asChild>
                        <Link to="/programs-for-wellness-seekers" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Wellness Seekers
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/programs-for-academic-institutes" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Academic Institutes
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/programs-for-business" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Business
                        </Link>
                      </SheetClose>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Services Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="services">
                  <AccordionTrigger className="py-2 px-4 hover:no-underline hover:bg-accent rounded-md">
                    Services
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className="flex flex-col gap-1 py-1">
                      <SheetClose asChild>
                        <Link to="/services" className="py-2 px-4 text-sm hover:bg-accent rounded-md font-medium">
                          All Services
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/services/therapy-sessions" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Therapy Sessions
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/services/guided-meditations" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Guided Meditations
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/services/mindful-listening" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Mindful Listening
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/services/offline-retreats" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Offline Retreats
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/services/life-coaching" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Life Coaching
                        </Link>
                      </SheetClose>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Support Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="support">
                  <AccordionTrigger className="py-2 px-4 hover:no-underline hover:bg-accent rounded-md">
                    Support
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className="flex flex-col gap-1 py-1">
                      <SheetClose asChild>
                        <Link to="/contact" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Contact Us
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/faqs" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          FAQs
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/blog" className="py-2 px-4 text-sm hover:bg-accent rounded-md">
                          Blog
                        </Link>
                      </SheetClose>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="border-t pt-4 mt-auto">
              {isAuthenticated || hasExpertProfile ? (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="w-full">
                      <Link to={getDashboardLink()}>Dashboard</Link>
                    </Button>
                  </SheetClose>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/user-login">User Login</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="default" asChild className="w-full">
                      <Link to="/expert-login">Expert Login</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobileMenu;
