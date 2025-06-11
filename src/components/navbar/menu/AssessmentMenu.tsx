
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
        Assessment
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
          <div className="grid gap-1">
            <h4 className="text-sm font-medium leading-none text-gray-900 mb-3">
              Wellness Assessments
            </h4>
            <div className="grid gap-2">
              <Link
                to="/mental-health-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Brain className="h-5 w-5 text-blue-600" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Mental Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Assess your mental health and get personalized recommendations
                  </p>
                </div>
              </Link>
              
              <Link
                to="/emotional-wellness-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Heart className="h-5 w-5 text-red-500" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Emotional Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Understand your emotional patterns and coping strategies
                  </p>
                </div>
              </Link>
              
              <Link
                to="/spiritual-wellness-assessment"
                className="flex items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Spiritual Wellness</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
