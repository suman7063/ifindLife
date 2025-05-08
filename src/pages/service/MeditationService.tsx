
import React from "react";
import { ServiceLayout } from "@/components/ui/service-layout";

const MeditationService = () => {
  return (
    <ServiceLayout
      title="Guided Meditations"
      subtitle="Find calm and clarity with expert-led meditation sessions"
      iconSrc="/lovable-uploads/1b420877-7be1-4010-b806-5850cb719642.png"
      iconBgClass="bg-green-100"
    >
      <p>
        Our guided meditation sessions help you cultivate mindfulness, reduce stress, and enhance your overall well-being
        through expert-led practices designed for all experience levels.
      </p>
      
      <h2>Benefits of Our Guided Meditations</h2>
      <p>
        Regular meditation practice has been shown to reduce anxiety, improve focus, enhance emotional regulation,
        and promote better sleep. Our expert guides will help you develop a sustainable practice that fits your lifestyle.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Mindfulness Meditation</h3>
          <p>Learn to be present in the moment and develop greater awareness.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Stress Reduction</h3>
          <p>Techniques specifically designed to calm the nervous system.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Sleep Enhancement</h3>
          <p>Practices to help you unwind and prepare for restful sleep.</p>
        </div>
      </div>
      
      <h2>Format Options</h2>
      <p>
        Choose from one-on-one sessions with a meditation guide, group meditation classes, or 
        access to our library of recorded meditations for practice at your own convenience.
      </p>
      
      <p>
        Whether you're new to meditation or looking to deepen your practice, our expert guides 
        will help you develop skills for greater peace and presence in your daily life.
      </p>
    </ServiceLayout>
  );
};

export default MeditationService;
