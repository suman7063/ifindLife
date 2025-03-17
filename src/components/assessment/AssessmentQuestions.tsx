
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AssessmentData } from '@/types/assessment';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentQuestionsProps {
  assessmentData: AssessmentData;
  onAnswerChange: (section: keyof AssessmentData, index: number, value: number) => void;
  onOpenEndedResponse: (text: string) => void;
  onSubmit: () => void;
}

const AssessmentQuestions: React.FC<AssessmentQuestionsProps> = ({
  assessmentData,
  onAnswerChange,
  onOpenEndedResponse,
  onSubmit,
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  
  const sections = [
    {
      title: "Core Emotional Well-Being",
      description: "These questions help assess for symptoms of depression and anxiety.",
      questions: [
        {
          question: "Over the last 2 weeks, how often have you been bothered by feeling little interest or pleasure in doing things?",
          options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ],
          section: "emotionalWellbeing" as keyof AssessmentData,
          index: 0
        },
        {
          question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
          options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ],
          section: "emotionalWellbeing" as keyof AssessmentData,
          index: 1
        },
        {
          question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
          options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ],
          section: "emotionalWellbeing" as keyof AssessmentData,
          index: 2
        },
        {
          question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
          options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ],
          section: "emotionalWellbeing" as keyof AssessmentData,
          index: 3
        }
      ]
    },
    {
      title: "Stress and Coping",
      description: "These questions help assess your stress levels and coping mechanisms.",
      questions: [
        {
          question: "In the past week, how often have you had trouble relaxing, even when you tried?",
          options: [
            { value: 0, label: "Never" },
            { value: 1, label: "Rarely" },
            { value: 2, label: "Sometimes" },
            { value: 3, label: "Often" },
            { value: 4, label: "Always" },
          ],
          section: "stressCoping" as keyof AssessmentData,
          index: 0
        },
        {
          question: "How stressed have you felt in the past week?",
          options: [
            { value: 0, label: "Not at all stressed" },
            { value: 1, label: "Slightly stressed" },
            { value: 2, label: "Moderately stressed" },
            { value: 3, label: "Very stressed" },
            { value: 4, label: "Extremely stressed" },
          ],
          section: "stressCoping" as keyof AssessmentData,
          index: 1
        },
        {
          question: "How well do you feel you are coping with the stress in your life?",
          options: [
            { value: 4, label: "Not coping well at all" },
            { value: 3, label: "Coping poorly" },
            { value: 2, label: "Coping adequately" },
            { value: 1, label: "Coping well" },
            { value: 0, label: "Coping very well" },
          ],
          section: "stressCoping" as keyof AssessmentData,
          index: 2
        },
        {
          question: "How often do you feel you have a strong support system to rely on?",
          options: [
            { value: 4, label: "Never" },
            { value: 3, label: "Rarely" },
            { value: 2, label: "Sometimes" },
            { value: 1, label: "Often" },
            { value: 0, label: "Always" },
          ],
          section: "stressCoping" as keyof AssessmentData,
          index: 3
        }
      ]
    },
    {
      title: "Lifestyle and Health",
      description: "These questions help assess lifestyle factors that can affect your mental well-being.",
      questions: [
        {
          question: "How many hours of sleep did you get on average per night in the past week?",
          options: [
            { value: 3, label: "Less than 5 hours" },
            { value: 2, label: "5-6 hours" },
            { value: 0, label: "7-8 hours" },
            { value: 1, label: "9 or more hours" },
          ],
          section: "lifestyleHealth" as keyof AssessmentData,
          index: 0
        },
        {
          question: "In the past week, how many days did you engage in at least 30 minutes of physical activity?",
          options: [
            { value: 3, label: "0 days" },
            { value: 2, label: "1-2 days" },
            { value: 1, label: "3-4 days" },
            { value: 0, label: "5-7 days" },
          ],
          section: "lifestyleHealth" as keyof AssessmentData,
          index: 1
        },
        {
          question: "In the past week, how often have you used alcohol or other substances to cope with stress?",
          options: [
            { value: 0, label: "Never" },
            { value: 1, label: "Rarely" },
            { value: 2, label: "Sometimes" },
            { value: 3, label: "Often" },
            { value: 4, label: "Always" },
          ],
          section: "lifestyleHealth" as keyof AssessmentData,
          index: 2
        }
      ]
    },
    {
      title: "Final Thoughts",
      description: "Share any additional information about your well-being.",
      questions: []
    }
  ];

  const getCurrentValue = (section: keyof AssessmentData, index: number): number => {
    if (section === "emotionalWellbeing") {
      if (index < 2) {
        return assessmentData.emotionalWellbeing.depression[index];
      } else {
        return assessmentData.emotionalWellbeing.anxiety[index - 2];
      }
    } else if (section === "stressCoping") {
      return assessmentData.stressCoping[index];
    } else if (section === "lifestyleHealth") {
      return assessmentData.lifestyleHealth[index];
    }
    return 0;
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const isSectionComplete = (): boolean => {
    if (currentSection === sections.length - 1) {
      // Open-ended section is always considered complete
      return true;
    }

    const currentSectionObj = sections[currentSection];
    for (let i = 0; i < currentSectionObj.questions.length; i++) {
      const q = currentSectionObj.questions[i];
      const value = getCurrentValue(q.section, q.index);
      if (value === undefined || value === null) {
        return false;
      }
    }
    return true;
  };

  const handleFinish = () => {
    onSubmit();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-ifind-charcoal mb-2">
          {sections[currentSection].title}
        </h2>
        <p className="text-ifind-charcoal/70 mb-6">
          {sections[currentSection].description}
        </p>

        {currentSection < sections.length - 1 ? (
          <div className="space-y-10">
            {sections[currentSection].questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-4">
                <p className="font-medium text-ifind-charcoal">{q.question}</p>
                <RadioGroup 
                  value={getCurrentValue(q.section, q.index).toString()}
                  onValueChange={(value) => onAnswerChange(q.section, q.index, parseInt(value))}
                  className="space-y-2"
                >
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value.toString()} id={`${currentSection}-${qIndex}-${oIndex}`} />
                      <Label htmlFor={`${currentSection}-${qIndex}-${oIndex}`} className="text-ifind-charcoal/80">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-medium text-ifind-charcoal">
              Is there anything else you would like to share about your current state of well-being?
            </p>
            <Textarea
              placeholder="Share your thoughts here (optional)..."
              value={assessmentData.openEndedReflection}
              onChange={(e) => onOpenEndedResponse(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        {currentSection > 0 ? (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="border-ifind-teal/50 text-ifind-teal"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
        ) : (
          <div></div>
        )}

        {currentSection < sections.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isSectionComplete()}
            className="bg-ifind-teal text-white hover:bg-ifind-teal/90"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-opacity text-white"
          >
            Complete Assessment
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentQuestions;
