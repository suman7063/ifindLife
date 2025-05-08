
import React from "react";
import { ServiceLayout } from "@/components/ui/service-layout";

const RetreatsService = () => {
  return (
    <ServiceLayout
      title="Offline Retreats"
      subtitle="Immersive experiences for deep healing and transformation"
      iconSrc="/lovable-uploads/e5e8d4cc-bfd7-4343-9659-cd3af524de31.png"
      iconBgClass="bg-amber-100"
    >
      <p>
        Step away from the demands of everyday life and immerse yourself in our carefully designed
        in-person retreats that combine therapeutic practices, mindfulness, and community in serene natural settings.
      </p>
      
      <h2>The Retreat Experience</h2>
      <p>
        Our retreats offer a unique opportunity to disconnect from digital distractions and reconnect with yourself
        through guided practices, group sessions, and personal reflection time in beautiful, peaceful environments.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Weekend Retreats</h3>
          <p>2-3 day immersive experiences focused on specific themes or practices.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Extended Retreats</h3>
          <p>5-7 day deeper journeys for profound transformation and practice.</p>
        </div>
      </div>
      
      <h2>What's Included</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Comfortable accommodations in peaceful settings</li>
        <li>Nutritious, delicious meals</li>
        <li>Expert-led workshops and group sessions</li>
        <li>Guided meditation and mindfulness practices</li>
        <li>Time for personal reflection and integration</li>
        <li>Optional one-on-one support with retreat facilitators</li>
      </ul>
      
      <h2>Upcoming Retreats</h2>
      <p>
        We offer retreats throughout the year in various locations. Connect with us to learn about
        upcoming retreat dates, themes, and locations, and find the experience that's right for you.
      </p>
    </ServiceLayout>
  );
};

export default RetreatsService;
