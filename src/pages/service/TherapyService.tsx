
import React from "react";
import { ServiceLayout } from "@/components/ui/service-layout";

const TherapyService = () => {
  return (
    <ServiceLayout
      title="Therapy Sessions"
      subtitle="Professional support for your mental health journey"
      iconSrc="/lovable-uploads/6c427c55-7a38-4dad-8c60-cc782cbc5bd7.png"
      iconBgClass="bg-ifind-aqua/10"
    >
      <p>
        Our therapy sessions provide a safe and confidential space for you to explore your thoughts, 
        feelings, and challenges with the guidance of experienced mental health professionals.
      </p>
      
      <h2>How Our Therapy Sessions Help</h2>
      <p>
        Whether you're dealing with anxiety, depression, relationship issues, or simply seeking personal growth,
        our licensed therapists use evidence-based approaches to help you develop insights and strategies for positive change.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Individual Therapy</h3>
          <p>One-on-one sessions tailored to your specific needs and goals.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Group Therapy</h3>
          <p>Shared experiences and support in a facilitated group environment.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Couples Therapy</h3>
          <p>Improve communication and resolve conflicts in your relationship.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Family Therapy</h3>
          <p>Address family dynamics and build healthier relationships.</p>
        </div>
      </div>
      
      <h2>What to Expect</h2>
      <p>
        Our sessions typically last 50-60 minutes and take place in a comfortable, confidential online environment.
        Your therapist will work with you to understand your concerns, establish goals, and develop a therapeutic
        approach that best suits your needs.
      </p>
      
      <p>
        Connect with one of our qualified therapists today and take the first step toward improved mental well-being.
      </p>
    </ServiceLayout>
  );
};

export default TherapyService;
