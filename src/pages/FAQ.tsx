
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PageHeaderWithBand from '@/components/common/PageHeaderWithBand';

// Initial FAQ data - in a real application, this would come from your database
const faqCategories = [
  {
    id: 1,
    title: 'General Questions',
    faqs: [
      {
        id: 'faq-1',
        question: 'What is iFindLife?',
        answer: 'iFindLife is a mental wellness platform that connects individuals with verified mental health experts for personalized guidance about emotional well-being, relationships, and personal growth. We provide accessible mental health resources, professional support, and community connection.'
      },
      {
        id: 'faq-2',
        question: 'How does iFindLife work?',
        answer: 'iFindLife works by connecting you with qualified mental health professionals through our secure platform. After creating an account, you can browse through our expert profiles, book appointments, access mental wellness resources, or take assessments. Our platform supports various communication methods including video calls, voice calls, and messaging.'
      },
      {
        id: 'faq-3',
        question: 'Is iFindLife available internationally?',
        answer: 'Yes, iFindLife services are available globally. Our platform hosts experts from various countries, allowing us to provide mental health support across different time zones and cultures. However, the availability of certain experts may vary based on their location and schedule.'
      }
    ]
  },
  {
    id: 2,
    title: 'Programs & Services',
    faqs: [
      {
        id: 'faq-4',
        question: 'What types of mental health services do you offer?',
        answer: 'We offer a wide range of mental health services, including one-on-one therapy sessions, group therapy, wellness workshops, self-help resources, mental health assessments, and specialized programs for academic institutions and businesses. Our services cover areas such as anxiety, depression, stress management, relationship counseling, career guidance, and more.'
      },
      {
        id: 'faq-5',
        question: 'How do I enroll in a program?',
        answer: 'To enroll in a program, navigate to the Programs section of our website, browse through the available options, and select the one that interests you. Click on "Enroll Now" or "Learn More" for detailed information. Follow the prompts to complete your enrollment, which may include creating an account, providing necessary information, and completing the payment process.'
      },
      {
        id: 'faq-6',
        question: 'Are your programs evidence-based?',
        answer: 'Yes, all our programs are developed based on scientific research and evidence-based practices in mental health. We regularly update our content to incorporate the latest findings and methodologies in the field. Our team of experts ensures that all resources and interventions meet high standards of efficacy and quality.'
      }
    ]
  },
  {
    id: 3,
    title: 'Expert Consultations',
    faqs: [
      {
        id: 'faq-7',
        question: 'How are experts vetted?',
        answer: 'Our experts undergo a rigorous vetting process that includes verification of professional credentials, licensing, and experience. We conduct background checks, review their education and training, and assess their expertise in specific mental health areas. We also collect and monitor client feedback to ensure continuous quality of service.'
      },
      {
        id: 'faq-8',
        question: 'How do I choose the right expert for me?',
        answer: 'To find the right expert, consider your specific needs, preferences, and the expert\'s specialization. Browse through expert profiles, which include information about their education, experience, approach, and specialties. You can filter experts based on various criteria, read client reviews, and even schedule a brief introductory call to determine if they\'re the right fit for you.'
      },
      {
        id: 'faq-9',
        question: 'What happens during a consultation?',
        answer: 'During a consultation, you'll have a private conversation with your chosen expert where you can discuss your concerns, ask questions, and receive professional guidance. The expert may ask about your background, current situation, and goals for the session. They'll provide insights, strategies, and sometimes resources to help address your concerns. The format can be via video call, voice call, or messaging, depending on your preference.'
      }
    ]
  },
  {
    id: 4,
    title: 'Account & Payments',
    faqs: [
      {
        id: 'faq-10',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Sign Up" or "Register" button on our website. Fill in the required information, including your name, email address, and password. You'll receive a verification email to confirm your account. Once verified, you can complete your profile by adding additional information and preferences.'
      },
      {
        id: 'faq-11',
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods, including credit/debit cards, digital wallets like PayPal and Google Pay, and in some regions, bank transfers. All payments are processed securely through our integrated payment gateways, ensuring the safety and privacy of your financial information.'
      },
      {
        id: 'faq-12',
        question: 'Is my payment information secure?',
        answer: 'Yes, your payment information is secure. We use industry-standard encryption and secure payment processors to protect your financial data. We don\'t store complete credit card information on our servers. All transactions are processed through PCI-compliant payment gateways that meet strict security standards.'
      }
    ]
  },
  {
    id: 5,
    title: 'Privacy & Security',
    faqs: [
      {
        id: 'faq-13',
        question: 'How is my personal information protected?',
        answer: 'Your personal information is protected through various security measures, including encryption, secure data storage, and strict access controls. We follow data protection regulations and industry best practices. Our privacy policy details how we collect, use, and protect your information, and we only share your data with your explicit consent or as required by law.'
      },
      {
        id: 'faq-14',
        question: 'Are my sessions confidential?',
        answer: 'Yes, all sessions are confidential. Our platform uses end-to-end encryption for communications, and our experts are bound by professional ethics and confidentiality agreements. Information shared during sessions remains private, with exceptions only in cases where there is a risk of harm to yourself or others, as required by law.'
      },
      {
        id: 'faq-15',
        question: 'Can I delete my account and data?',
        answer: 'Yes, you can delete your account and request the deletion of your data through your account settings or by contacting our support team. We will process your request in accordance with applicable data protection laws, which may require us to retain certain information for legal or administrative purposes for a specified period.'
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Filter FAQs based on search query
  const filteredFAQs = faqCategories.map(category => {
    const filteredCategoryFAQs = category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      ...category,
      faqs: filteredCategoryFAQs
    };
  }).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHeaderWithBand 
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about iFindLife"
      >
        {/* Search input */}
        <div className="max-w-md mx-auto mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for questions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeaderWithBand>
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Category sidebar for desktop */}
            <div className="hidden md:block">
              <div className="sticky top-24 space-y-2">
                <h3 className="font-medium text-lg mb-4">Categories</h3>
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      category.id === activeCategory 
                        ? 'bg-ifind-teal text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
            
            {/* FAQ accordion */}
            <div className="md:col-span-3">
              {(searchQuery ? filteredFAQs : faqCategories)
                .filter(category => activeCategory === null || category.id === activeCategory)
                .map(category => (
                  <div key={category.id} className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.faqs.map(faq => (
                        <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 py-4 bg-gray-50">
                            <p className="text-gray-700">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              
              {/* Show message if no results found */}
              {searchQuery && filteredFAQs.length === 0 && (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium">No results found</h3>
                  <p className="text-gray-600 mt-2">Try a different search term or browse by category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
