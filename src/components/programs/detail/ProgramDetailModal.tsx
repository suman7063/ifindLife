
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Users, BookOpen, X, Share2, Heart } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';
import { useProgramBooking } from '@/components/programs/booking/useProgramBooking';
import ProgramBookingDialog from '@/components/programs/booking/ProgramBookingDialog';

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  programData: ProgramDetail | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  loading: boolean;
  error: string | null;
}

const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  programData,
  activeTab,
  onTabChange,
  loading,
  error
}) => {
  const {
    isBookingDialogOpen,
    bookingData,
    isSubmitting,
    openBookingDialog,
    closeBookingDialog,
    updateBookingData,
    submitBooking
  } = useProgramBooking();

  if (!programData) return null;

  const handleBookIndividualSession = () => {
    openBookingDialog();
  };

  const handleSubmitBooking = async () => {
    return await submitBooking(programData.id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold mb-2">{programData.title}</DialogTitle>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={programData.expert.photo} 
                      alt={programData.expert.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{programData.expert.name}</p>
                      <p className="text-xs text-gray-500">{programData.expert.experience}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="icon" className="text-ifind-teal">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-6">
              <Tabs value={activeTab} onValueChange={onTabChange}>
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                  <TabsTrigger value="what-it-covers">What It Covers</TabsTrigger>
                  <TabsTrigger value="expected-outcomes">Expected Outcomes</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="course-structure" className="space-y-6">
                  {/* Course Overview Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-ifind-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-6 w-6 text-ifind-teal" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold">{programData.courseStructure.totalSessions}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-ifind-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-ifind-teal" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="text-2xl font-bold">{programData.courseStructure.sessionDuration}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-ifind-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="h-6 w-6 text-ifind-teal" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Frequency</p>
                      <p className="text-2xl font-bold">{programData.courseStructure.frequency}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-ifind-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-6 w-6 text-ifind-teal" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Format</p>
                      <p className="text-2xl font-bold">{programData.courseStructure.format}</p>
                    </div>
                  </div>

                  {/* Weekly Breakdown */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Weekly Breakdown</h3>
                    <div className="space-y-4">
                      {programData.courseStructure.weeklyBreakdown.map((week) => (
                        <div key={week.week} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-ifind-teal text-white rounded-full flex items-center justify-center font-medium text-sm">
                              {week.week}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">{week.title}</h4>
                              <p className="text-gray-600 mb-3">{week.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {week.topics.map((topic, index) => (
                                  <span 
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="what-it-covers" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">What This Program Covers</h3>
                  <ul className="space-y-3">
                    {programData.whatItCovers.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-ifind-teal mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="expected-outcomes" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Expected Outcomes</h3>
                  <ul className="space-y-3">
                    {programData.expectedOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">→</span>
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-ifind-teal mb-2">
                      ₹{programData.pricing.individual.totalCost}
                    </div>
                    <p className="text-gray-600 mb-4">Complete program cost</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• {programData.courseStructure.totalSessions} individual sessions</p>
                      <p>• {programData.courseStructure.sessionDuration} per session</p>
                      <p>• ₹{programData.pricing.individual.perSession} per session</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">{programData.reviews.averageRating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.floor(programData.reviews.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600">({programData.reviews.totalReviews} reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {programData.reviews.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar with Actions */}
            <div className="lg:w-80 border-l bg-gray-50 p-6">
              <div className="space-y-4">
                <Button 
                  className="w-full bg-ifind-teal hover:bg-ifind-teal/90"
                  onClick={() => {/* Handle enroll now */}}
                >
                  🛒 Enroll Now (₹{programData.pricing.individual.totalCost})
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBookIndividualSession}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Individual Session
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      {programData && (
        <ProgramBookingDialog
          isOpen={isBookingDialogOpen}
          onClose={closeBookingDialog}
          programData={programData}
          bookingData={bookingData}
          onBookingDataUpdate={updateBookingData}
          onSubmitBooking={handleSubmitBooking}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default ProgramDetailModal;
