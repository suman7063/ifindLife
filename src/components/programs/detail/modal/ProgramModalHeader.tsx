
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Share } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';
import { useToast } from '@/hooks/use-toast';

interface ProgramModalHeaderProps {
  programData: ProgramDetail;
  onClose: () => void;
}

const ProgramModalHeader: React.FC<ProgramModalHeaderProps> = ({ 
  programData, 
  onClose 
}) => {
  const { toast } = useToast();

  const handleShareProgram = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: programData.title,
          text: programData.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Program link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share program. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border-b p-6 pb-4 flex-shrink-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{programData.title}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareProgram}
                className="h-8 w-8"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={programData.expert.photo} 
                alt={programData.expert.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{programData.expert.name}</p>
                <p className="text-xs text-gray-500">{programData.expert.experience} experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramModalHeader;
