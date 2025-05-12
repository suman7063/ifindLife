
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

// Update the DbService interface to match the database schema
export interface DbService {
  id: number;
  name: string;
  description: string;
  rate_usd: number;
  rate_inr: number;
}
