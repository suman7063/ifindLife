
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const NavbarMobileMenu = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-16 pb-4 px-4 w-[300px]">
        <div className="flex flex-col h-full space-y-4 overflow-y-auto py-4">
          <Link to="/" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg">Home</Button>
          </Link>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="programs" className="border-b-0">
              <AccordionTrigger className="py-3 px-4 text-base font-normal hover:no-underline hover:bg-muted rounded-md">
                Programs
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <div className="flex flex-col space-y-2 mt-2">
                  <Link to="/programs-for-wellness" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">For Wellness Seekers</Button>
                  </Link>
                  <Link to="/programs-for-academic-institutes" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">For Academic Institutes</Button>
                  </Link>
                  <Link to="/programs-for-business" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">For Businesses</Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Link to="/services" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg">Services</Button>
          </Link>
          
          <Link to="/experts" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg">Experts</Button>
          </Link>
          
          <Link to="/mental-health-assessment" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg">Assessment</Button>
          </Link>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="support" className="border-b-0">
              <AccordionTrigger className="py-3 px-4 text-base font-normal hover:no-underline hover:bg-muted rounded-md">
                Support
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <div className="flex flex-col space-y-2 mt-2">
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
                  </Link>
                  <Link to="/faq" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">FAQ</Button>
                  </Link>
                  <Link to="/about" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">About Us</Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-auto pt-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMobileMenu;
