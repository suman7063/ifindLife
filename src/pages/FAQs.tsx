
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const FAQs = () => {
  const faqCategories = [
    {
      name: 'General',
      faqs: [
        {
          question: 'What is iFindLife?',
          answer: 'iFindLife is a comprehensive mental wellness platform that connects individuals with professional therapists and experts. We offer various services including therapy sessions, guided meditations, mindful listening, and wellness programs designed to support your mental health journey.'
        },
        {
          question: 'How does iFindLife work?',
          answer: 'Our platform matches you with qualified mental health professionals based on your specific needs. You can browse experts, book appointments, participate in programs, and access resources all through our user-friendly interface. We provide both online and offline options for therapy and support.'
        },
        {
          question: 'Is iFindLife confidential?',
          answer: 'Absolutely. We prioritize your privacy and confidentiality. All sessions with our experts are private and confidential, and we adhere to strict data protection protocols to ensure your personal information remains secure.'
        }
      ]
    },
    {
      name: 'Services',
      faqs: [
        {
          question: 'What types of services does iFindLife offer?',
          answer: 'We offer a wide range of services including one-on-one therapy sessions, guided meditations, mindful listening sessions, life coaching, offline retreats, and specialized programs for anxiety, depression, relationship counseling, and more.'
        },
        {
          question: 'How long are therapy sessions?',
          answer: 'Standard therapy sessions are typically 50-60 minutes long, though we also offer shorter check-in sessions and extended sessions based on specific needs and expert availability.'
        },
        {
          question: 'Can I choose my therapist?',
          answer: "Yes, you can browse our expert profiles and select a therapist based on their specialization, experience, and approach. We also offer a matching service if you're unsure who would be the best fit for your needs."
        }
      ]
    },
    {
      name: 'Programs',
      faqs: [
        {
          question: 'What are QuickEase Programs?',
          answer: 'QuickEase Programs are short-term interventions designed to provide immediate relief from stress and anxiety. These programs typically consist of 3-5 sessions and focus on practical coping strategies that you can implement right away.'
        },
        {
          question: 'How do I enroll in a program?',
          answer: 'To enroll in a program, browse our programs section, select the one that interests you, and click the "Enroll" button. You\'ll then be guided through the payment process and receive immediate access to the program materials and schedule.'
        },
        {
          question: 'Are programs available for organizations?',
          answer: 'Yes, we offer specialized programs for academic institutions and businesses. These programs are customized to address the specific mental health and wellness needs of students, faculty, employees, or management teams.'
        }
      ]
    },
    {
      name: 'Payments',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept various payment methods including credit/debit cards, net banking, UPI, and wallet payments. All transactions are secured with industry-standard encryption.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'Our refund policy varies depending on the service or program. Generally, we offer full refunds for cancellations made at least 24 hours before a scheduled session. For programs, refunds may be available within the first week if you\'re not satisfied with the content.'
        },
        {
          question: 'Are there any subscription plans?',
          answer: 'Yes, we offer various subscription plans that provide regular access to certain services at a discounted rate. These plans can be monthly or quarterly, and you can cancel at any time.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <section className="py-16 bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find answers to common questions about our services, programs, and platform. If you don't find what you're looking for, feel free to contact us.
            </p>
            <div className="mt-8 max-w-2xl mx-auto flex">
              <Input 
                placeholder="Search for questions..." 
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white"
              />
              <Button className="ml-2 bg-white text-ifind-teal hover:bg-white/90">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Categories</h2>
                  <ul className="space-y-2">
                    {faqCategories.map((category, index) => (
                      <li key={index}>
                        <a href={`#${category.name.toLowerCase()}`} className="text-ifind-teal hover:underline">
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="md:col-span-3">
                {faqCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} id={category.name.toLowerCase()} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-ifind-teal">{category.name} Questions</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border bg-white rounded-lg shadow-sm">
                          <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
                
                <div className="bg-gray-100 p-8 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                  <p className="mb-4">If you couldn't find the answer to your question, please don't hesitate to reach out to our support team.</p>
                  <Button asChild className="bg-ifind-teal hover:bg-ifind-teal/90">
                    <a href="/contact">Contact Support</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
