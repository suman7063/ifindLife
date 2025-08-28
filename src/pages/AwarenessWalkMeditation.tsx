import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, Heart, CheckCircle, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRazorpayProgrammePayment } from '@/hooks/useRazorpayProgrammePayment';

const AwarenessWalkMeditation = () => {
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
      id: 5,
      title: "Managing Depression",
      price: "€197",
      color: "#5AC8FA"
    }
  ];

  const modules = [
    {
      title: "The Walk - Grounding in Movement",
      description: "Foundation of meditative walking and body awareness",
      type: "Video + Guided Practice"
    },
    {
      title: "The Expansion - Consciousness Opening",
      description: "Expanding awareness through conscious movement",
      type: "Video + Meditation Practice"
    },
    {
      title: "The Insights - Inner Wisdom",
      description: "Accessing deeper understanding through movement",
      type: "Video + Reflection Exercise"
    },
    {
      title: "Passing Through - Transformation",
      description: "Dynamic practice for fear release and joy awakening",
      type: "Video + Active Meditation"
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6" style={{ backgroundColor: '#7DD8C9' }}>
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2E2E2E' }}>
              Awareness Walk Meditation
            </h1>
            <p className="text-xl mb-4" style={{ color: '#7DD8C9' }}>
              Move, Awaken, and Pass Through
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#2E2E2E', opacity: 0.8 }}>
              "Even in movement, I can be still. Even when I go fast, I can remain aware." This dynamic meditation 
              technique brings body-mind alignment through conscious movement and a powerful "passing through" practice, 
              awakening fearlessness and joyful connection to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>4 weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>315+ students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ fill: '#5AC8FA', color: '#5AC8FA' }} />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-white px-8 py-3 rounded-full hover:opacity-90" 
                style={{ backgroundColor: '#7DD8C9' }}
                onClick={() => initiateProgrammePayment({
                  id: 6,
                  title: "Awareness Walk Meditation Course",
                  price: 147,
                  currency: '€'
                })}
                disabled={isProcessing(6)}
              >
                {isProcessing(6) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Enroll Now - €147'
                )}
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 rounded-full" style={{ borderColor: '#7DD8C9', color: '#7DD8C9' }}>
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
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#7DD8C9' }}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: '#2E2E2E' }}>{module.title}</h3>
                            <p className="text-sm" style={{ color: '#2E2E2E', opacity: 0.8 }}>{module.description}</p>
                            <p className="text-xs" style={{ color: '#2E2E2E', opacity: 0.6 }}>{module.type}</p>
                          </div>
                        </div>
                        <Play className="w-5 h-5" style={{ color: '#7DD8C9' }} />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>What You'll Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Full guided meditation practice from grounding to transformation",
                    "Energetic and psychological integration of stillness within movement",
                    "Release of fear and awakening of joy, trust, and life flow",
                    "Body-mind alignment through conscious movement",
                    "Expanded awareness and deeper connection to nature",
                    "Dynamic 'Passing Through' exercise for breakthrough moments"
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" style={{ color: '#5AC8FA' }} />
                      <span style={{ color: '#2E2E2E' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Practice Structure</h2>
                <div className="space-y-4">
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7DD8C9', opacity: 0.2 }}>
                        <Heart className="w-6 h-6" style={{ color: '#7DD8C9' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>Grounding Phase</h3>
                        <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                          Begin with nature connection, breath awareness, and body grounding to establish 
                          a stable foundation for meditative movement.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5AC8FA', opacity: 0.2 }}>
                        <Star className="w-6 h-6" style={{ color: '#5AC8FA' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>Movement Phase</h3>
                        <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                          Transition into meditative walking with expanded consciousness, 
                          maintaining awareness while in motion.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A88BEB', opacity: 0.2 }}>
                        <Users className="w-6 h-6" style={{ color: '#A88BEB' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>Transformation Phase</h3>
                        <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                          Experience the dynamic "Passing Through" practice for releasing limitations 
                          and awakening fearless joy and trust.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Meet the Instructor */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Meet Your Guide</h2>
                <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#7DD8C9' }}>
                      MD
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#2E2E2E' }}>Master Dev OM</h3>
                      <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                        Expert meditation teacher specializing in dynamic meditation practices that integrate 
                        movement with mindfulness. With deep understanding of consciousness expansion through 
                        embodied practice, Master Dev OM guides students to discover stillness within motion 
                        and fearless joy through transformative movement meditation.
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
                    <span style={{ color: '#2E2E2E' }}>4 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Modules</span>
                    <span style={{ color: '#2E2E2E' }}>4 progressive</span>
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
                    <div className="text-3xl font-bold mb-2" style={{ color: '#7DD8C9' }}>€147</div>
                    <p className="text-sm mb-4" style={{ color: '#2E2E2E', opacity: 0.6 }}>One-time payment</p>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: '#7DD8C9' }}
                      onClick={() => initiateProgrammePayment({
                        id: 6,
                        title: "Awareness Walk Meditation Course",
                        price: 147,
                        currency: '€'
                      })}
                      disabled={isProcessing(6)}
                    >
                      {isProcessing(6) ? (
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

export default AwarenessWalkMeditation;
