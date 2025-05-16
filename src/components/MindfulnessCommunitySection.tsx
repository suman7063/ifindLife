import React from 'react';
import { Button } from '@/components/ui/button';
const MindfulnessCommunitySection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          {/* Left - Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img src="/lovable-uploads/6c427c55-7a38-4dad-8c60-cc782cbc5bd7.png" alt="Mindfulness Community" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
          
          {/* Right - Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-center md:text-center">Join Our Mindfulness Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with like-minded individuals committed to mental wellbeing and personal growth. 
              Our supportive community offers a safe space to share experiences, learn mindfulness 
              techniques, and build meaningful connections.
            </p>
            
            <div className="space-y-4">
              <Button className="w-full bg-ifind-teal hover:bg-ifind-teal/90 text-white flex items-center justify-center gap-2" onClick={() => window.open('https://chat.whatsapp.com/xyz', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.6004 3.39894C18.3074 1.19895 15.2034 0 11.9954 0C5.4424 0 0.0914 5.35095 0.0914 11.9039C0.0914 14.0159 0.6544 16.0729 1.7304 17.8799L0.0184 24L6.2624 22.3179C8.0034 23.2979 9.9734 23.8159 11.9904 23.8159H11.9954C18.5454 23.8159 24.0004 18.4649 24.0004 11.9119C24.0004 8.70395 22.8924 5.59895 20.6004 3.39894ZM11.9954 21.8399C10.2034 21.8399 8.4504 21.3499 6.9064 20.4199L6.5474 20.2199L2.8424 21.2089L3.8464 17.6039L3.6274 17.2319C2.5994 15.6449 2.0674 13.8039 2.0674 11.9039C2.0674 6.43895 6.5304 1.97595 12.0004 1.97595C14.6774 1.97595 17.1974 3.00895 19.1014 4.91295C21.0044 6.81695 22.0304 9.33594 22.0254 11.9119C22.0254 17.3789 17.4604 21.8399 11.9954 21.8399Z" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.8694 14.4315C17.5894 14.2915 16.1044 13.5615 15.8434 13.4715C15.5834 13.3815 15.3884 13.3365 15.1944 13.6165C15.0004 13.8965 14.4224 14.5765 14.2534 14.7705C14.0824 14.9645 13.9134 14.9885 13.6344 14.8475C11.8744 13.9675 10.7224 13.2745 9.56439 11.2715C9.24539 10.7315 9.83639 10.7785 10.3854 9.68152C10.4764 9.48752 10.4304 9.31752 10.3624 9.17652C10.2944 9.03552 9.71439 7.55053 9.47639 6.99053C9.24539 6.44253 9.01039 6.52053 8.83139 6.51053C8.66039 6.50153 8.46639 6.50153 8.27139 6.50153C8.07739 6.50153 7.77139 6.56853 7.51239 6.84853C7.25239 7.12853 6.47539 7.85852 6.47539 9.34352C6.47539 10.8275 7.53939 12.2695 7.67639 12.4645C7.81439 12.6585 9.69939 15.5405 12.5774 16.8405C14.2424 17.6415 14.9164 17.7095 15.7784 17.5695C16.3074 17.4815 17.5044 16.8415 17.7424 16.1915C17.9804 15.5405 17.9804 14.9805 17.9124 14.8695C17.8464 14.7525 17.6524 14.6835 17.3734 14.5435L17.8694 14.4315Z" fill="currentColor" />
                </svg>
                Join WhatsApp Community
              </Button>
              <Button className="w-full bg-ifind-purple hover:bg-ifind-purple/90 text-white flex items-center justify-center gap-2" onClick={() => window.open('https://discord.gg/xyz', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="currentColor" />
                </svg>
                Join Discord Community
              </Button>
              <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2" onClick={() => window.open('https://t.me/xyz', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor" />
                </svg>
                Join Telegram Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default MindfulnessCommunitySection;