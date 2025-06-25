
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Sparkles } from 'lucide-react';
import MentalHealthAssessmentContent from '@/components/assessment/MentalHealthAssessmentContent';
import EmotionalWellnessAssessmentContent from '@/components/assessment/EmotionalWellnessAssessmentContent';
import SpiritualWellnessAssessmentContent from '@/components/assessment/SpiritualWellnessAssessmentContent';

const UnifiedAssessment = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'mental';
  const [activeTab, setActiveTab] = useState(type);

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Wellness Assessments
              </h1>
              <p className="text-gray-600">
                Comprehensive evaluations to help you understand your well-being
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="mental" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Mental Wellness
                </TabsTrigger>
                <TabsTrigger value="emotional" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Emotional Wellness
                </TabsTrigger>
                <TabsTrigger value="spiritual" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Spiritual Wellness
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mental">
                <MentalHealthAssessmentContent />
              </TabsContent>

              <TabsContent value="emotional">
                <EmotionalWellnessAssessmentContent />
              </TabsContent>

              <TabsContent value="spiritual">
                <SpiritualWellnessAssessmentContent />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnifiedAssessment;
