
export interface ServiceCategory {
  id: string;
  name: string;
  items: any[];
  icon?: string;
  title?: string;
  description?: string;
  href?: string;
  color?: string;
}

// Interface for mapping DB records to UI components
export interface ServiceCategoryUI {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  id?: string; // Add for compatibility
  name?: string; // Add for compatibility
}
