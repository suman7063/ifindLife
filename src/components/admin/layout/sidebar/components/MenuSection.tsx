
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SidebarMenuItem from './SidebarMenuItem';

export interface MenuSectionProps {
  sectionLabel: string;
  items: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }[];
  showSection: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  sectionLabel,
  items,
  showSection
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!showSection) {
    return null;
  }

  const hasActiveItem = items.some(item => item.isActive);

  return (
    <div className="mb-2">
      <div 
        className="flex items-center justify-between p-2 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={`text-gray-500 dark:text-gray-400 ${hasActiveItem ? 'font-semibold text-ifind-aqua' : ''}`}>
          {sectionLabel}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>
      
      {isExpanded && (
        <div className="ml-2 space-y-1 mt-1">
          {items.map((item, index) => (
            <SidebarMenuItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              onClick={item.onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;
