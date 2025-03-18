
export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  userId: string;
  userName: string;
  expertName: string;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
  userId: string;
  userName: string;
}
