import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const Disclaimer = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date(2025, 4, 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <Separator className="mb-8" />
        
        <div className="space-y-8">
          <p className="text-lg leading-relaxed">
            This Disclaimer governs your use of ifindlife.com (Hereinafter "Website," "Site"). Your continued use of this Website after reading this Disclaimer in its entirety constitutes acceptance of its terms AND creates a legally binding agreement between you and the owner of this Site, iFindLife LLP and its representatives, directors, officers, contractors, employees, and consultants (collectively, the "Company," "we," "our," "us,").
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              If you disagree with any part of the terms set forth below, DO NOT CONTINUE TO READ OR USE THIS WEBSITE IN ANY MANNER WHATSOEVER.
            </p>
          </div>
        </div>
        
        <section className="mt-12 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Terms</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Disclaimer of Warranties</h3>
              <p className="leading-relaxed">
                The information, coaching, and training materials found on this Website, including but not limited to information contained in ebooks, blog posts, podcasts, videos, coaching calls and/or recordings, images, email newsletters or other text files, including all products and services, whether free or offered for sale (collectively, "Content"), are provided "AS IS" and "AS AVAILABLE" with no warranties whatsoever. All express, implied, and statutory warranties, including, without limitation, the warranties of merchantability, fitness for a particular purpose, and non-infringement of proprietary rights, are expressly disclaimed. Company and its data providers disclaim any warranties for the security, reliability, timeliness, and performance of the technology, products, and services offered on the site. Company and its data providers disclaim any warranties for services or goods received through or advertised on the site or received through any links provided on the site, as well as for any information received through the site or through any links provided on the site.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Some states do not allow the exclusion of implied warranties, so these exclusions may not apply to you.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Not a Substitute for Professional Advice and Care</h3>
              <p className="leading-relaxed mb-4">
                The Company is not offering medical advice on this website. The Content is not to be construed as and is never intended to be used as a substitute for professional advice or care. The information provided throughout this Website must not replace or be a substitute for the services of trained and licensed professionals, including those in the financial, medical, behavioural, or other health-related fields. If you are in need of professional advice or medical care you must seek out the services of your own doctor or health care professional.
              </p>
              <p className="leading-relaxed">
                Under no circumstances shall the Company be liable for any special or consequential damages that may result from the use of, the improper use of, or the inability to use the Content found on this Website.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">No Future Guarantees</h3>
              <p className="leading-relaxed">
                As stipulated by law, no future guarantees can be made that you will achieve any results from the content and all forward-looking statements included on this website are simply illustrative and not intended as promises of actual results. Your actual results, or lack of results, will be determined by many other factors beyond our control and it will be important to include those factors in determining your actual results. Because these factors differ between individuals, we cannot guarantee your success as you alone are responsible and accountable for your decisions, actions, and results in life and by your use of the content you agree not to attempt to hold the Company liable for any such decisions, actions or results, at any time, under any circumstances. No guarantees are made that you will achieve any results from the content found on this website, nor any communications We may have with you as part of any engagement whatsoever with you.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Limitation of Liability</h3>
              <p className="leading-relaxed">
                Except as expressly provided herein, under no circumstances shall the Company be liable for any claims whatsoever, including, but not limited to, direct, indirect, special, incidental, punitive or consequential damages (including, but not limited to, any physical or mental illness and/or any lost revenues, profits, opportunities, and/or loss of prospective economic advantage) arising out of or in connection with the use or performance of this site, any communications sent to you from company or information made available throughout this site, including, but not limited to, any damages suffered as a result of omissions or inaccuracies contained in such information.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Modification of Terms</h3>
              <p className="leading-relaxed">
                We reserve the right to modify the terms of this Disclaimer at any time. It is your responsibility to periodically check back here to review this statement for any changes.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Reasonableness of Terms</h3>
              <p className="leading-relaxed">
                By continuing to use this website after reading these Terms, you agree that the exclusions and limitations of liability set forth above are reasonable and acceptable.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                Date: May 1, 2025
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Disclaimer;