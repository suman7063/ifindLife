
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const AssessmentMenu = () => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-700 hover:text-gray-900 font-medium"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Assessments
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuItem asChild>
          <Link
            to="/mental-health-assessment?type=mental"
            className="w-full"
          >
            Mental Wellness
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link
            to="/mental-health-assessment?type=emotional"
            className="w-full"
          >
            Emotional Wellness
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link
            to="/mental-health-assessment?type=spiritual"
            className="w-full"
          >
            Spiritual Wellness
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssessmentMenu;
