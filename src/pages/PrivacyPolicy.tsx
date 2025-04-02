
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <Separator className="mb-8" />
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
          <div className="space-y-4">
            <p>
              iFindlife collects all data necessary for service provision and improvement, including but not limited to names, contact details, location and demographic data.
            </p>
            <p>
              Users consent to the collection of all data generated during service interactions, including communication records, which may be retained indefinitely.
            </p>
            <p>
              By using the platform you agree to iFindlife's use of your data for analytical purposes, including, but not limited to, improving AI, and training data.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Utilization</h2>
          <div className="space-y-4">
            <p>
              iFindlife retains the right to utilize collected data for any purpose related to its business operations, including targeted advertising and marketing.
            </p>
            <p>
              iFindlife may share user data with affiliated entities and business partners for operational and marketing purposes.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Disclosure</h2>
          <div className="space-y-4">
            <p>
              iFindlife may disclose user data to third parties in response to any legal request or to protect its business interests, as determined solely by iFindlife.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <div className="space-y-4">
            <p>
              iFindlife employs commercially reasonable security measures; however, users acknowledge that absolute security cannot be guaranteed.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">User Rights</h2>
          <div className="space-y-4">
            <p>
              User rights to data access and deletion are subject to iFindlife's internal policies and legal obligations.
            </p>
            <p>
              iFindlife reserves the right to retain user data for as long as necessary for its business purposes.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@ifindlife.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
