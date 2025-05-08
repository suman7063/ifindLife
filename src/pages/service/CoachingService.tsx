
import React from "react";
import { ServiceLayout } from "@/components/ui/service-layout";

const CoachingService = () => {
  return (
    <ServiceLayout
      title="Life Coaching"
      subtitle="Achieve your goals and create meaningful change with personalized guidance"
      iconSrc="/lovable-uploads/7069b4db-6802-4e03-b1f1-bf1f03d2c176.png"
      iconBgClass="bg-blue-100"
    >
      <p>
        Our life coaching services help you clarify your vision, overcome obstacles, and create actionable
        plans to achieve your personal and professional goals with support from experienced coaches.
      </p>
      
      <h2>How Life Coaching Works</h2>
      <p>
        Unlike therapy, which often focuses on healing past wounds, life coaching is forward-focused and 
        action-oriented. Your coach will help you identify your goals, recognize limiting beliefs, and
        develop strategies to move toward your desired future.
      </p>
      
      <div className="bg-muted p-6 rounded-lg my-8">
        <h3 className="text-lg font-medium mb-2">Areas We Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ul className="list-disc pl-6 space-y-1">
            <li>Career development and transitions</li>
            <li>Work-life balance</li>
            <li>Personal productivity</li>
            <li>Relationship enhancement</li>
          </ul>
          <ul className="list-disc pl-6 space-y-1">
            <li>Health and wellness goals</li>
            <li>Personal growth</li>
            <li>Life transitions</li>
            <li>Purpose and fulfillment</li>
          </ul>
        </div>
      </div>
      
      <h2>The Coaching Process</h2>
      <p>
        Our coaching relationships typically begin with:
      </p>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>An initial assessment to understand your current situation and goals</li>
        <li>Development of a customized coaching plan</li>
        <li>Regular sessions to implement strategies and track progress</li>
        <li>Accountability support between sessions</li>
        <li>Evaluation and adjustment of goals as you progress</li>
      </ol>
      
      <p>
        Whether you're navigating a major life transition, seeking to improve specific aspects of your life,
        or simply want to move from good to great, our coaches provide the support, perspective, and
        accountability to help you create lasting positive change.
      </p>
    </ServiceLayout>
  );
};

export default CoachingService;
