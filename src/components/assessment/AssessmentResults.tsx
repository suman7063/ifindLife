
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw } from 'lucide-react';
import { AssessmentData } from '@/types/assessment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import our new components
import ScoreDisplay from './ScoreDisplay';
import ImportantHealthAlert from './ImportantHealthAlert';
import LifestyleStressSection from './LifestyleStressSection';
import RecommendationsSection from './RecommendationsSection';
import PDFGenerator from './PDFGenerator';
import { calculateScores, generateFeedback, getPhq4RiskLevel } from './utils/assessmentScoring';

interface AssessmentResultsProps {
  assessmentData: AssessmentData;
  onRetake: () => void;
  onExit: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessmentData,
  onRetake,
  onExit,
}) => {
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const pdfRef = React.useRef<HTMLDivElement>(null);

  // Calculate scores and generate feedback
  const scores = calculateScores(assessmentData);
  const feedback = generateFeedback(scores);
  
  // Get PHQ-4 risk level and percentage for progress bar
  const phq4Risk = getPhq4RiskLevel(scores.phq4TotalScore);
  const phq4Percentage = (scores.phq4TotalScore / 12) * 100;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('ifindlife-mental-wellbeing-assessment.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-ifind-charcoal mb-2">
          Your Assessment Results
        </h2>
        <p className="text-ifind-charcoal/70 mb-6">
          Thank you for completing the assessment. Review your results below.
        </p>
      </div>

      <div ref={resultsRef} className="space-y-8 pb-4">
        {/* Score Display */}
        <ScoreDisplay scores={scores} />
        
        {/* Important Health Alert */}
        <ImportantHealthAlert feedback={feedback} />
        
        {/* Lifestyle and Stress Feedback */}
        <LifestyleStressSection feedback={feedback} />
        
        {/* Recommendations and Resources */}
        <RecommendationsSection feedback={feedback} />
        
        <Alert className="bg-ifind-offwhite border-ifind-teal/30">
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription className="text-sm text-ifind-charcoal/70">
            This assessment is for informational purposes only and is not a substitute for professional diagnosis or treatment. 
            If you are concerned about your mental health, please reach out to a healthcare professional.
          </AlertDescription>
        </Alert>
      </div>

      {/* PDF Generator (hidden) */}
      <PDFGenerator 
        ref={pdfRef}
        scores={scores}
        phq4Risk={phq4Risk}
        phq4Percentage={phq4Percentage}
        feedback={feedback}
      />

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          className="border-ifind-teal/50 text-ifind-teal"
        >
          <Download className="h-4 w-4 mr-2" /> Download Results
        </Button>
        
        <Button
          variant="outline"
          onClick={onRetake}
          className="border-ifind-purple/50 text-ifind-purple"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retake Assessment
        </Button>
        
        <Button
          onClick={onExit}
          className="bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-opacity text-white sm:ml-auto"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResults;
