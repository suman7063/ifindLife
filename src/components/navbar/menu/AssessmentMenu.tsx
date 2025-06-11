
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
      <NavigationMenuContent>
        <div className="w-[400px] p-4 bg-white">
          <div className="grid gap-3">
            <h4 className="text-sm font-medium leading-none text-gray-900 mb-3">
              Wellness Assessments
            </h4>
            <div className="grid gap-2">
              <Link
                to="/mental-health-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                <Brain className="h-5 w-5 text-blue-600" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Mental Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                    Assess your mental health and get personalized recommendations
                  </p>
                </div>
              </Link>
              
              <Link
                to="/emotional-wellness-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                <Heart className="h-5 w-5 text-red-500" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Emotional Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                    Understand your emotional patterns and coping strategies
                  </p>
                </div>
              </Link>
              
              <Link
                to="/spiritual-wellness-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Spiritual Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-600">
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
