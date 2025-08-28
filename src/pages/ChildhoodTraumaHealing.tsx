import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, Heart, CheckCircle, Play, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRazorpayProgrammePayment } from '@/hooks/useRazorpayProgrammePayment';

const ChildhoodTraumaHealing = () => {
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
      id: 2,
      title: "Freedom: Inner Clarity",
      price: "€497",
      color: "#5AC8FA"
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
      title: "Understanding Childhood Trauma",
      description: "Recognizing patterns and their impact on your current life",
      type: "Educational Videos + Assessment"
    },
    {
      title: "Creating Safety",
      description: "Building internal and external safe spaces for healing",
      type: "Guided Exercises + Techniques"
    },
    {
      title: "Inner Child Healing",
      description: "Reconnecting with and nurturing your inner child",
      type: "Healing Sessions + Visualizations"
    },
    {
      title: "Reparenting Yourself",
      description: "Developing healthy internal parenting voices",
      type: "Practical Tools + Affirmations"
    },
    {
      title: "Trauma-Informed Coping",
      description: "Building healthy coping strategies and resilience",
      type: "Skill Building + Practice"
    },
    {
      title: "Creating New Patterns",
      description: "Establishing healthy relationships and boundaries",
      type: "Integration + Application"
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
              Childhood Trauma
            </h1>
            <p className="text-xl mb-4" style={{ color: '#7DD8C9' }}>
              Heal Your Inner Child
            </p>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#2E2E2E', opacity: 0.8 }}>
              Gentle, evidence-based approaches to healing childhood wounds and creating new patterns of wellbeing. 
              This compassionate programme provides a safe space to process past experiences and build resilience 
              for a healthier future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-4 text-sm" style={{ color: '#2E2E2E', opacity: 0.7 }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>16 weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>650+ students</span>
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
                  id: 3,
                  title: "Childhood Trauma Healing",
                  price: 697,
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
                  'Enroll Now - €697'
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
              {/* Important Notice */}
              <Card className="p-6 mb-8" style={{ backgroundColor: '#F8F8F8', borderLeft: '4px solid #7DD8C9' }}>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 mt-1" style={{ color: '#7DD8C9' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>Safe & Supported Healing</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      This programme is designed with trauma-informed principles. We create a safe, supportive 
                      environment where you can heal at your own pace. Professional therapeutic support is available 
                      throughout your journey.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Healing Journey</h2>
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
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Your Healing Outcomes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Understand how childhood experiences shape current patterns",
                    "Develop emotional regulation and coping strategies",
                    "Heal and nurture your inner child",
                    "Build healthy boundaries and relationships",
                    "Create new, positive neural pathways",
                    "Develop self-compassion and resilience"
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" style={{ color: '#7DD8C9' }} />
                      <span style={{ color: '#2E2E2E' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Trauma-Informed Approach</h2>
                <div className="space-y-6">
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Safety First</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Every aspect of this programme prioritizes your physical and emotional safety, creating a secure foundation for healing.
                    </p>
                  </Card>
                  
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Your Pace, Your Journey</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Healing happens at different rates for everyone. This programme respects your individual timeline and provides flexibility.
                    </p>
                  </Card>

                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Evidence-Based Methods</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Uses proven therapeutic approaches including somatic experiencing, cognitive processing, and mindfulness-based healing.
                    </p>
                  </Card>
                </div>
              </div>

              {/* Support Available */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Comprehensive Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>24/7 Crisis Support</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Access to crisis support resources and professional referrals when needed.
                    </p>
                  </Card>
                  
                  <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>Peer Community</h3>
                    <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                      Safe, moderated community spaces for sharing and mutual support.
                    </p>
                  </Card>
                </div>
              </div>

              {/* Meet the Instructor */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E2E2E' }}>Meet Your Healing Guide</h2>
                <Card className="p-6" style={{ backgroundColor: '#F8F8F8' }}>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#7DD8C9' }}>
                      IL
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#2E2E2E' }}>I Find Life Trauma Specialist Team</h3>
                      <p style={{ color: '#2E2E2E', opacity: 0.8 }}>
                        Our specialized team of trauma-informed therapists and healers brings decades of experience 
                        in childhood trauma recovery. They are committed to providing compassionate, safe, and 
                        effective healing support throughout your journey.
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
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Programme Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Duration</span>
                    <span style={{ color: '#2E2E2E' }}>16 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Sessions</span>
                    <span style={{ color: '#2E2E2E' }}>32 sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Access</span>
                    <span style={{ color: '#2E2E2E' }}>Lifetime</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Support</span>
                    <span style={{ color: '#2E2E2E' }}>24/7 + Professional</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#2E2E2E', opacity: 0.7 }}>Certificate</span>
                    <span style={{ color: '#2E2E2E' }}>Yes</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4" style={{ borderColor: '#E5E5E5' }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#7DD8C9' }}>€697</div>
                    <p className="text-sm mb-4" style={{ color: '#2E2E2E', opacity: 0.6 }}>One-time payment</p>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: '#7DD8C9' }}
                      onClick={() => initiateProgrammePayment({
                        id: 3,
                        title: "Childhood Trauma Healing",
                        price: 697,
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

export default ChildhoodTraumaHealing;
