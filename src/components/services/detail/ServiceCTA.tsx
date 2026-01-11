
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceCTAProps {
  title: string;
  color: string;
  textColor: string;
  buttonColor: string;
  gradientColor: string;
  onBookNowClick: () => void;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  color,
  textColor,
  buttonColor,
  gradientColor,
  onBookNowClick
}) => {
  // Parse gradient color - format: #RRGGBB20 or rgba
  const getGradientStyle = () => {
    if (gradientColor.includes('rgba') || gradientColor.includes('rgb')) {
      return { background: `linear-gradient(to bottom right, ${gradientColor}, white)` };
    }
    // If it's hex with opacity suffix like #5AC8FA20
    if (gradientColor.length === 9 && gradientColor.startsWith('#')) {
      const hex = gradientColor.slice(0, 7);
      const opacity = parseInt(gradientColor.slice(7), 16) / 255;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { background: `linear-gradient(to bottom right, rgba(${r}, ${g}, ${b}, ${opacity}), white)` };
    }
    // Default: use color with 20% opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { background: `linear-gradient(to bottom right, rgba(${r}, ${g}, ${b}, 0.2), white)` };
  };

  // Parse button color - format: #RRGGBB|#RRGGBB (main|hover)
  const buttonColors = buttonColor?.split('|') || [color, color];
  const mainButtonColor = buttonColors[0] || color;
  const hoverButtonColor = buttonColors[1] || mainButtonColor;

  return (
    <div className="p-6 rounded-xl" style={getGradientStyle()}>
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor || color }}>
        Ready to experience {title}?
      </h3>
      <p className="text-gray-700 mb-6">
        Schedule your session now and take the first step toward greater well-being.
      </p>
      <Button
        className="w-full text-white py-2 px-4 rounded-md"
        style={{ backgroundColor: mainButtonColor }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverButtonColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = mainButtonColor;
        }}
        onClick={onBookNowClick}
      >
        Book Now
      </Button>
    </div>
  );
};

export default ServiceCTA;
