
// Adapt course data from API to UI format
export const adaptCoursesToUI = (courses: any[]) => {
  if (!courses || !Array.isArray(courses)) return [];
  
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || 'No description available',
    price: course.price || 0,
    duration: course.duration || '',
    expertId: course.expert_id,
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed,
    created_at: course.created_at || new Date().toISOString(),
    updated_at: course.updated_at || new Date().toISOString(),
    image_url: course.image_url || 'https://via.placeholder.com/300x200?text=Course'
  }));
};

// Adapt review data from API to UI format
export const adaptReviewsToUI = (reviews: any[]) => {
  if (!reviews || !Array.isArray(reviews)) return [];
  
  return reviews.map(review => ({
    id: review.id,
    expertId: review.expert_id,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified || false
  }));
};

// Adapt report data from API to UI format
export const adaptReportsToUI = (reports: any[]) => {
  if (!reports || !Array.isArray(reports)) return [];
  
  return reports.map(report => ({
    id: report.id,
    expertId: report.expert_id,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};
