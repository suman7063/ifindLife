
export interface NewReview {
  expertId: number;
  rating: number;
  comment?: string;
}

export interface NewReport {
  expertId: number;
  reason: string;
  details?: string;
}
