
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ExpertRegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const ExpertRegisterForm: React.FC<ExpertRegisterFormProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <h3 className="font-medium text-amber-800">Register as an Expert</h3>
        <p className="text-sm text-amber-700 mt-1">
          To become an expert on our platform, please fill out our application form.
          Our team will review your application and get back to you within 2-3 business days.
        </p>
      </div>
      
      <Button 
        asChild
        className="w-full bg-ifind-aqua hover:bg-ifind-teal"
      >
        <Link to="/expert-registration">Apply Now</Link>
      </Button>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <button 
          type="button"
          className="text-ifind-aqua hover:underline"
          onClick={() => setActiveTab('login')}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default ExpertRegisterForm;
