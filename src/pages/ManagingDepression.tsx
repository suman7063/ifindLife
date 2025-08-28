import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, Brain, CheckCircle, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRazorpayProgrammePayment } from '@/hooks/useRazorpayProgrammePayment';

const ManagingDepression = () => {
  const navigate = useNavigate();
  const { isProcessing, initiateProgrammePayment } = useRazorpayProgrammePayment();

  const otherCourses = [
    {
      id: 1,
      title: "Fear & Guilt Liberation",
      price: "€297",
      color: "#A88BEB"
    },
    {
      id: 2,
      title: "Freedom: Inner Clarity",
      price: "€497",
      color: "#5AC8FA"
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
    },
    {
      id: 6,
      title: "Awareness Walk Meditation",
      price: "€147",
      color: "#7DD8C9"
    }
  ];

  const modules = [
    {
      title: "Module 1: The Gentle Observer",
      description: "Introduction to mindful awareness and self-observation",
      type: "Video + Exercise + Reflection"
    },
    {
      title: "Module 2: Naming Your Feelings",
      description: "Learning to identify and acknowledge emotions",
      type: "Video + Exercise + Reflection"
    },
    {
      title: "Module 3: Reflect and Connect",
      description: "Building deeper self-understanding and connection",
      type: "Video + Exercise + Reflection"
    },
    {
      title: "Module 4: Practical Strategies",
      description: "Tools for managing persistent low mood",
      type: "Video + Practical Exercises"
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
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2E2E2E' }}>
              Managing Depression
            </h1>
            <p className="text-xl mb-4" style={{ color: '#5AC8FA' }}>
              Finding Your Light - A Mindful Path to Renewed Well-being
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#2E2E2E', opacity: 0.8 }}>
              Illuminate the darkness within and discover healing through mindful practices. This course empowers you with 
              practical strategies to understand, navigate, and gently lift persistent low mood, fostering greater emotional 
              balance, inner peace, and a renewed sense of well-being.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>6 weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>420+ students</span>
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
                  id: 5,
                  title: "Managing Depression: Finding Your Light",
                  price: 197,
                  currency: '€'
                })}
                disabled={isProcessing(5)}
              >
                {isProcessing(5) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Enroll Now - €197'
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
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Course Syllabus</h2>
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
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>What You'll Achieve</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Develop practical strategies for managing low mood",
                    "Learn mindful observation and emotional awareness",
                    "Build resilience and emotional balance",
                    "Foster inner peace and renewed well-being",
                    "Create sustainable self-improvement practices",
                    "Reconnect with your authentic self"
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" style={{ color: '#7DD8C9' }} />
                      <span style={{ color: '#2E2E2E' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Course Approach</h2>
                <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                  <p style={{ color: '#2E2E2E', opacity: 0.8 }} className="mb-4">
                    This course is built upon iFindLife's core principles, offering functional tools, profound mindfulness 
                    practices, and a subtle integration of spiritual reconnection to self and the present moment.
                  </p>
                  <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                    It is entirely non-clinical, focusing on self-improvement, resilience, and holistic wellness, 
                    providing support for individuals experiencing symptoms of depression without offering a diagnosis 
                    or medical treatment.
                  </p>
                </Card>
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
                        Expert in mindful practices and holistic wellness approaches. Dedicated to providing 
                        compassionate guidance for individuals seeking to understand and overcome persistent 
                        low mood through practical, evidence-based strategies rooted in mindfulness and spiritual awareness.
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
                    <span style={{ color: '#2E2E2E' }}>6 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Modules</span>
                    <span style={{ color: '#2E2E2E' }}>4 comprehensive</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Access</span>
                    <span style={{ color: '#2E2E2E' }}>Lifetime</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Certificate</span>
                    <span style={{ color: '#2E2E2E' }}>Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Language</span>
                    <span style={{ color: '#2E2E2E' }}>English</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4" style={{ borderColor: '#E5E5E5' }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#5AC8FA' }}>€197</div>
                    <p className="text-sm mb-4" style={{ color: '#2E2E2E', opacity: 0.6 }}>One-time payment</p>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: '#5AC8FA' }}
                      onClick={() => initiateProgrammePayment({
                        id: 5,
                        title: "Managing Depression: Finding Your Light",
                        price: 197,
                        currency: '€'
                      })}
                      disabled={isProcessing(5)}
                    >
                      {isProcessing(5) ? (
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

export default ManagingDepression;
