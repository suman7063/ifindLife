
// Review statistics type definition
export interface ReviewStats {
  average: number;
  count: number;
  distribution: {
    [key: number]: number;
  };
}
