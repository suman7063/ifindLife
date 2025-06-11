
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Brain, Heart, Sparkles } from 'lucide-react';

const AssessmentMenu = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
        Assessments
      </NavigationMenuTrigger>
      <NavigationMenuContent className="z-50">
        <div className="w-[400px] min-h-[200px] p-6 bg-white shadow-xl border border-gray-200 rounded-lg">
          <div className="grid gap-4">
            <h4 className="text-base font-semibold leading-none text-gray-900 mb-4">
              Wellness Assessments
            </h4>
            <div className="grid gap-3">
              <Link
                to="/mental-health-assessment"
                className="flex items-center gap-3 rounded-lg p-4 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <Brain className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="text-base font-medium leading-none text-gray-900">Mental Wellness</div>
                  <p className="text-sm leading-snug text-gray-600">
                    Assess your mental health and get personalized recommendations
                  </p>
                </div>
              </Link>
              
              <Link
                to="/emotional-wellness-assessment"
                className="flex items-center gap-3 rounded-lg p-4 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <Heart className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="text-base font-medium leading-none text-gray-900">Emotional Wellness</div>
                  <p className="text-sm leading-snug text-gray-600">
                    Understand your emotional patterns and coping strategies
                  </p>
                </div>
              </Link>
              
              <Link
                to="/spiritual-wellness-assessment"
                className="flex items-center gap-3 rounded-lg p-4 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="text-base font-medium leading-none text-gray-900">Spiritual Wellness</div>
                  <p className="text-sm leading-snug text-gray-600">
                    Explore your spiritual connections and inner peace
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default AssessmentMenu;
