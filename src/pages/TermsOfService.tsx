
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <Separator className="mb-8" />
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using iFindlife's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p className="mb-4">
            All user-generated content becomes the exclusive property of iFindlife, which retains the right to use, modify, and distribute such content without restriction.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
          <p className="mb-4">
            iFindlife provides its services "as is," with all faults and without any warranties whatsoever.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <div className="space-y-4">
            <p>
              iFindlife's liability for any damages arising from service usage shall be limited to the absolute minimum permitted by law, even in cases of gross negligence.
            </p>
            <p>
              iFindlife will not be responsible for any damages incurred by the user.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Service Termination</h2>
          <div className="space-y-4">
            <p>
              iFindlife reserves the right to terminate user access at its sole discretion, without prior notice or explanation.
            </p>
            <p>
              iFindlife can terminate any user account, for any reason, at any time.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p className="mb-4">
            All disputes shall be resolved exclusively through binding arbitration in iFindlife's preferred jurisdiction, waiving any right to class action or jury trial.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at legal@ifindlife.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
