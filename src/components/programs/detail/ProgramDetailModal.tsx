
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, CheckCircle } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

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
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ifind-teal"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !programData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center p-8">
            <p className="text-red-600">Error loading program details. Please try again.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {programData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Program Overview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{programData.overview}</p>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">{programData.duration}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Format</div>
              <div className="font-semibold">{programData.format}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Rating</div>
              <div className="font-semibold">4.8/5</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Price</div>
              <div className="font-semibold text-lg">{programData.price}</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="course-structure">Benefits</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="course-structure" className="space-y-4">
              <h3 className="text-lg font-semibold">Program Benefits</h3>
              <div className="space-y-3">
                {programData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <h3 className="text-lg font-semibold">Program Features</h3>
              <div className="space-y-3">
                {programData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button className="flex-1 bg-ifind-teal hover:bg-ifind-teal/90 text-white">
              Enroll Now - {programData.price}
            </Button>
            <Button variant="outline" className="flex-1 border-ifind-teal text-ifind-teal hover:bg-ifind-teal/10">
              Contact Expert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailModal;
