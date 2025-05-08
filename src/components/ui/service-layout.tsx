
import React from "react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceLayoutProps {
  title: string;
  subtitle?: string;
  iconSrc?: string;
  iconBgClass?: string;
  children: React.ReactNode;
  ctaLink?: string;
  ctaText?: string;
}

export function ServiceLayout({
  title,
  subtitle,
  iconSrc,
  iconBgClass = "bg-ifind-aqua/10",
  children,
  ctaLink = "/experts",
  ctaText = "Find an Expert",
}: ServiceLayoutProps) {
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/4 mb-8 md:mb-0 flex md:justify-center">
            {iconSrc && (
              <div className={`p-6 rounded-full ${iconBgClass}`}>
                <img 
                  src={iconSrc} 
                  alt={title}
                  className="w-20 h-20 object-contain" 
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-3/4">
            <PageHeader title={title} subtitle={subtitle} />
            
            <div className="mt-8 prose prose-lg max-w-none">
              {children}
            </div>
            
            <div className="mt-10">
              <Button asChild className="bg-ifind-aqua hover:bg-ifind-teal">
                <Link to={ctaLink}>
                  {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
