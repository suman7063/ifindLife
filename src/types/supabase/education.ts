
export interface Course {
  id: string;
  title: string;
  expertId: string;
  expertName: string;
  enrollmentDate: string;
  progress?: number;
  completed?: boolean;
}
