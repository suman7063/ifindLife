import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, Sparkles, CheckCircle, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRazorpayProgrammePayment } from '@/hooks/useRazorpayProgrammePayment';

const FreedomInnerClarity = () => {
  const navigate = useNavigate();
  const { isProcessing, initiateProgrammePayment } = useRazorpayProgrammePayment();

  const otherCourses = [
    {
      id: 1,
      title: "Fear & Guilt Liberation",
      price: "€280",
      color: "#A88BEB"
    },
    {
      id: 3,
      title: "Childhood Trauma Healing",
      price: "€697",
      color: "#7DD8C9"
    },
    {
      id: 4,
      title: "Energy Alchemy",
      price: "€397",
      color: "#A88BEB"
    }
  ];

  const modules = [
    {
      title: "Self-Discovery Foundations",
      description: "Understanding your true nature and authentic self",
      type: "Video Workshop + Exercises"
    },
    {
      title: "Clarity Meditation Practices",
      description: "Advanced meditation techniques for inner clarity",
      type: "Guided Meditations + Practice"
    },
    {
      title: "Freedom Visualization",
      description: "Breaking through mental and emotional barriers",
      type: "Visualization Sessions + Journal"
    },
    {
      title: "Life Purpose Exploration",
      description: "Discovering and aligning with your soul's purpose",
      type: "Exploration Exercises + Guidance"
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/wellness-seeker-programmes')}
          className="mb-4 hover:bg-[#F8F8F8]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Programmes
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6" style={{ backgroundColor: '#5AC8FA' }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2E2E2E' }}>
              Freedom
            </h1>
            <p className="text-xl mb-4" style={{ color: '#5AC8FA' }}>
              A Journey to Inner Clarity
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#2E2E2E', opacity: 0.8 }}>
              Embark on a transformative journey to inner freedom, clarity, and authentic self-expression. 
              This comprehensive programme guides you through the process of breaking free from limiting beliefs 
              and discovering your true purpose in life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>12 weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>1200+ students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ fill: '#5AC8FA', color: '#5AC8FA' }} />
                  <span>4.8/5 rating</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-white px-8 py-3 rounded-full hover:opacity-90" 
                style={{ backgroundColor: '#5AC8FA' }}
                onClick={() => initiateProgrammePayment({
                  id: 2,
                  title: "Freedom: Inner Clarity",
                  price: 497,
                  currency: '€'
                })}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Enroll Now - €497'
                )}
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 rounded-full" style={{ borderColor: '#5AC8FA', color: '#5AC8FA' }}>
                Preview Course
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Course Journey</h2>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <Card key={index} className="p-6 hover:shadow-md transition-shadow" style={{ backgroundColor: '#F8F8F8' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#5AC8FA' }}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: '#2E2E2E' }}>{module.title}</h3>
                            <p className="text-sm" style={{ color: '#2E2E2E', opacity: 0.8 }}>{module.description}</p>
                            <p className="text-xs" style={{ color: '#2E2E2E', opacity: 0.6 }}>{module.type}</p>
                          </div>
                        </div>
                        <Play className="w-5 h-5" style={{ color: '#5AC8FA' }} />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Your Transformation Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Discover your authentic self beyond conditioning",
                    "Develop unshakeable inner clarity",
                    "Release limiting beliefs and patterns",
                    "Connect with your life's true purpose",
                    "Create a vision for your liberated life",
                    "Build sustainable practices for freedom"
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" style={{ color: '#7DD8C9' }} />
                      <span style={{ color: '#2E2E2E' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>What Makes This Programme Special</h2>
                <div className="space-y-6">
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Comprehensive Approach</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Combines ancient wisdom with modern psychology to provide a holistic path to freedom and clarity.
                    </p>
                  </Card>
                  
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Personalized Journey</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Each module adapts to your unique circumstances and provides personalized guidance for your specific path.
                    </p>
                  </Card>

                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Lasting Results</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Focuses on creating sustainable change that extends far beyond the programme duration.
                    </p>
                  </Card>
                </div>
              </div>

              {/* Meet the Instructor */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Meet Your Guide</h2>
                <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#5AC8FA' }}>
                      IL
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#2E2E2E' }}>I Find Life</h3>
                      <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                        Dedicated guide specializing in inner freedom and authentic self-expression. 
                        With years of experience in transformational coaching, they help individuals 
                        break through barriers and discover their true purpose and power.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Course Info */}
              <Card className="p-6 mb-8" style={{ backgroundColor: '#F8F8F8' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Course Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Duration</span>
                    <span style={{ color: '#2E2E2E' }}>12 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Sessions</span>
                    <span style={{ color: '#2E2E2E' }}>24 comprehensive</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Access</span>
                    <span style={{ color: '#2E2E2E' }}>Lifetime</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Support</span>
                    <span style={{ color: '#2E2E2E' }}>Community + 1:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Certificate</span>
                    <span style={{ color: '#2E2E2E' }}>Yes</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4" style={{ borderColor: '#E5E5E5' }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#5AC8FA' }}>€497</div>
                    <p className="text-sm mb-4" style={{ color: '#2E2E2E', opacity: 0.6 }}>One-time payment</p>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: '#5AC8FA' }}
                      onClick={() => initiateProgrammePayment({
                        id: 2,
                        title: "Freedom: Inner Clarity",
                        price: 497,
                        currency: '€'
                      })}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Other Courses */}
              <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Other Programmes</h3>
                <div className="space-y-3">
                  {otherCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: 'white' }}
                      onClick={() => navigate(`/wellness-seeker-programmes/${course.id}`)}
                    >
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: '#2E2E2E' }}>{course.title}</h4>
                        <p className="text-xs" style={{ color: course.color }}>{course.price}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: course.color, opacity: 0.2 }} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default FreedomInnerClarity;
