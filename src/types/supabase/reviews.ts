
// Review statistics types

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  distribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}
