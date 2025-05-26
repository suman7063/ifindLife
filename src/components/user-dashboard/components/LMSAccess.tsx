
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { EnrolledProgram } from '@/types/user.types';

interface LMSAccessProps {
  enrollment: EnrolledProgram;
}

export function LMSAccess({ enrollment }: LMSAccessProps) {
  const handleLMSAccess = () => {
    if (enrollment.third_party_lms?.access_url) {
      window.open(enrollment.third_party_lms.access_url, '_blank');
    }
  };

  if (!enrollment.third_party_lms) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLMSAccess}
      className="flex items-center gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Access {enrollment.third_party_lms.provider.toUpperCase()}
    </Button>
  );
}
