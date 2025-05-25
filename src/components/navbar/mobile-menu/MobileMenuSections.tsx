
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Info, 
  Users, 
  BookOpen, 
  HeadphonesIcon, 
  Heart, 
  Mountain, 
  Compass, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Phone, 
  HelpCircle, 
  FileText, 
  Shield,
  Brain,
  Sparkles
} from 'lucide-react';

const MobileMenuSections = () => {
  return (
    <div className="flex-1 overflow-y-auto py-6">
      {/* Main Navigation */}
      <nav className="space-y-1 px-4">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        
        <Link 
          to="/about" 
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          <Info className="h-4 w-4" />
          About
        </Link>
        
        <Link 
          to="/experts" 
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          <Users className="h-4 w-4" />
          Experts
        </Link>
      </nav>

      <Separator className="my-4" />

      {/* Programs Section */}
      <div className="px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Programs
        </h3>
        <nav className="space-y-1">
          <Link 
            to="/programs-for-wellness-seekers" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <UserCheck className="h-4 w-4" />
            Wellness Seeker
          </Link>
          
          <Link 
            to="/programs-for-academic-institutes" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <GraduationCap className="h-4 w-4" />
            Academic Institute
          </Link>
          
          <Link 
            to="/programs-for-business" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Business
          </Link>
        </nav>
      </div>

      <Separator className="my-4" />

      {/* Services Section */}
      <div className="px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Services
        </h3>
        <nav className="space-y-1">
          <Link 
            to="/services" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            <Sparkles className="h-4 w-4" />
            All Services
          </Link>
          
          <Link 
            to="/services/therapy-sessions" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Brain className="h-4 w-4" />
            Therapy Sessions
          </Link>
          
          <Link 
            to="/services/guided-meditations" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Mountain className="h-4 w-4" />
            Guided Meditations
          </Link>
          
          <Link 
            to="/services/mindful-listening" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Heart className="h-4 w-4" />
            Heart2Heart Listening
          </Link>
          
          <Link 
            to="/services/offline-retreats" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Mountain className="h-4 w-4" />
            Offline Retreats
          </Link>
          
          <Link 
            to="/services/life-coaching" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Compass className="h-4 w-4" />
            Life Coaching
          </Link>
        </nav>
      </div>

      <Separator className="my-4" />

      {/* Support Section */}
      <div className="px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Support
        </h3>
        <nav className="space-y-1">
          <Link 
            to="/contact" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Contact Us
          </Link>
          
          <Link 
            to="/faqs" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            FAQs
          </Link>
          
          <Link 
            to="/blog" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Blog
          </Link>
          
          <Link 
            to="/help" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Help Center
          </Link>
          
          <Link 
            to="/privacy" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Privacy Policy
          </Link>
          
          <Link 
            to="/terms" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Terms of Service
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenuSections;
