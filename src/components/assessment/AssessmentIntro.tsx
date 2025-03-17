
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AssessmentIntroProps {
  onStart: () => void;
}

const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onStart }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-lg text-ifind-charcoal/90">
          Welcome to the Well-Being Check-In. This assessment will provide you with insights into your current mental well-being.
        </p>
        
        <p className="text-ifind-charcoal/80">
          This brief assessment contains questions about your emotions, stress levels, and lifestyle habits. 
          It takes about 5 minutes to complete and will help you understand your current mental health status.
        </p>

        <Alert className="bg-ifind-offwhite border-ifind-teal/30">
          <Info className="h-5 w-5 text-ifind-teal" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription className="text-sm text-ifind-charcoal/70">
            This assessment is for informational purposes only and is not a substitute for professional diagnosis or treatment. 
            If you're experiencing a mental health emergency, please call your local emergency number or crisis hotline immediately.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="font-medium text-ifind-charcoal">What to expect:</h3>
          <ul className="list-disc list-inside space-y-1 text-ifind-charcoal/80 pl-2">
            <li>Questions about your emotions and feelings over the past two weeks</li>
            <li>Questions about stress and your coping mechanisms</li>
            <li>Questions about lifestyle factors that affect mental health</li>
            <li>A personal assessment based on your answers</li>
            <li>Resources tailored to your results</li>
          </ul>
        </div>

        <p className="text-ifind-charcoal/80">
          Your responses will be kept confidential. You can exit the assessment at any time.
        </p>
      </div>

      <div className="pt-4">
        <Button 
          onClick={onStart}
          className="w-full md:w-auto bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-opacity text-white"
        >
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentIntro;
