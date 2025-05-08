
export interface ServiceCategory {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

// Interface for the database service object
export interface DbService {
  id: number;
  name: string;
  description: string;
  rate_usd: number;
  rate_inr: number;
  icon?: string;
  color?: string;
}

export interface UseServicesDataOptions {
  initialServices?: ServiceCategory[];
  updateCallback?: (services: ServiceCategory[]) => void;
  maxFetchAttempts?: number;
}

export interface UseServicesDataReturn {
  services: ServiceCategory[];
  setServices: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
  loading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
}
