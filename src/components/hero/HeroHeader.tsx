
import React from 'react';

interface HeroSlideProps {
  images: string[];
  currentSlide: number;
}

export const HeroHeader: React.FC<HeroSlideProps> = ({ images, currentSlide }) => {
  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {images.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={currentSlide !== index}
        >
          <img 
            src={image} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              borderRadius: '0px'
            }}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      
      <div 
        className="absolute inset-0 flex flex-col justify-center px-[60px]"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <h1 
          className="text-white font-bold"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '80px',
            lineHeight: '90px',
            fontWeight: 700,
            color: '#FFFFFF',
            maxWidth: '540px'
          }}
        >
          You Are<br />
          Not Alone!
        </h1>
      </div>
    </div>
  );
};
