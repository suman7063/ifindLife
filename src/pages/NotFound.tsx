
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Extract the first segment of the path for contextual recommendations
  const pathSegment = location.pathname.split('/')[1] || '';

  // Define contextual recommendations based on path segments
  const getRelatedLinks = () => {
    switch (pathSegment) {
      case 'services':
        return [
          { label: 'All Services', path: '/services' },
          { label: 'Mental Health', path: '/services/mental-health' },
          { label: 'Career Guidance', path: '/career-guidance' }
        ];
      case 'experts':
        return [
          { label: 'Find an Expert', path: '/experts' },
          { label: 'Programs', path: '/programs-for-wellness-seekers' }
        ];
      case 'programs':
        return [
          { label: 'Wellness Programs', path: '/programs-for-wellness-seekers' },
          { label: 'Academic Programs', path: '/programs-for-academic-institutes' },
          { label: 'Business Programs', path: '/programs-for-business' }
        ];
      case 'blog':
        return [
          { label: 'Blog Home', path: '/blog' },
          { label: 'Mental Health Resources', path: '/services' }
        ];
      default:
        return [
          { label: 'Services', path: '/services' },
          { label: 'Find an Expert', path: '/experts' },
          { label: 'Wellness Programs', path: '/programs-for-wellness-seekers' }
        ];
    }
  };

  const relatedLinks = getRelatedLinks();

  return (
    <Container className="min-h-screen py-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="h-40 w-40 mx-auto relative">
            <div className="absolute inset-0 bg-ifind-aqua/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-6xl font-bold text-ifind-aqua">404</h1>
            </div>
          </div>
          <h2 className="text-2xl font-poppins font-semibold text-gray-800 mt-6">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button
            asChild
            className="bg-ifind-aqua hover:bg-ifind-teal transition-colors w-full"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua/10 w-full"
          >
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Link>
          </Button>
        </div>

        {relatedLinks.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              You might be looking for:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {relatedLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="px-3 py-1 rounded-full bg-ifind-aqua/10 text-ifind-aqua hover:bg-ifind-aqua/20 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default NotFound;
