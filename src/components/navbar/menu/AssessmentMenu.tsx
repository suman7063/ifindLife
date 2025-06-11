
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, ChevronDown } from 'lucide-react';

const AssessmentMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium">
          Assessments
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="p-2">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 px-2">
            Wellness Assessments
          </h4>
          <DropdownMenuItem asChild>
            <Link
              to="/mental-health-assessment?type=mental"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full"
            >
              <Brain className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Mental Wellness</div>
                <p className="text-sm text-gray-600">
                  Assess your mental health and get personalized recommendations
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link
              to="/mental-health-assessment?type=emotional"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full"
            >
              <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Emotional Wellness</div>
                <p className="text-sm text-gray-600">
                  Understand your emotional patterns and coping strategies
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link
              to="/mental-health-assessment?type=spiritual"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full"
            >
              <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Spiritual Wellness</div>
                <p className="text-sm text-gray-600">
                  Explore your spiritual connections and inner peace
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssessmentMenu;
