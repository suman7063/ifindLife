
import React from "react";
import { ServiceLayout } from "@/components/ui/service-layout";

const ListeningService = () => {
  return (
    <ServiceLayout
      title="Heart2Heart Listening Sessions"
      subtitle="Be heard and understood in a supportive, non-judgmental space"
      iconSrc="/lovable-uploads/1086590e-2848-41ea-a5f9-40b33666bb9d.png"
      iconBgClass="bg-pink-100"
    >
      <p>
        Our Heart2Heart Listening Sessions provide a dedicated space where you can express yourself freely
        and be truly heard by compassionate, trained listeners who focus entirely on your needs.
      </p>
      
      <h2>The Power of Being Heard</h2>
      <p>
        Sometimes we don't need advice or solutions—we simply need someone to listen deeply and validate our experiences.
        Heart2Heart sessions offer the therapeutic benefit of expressing yourself to someone who is fully present and attentive.
      </p>
      
      <div className="bg-muted p-6 rounded-lg my-8">
        <h3 className="text-lg font-medium mb-2">What Makes Heart2Heart Different</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Non-therapeutic approach focused purely on listening</li>
          <li>No advice-giving or problem-solving (unless requested)</li>
          <li>Trained listeners skilled in empathy and presence</li>
          <li>Flexible session lengths to suit your needs</li>
          <li>Available virtually or in-person at select locations</li>
        </ul>
      </div>
      
      <h2>When to Choose Heart2Heart</h2>
      <p>
        Heart2Heart sessions are ideal when you need to:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Process difficult emotions or experiences</li>
        <li>Talk through a situation without seeking specific advice</li>
        <li>Feel acknowledged and validated</li>
        <li>Experience the relief of expressing what's on your mind</li>
      </ul>
      
      <p>
        Connect with a Heart2Heart listener today and experience the powerful simplicity of being truly heard.
      </p>
    </ServiceLayout>
  );
};

export default ListeningService;
