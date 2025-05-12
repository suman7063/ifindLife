
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  title: string;         // Added title
  icon: string;          // Added icon
  color: string;         // Added color
  description?: string;  // Optional description
  href?: string;         // Optional href
  items: ServiceItem[];
}

export interface ServiceSettings {
  defaultRate: number;
  categories: ServiceCategory[];
}

// Add the missing DbService interface
export interface DbService {
  id: string;
  title: string;
  description: string;
  category_id: string;
  icon: string;
  color: string;
  href: string;
}
