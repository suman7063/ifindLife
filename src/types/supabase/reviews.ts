
export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}
