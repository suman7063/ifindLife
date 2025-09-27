import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingPersonalizationProps {
  preferences: {
    interests: string[];
    experience: string;
    goals: string[];
  };
  setPreferences: (preferences: any) => void;
}

const INTEREST_OPTIONS = [
  'Stress Management', 'Anxiety Support', 'Depression', 'Relationship Issues',
  'Career Guidance', 'Personal Growth', 'Meditation', 'Sleep Issues'
];

const EXPERIENCE_OPTIONS = [
  'First time seeking help',
  'Some experience with therapy',
  'Regular therapy sessions',
  'Experienced with multiple approaches'
];

const GOAL_OPTIONS = [
  'Reduce stress', 'Improve relationships', 'Better sleep', 'Career clarity',
  'Emotional regulation', 'Personal growth', 'Mindfulness practice', 'Crisis support'
];

export const OnboardingPersonalization: React.FC<OnboardingPersonalizationProps> = ({
  preferences,
  setPreferences
}) => {
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    const newInterests = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest];
    setPreferences({ ...preferences, interests: newInterests });
  };

  const toggleGoal = (goal: string) => {
    const newGoals = preferences.goals.includes(goal)
      ? preferences.goals.filter(g => g !== goal)
      : [...preferences.goals, goal];
    setPreferences({ ...preferences, goals: newGoals });
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-poppins font-semibold">Personalize Experience</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8">
        <div>
          <h2 className="text-lg font-poppins font-medium mb-3">What brings you here?</h2>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <Badge
                key={interest}
                variant={preferences.interests.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  preferences.interests.includes(interest)
                    ? 'bg-ifind-aqua hover:bg-ifind-aqua/90 text-white'
                    : 'hover:bg-ifind-aqua/10 hover:text-ifind-aqua'
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-poppins font-medium mb-3">Your experience level</h2>
          <div className="space-y-2">
            {EXPERIENCE_OPTIONS.map((experience) => (
              <Button
                key={experience}
                variant={preferences.experience === experience ? "default" : "outline"}
                className={`w-full justify-start text-left ${
                  preferences.experience === experience
                    ? 'bg-ifind-teal hover:bg-ifind-teal/90 text-white'
                    : 'hover:bg-ifind-teal/10 hover:text-ifind-teal'
                }`}
                onClick={() => setPreferences({ ...preferences, experience })}
              >
                {experience}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-poppins font-medium mb-3">Your wellness goals</h2>
          <p className="text-sm text-muted-foreground mb-4">Select your top priorities</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((goal) => (
              <Badge
                key={goal}
                variant={preferences.goals.includes(goal) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  preferences.goals.includes(goal)
                    ? 'bg-ifind-purple hover:bg-ifind-purple/90 text-white'
                    : 'hover:bg-ifind-purple/10 hover:text-ifind-purple'
                }`}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          onClick={() => navigate('/mobile-app/onboarding/features')}
          disabled={preferences.interests.length === 0 || !preferences.experience || preferences.goals.length === 0}
          className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};