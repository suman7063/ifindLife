
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { from } from '@/lib/supabase';

// Sample blog data (this would come from your database)
const sampleBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Unlocking the Secrets of Emotional Intelligence",
    slug: "emotional-intelligence",
    imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop",
    category: "Mental Health",
    date: "June 15, 2023",
    content: "Emotional intelligence is the ability to perceive, control, and evaluate emotions – in oneself and others. This comprehensive guide explores how developing emotional intelligence can transform your life, relationships, and career...",
    summary: "Learn how developing emotional intelligence can transform your personal and professional life."
  },
  {
    id: 2,
    title: "Managing Conflicting Random Thoughts",
    slug: "managing-thoughts",
    imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop",
    category: "Self-Improvement",
    date: "July 22, 2023",
    content: "We all experience random, conflicting thoughts that can create confusion and anxiety. This article presents practical strategies to manage these thoughts effectively, bringing mental clarity and peace...",
    summary: "Practical strategies to manage random thoughts and bring mental clarity."
  },
  {
    id: 3,
    title: "Steps to Overcoming Teenage Anger",
    slug: "teenage-anger",
    imageUrl: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=2068&auto=format&fit=crop",
    category: "Parenting",
    date: "August 10, 2023",
    content: "Adolescence often brings heightened emotions, including anger. This guide helps parents and teenagers understand the root causes of teenage anger and provides effective techniques to manage and channel these emotions constructively...",
    summary: "Understanding and managing teenage anger for healthier relationships."
  },
  {
    id: 4,
    title: "The Mind-Body Connection in Mental Health",
    slug: "mind-body-connection",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    category: "Wellness",
    date: "September 5, 2023",
    content: "The mind and body are inextricably linked, with each significantly influencing the other. This article explores how physical health impacts mental wellbeing and vice versa, offering holistic approaches to improve both...",
    summary: "Exploring the powerful connection between physical and mental health."
  },
  {
    id: 5,
    title: "Building Resilience Through Mindfulness",
    slug: "resilience-mindfulness",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2080&auto=format&fit=crop",
    category: "Mental Health",
    date: "October 18, 2023",
    content: "Mindfulness practices can significantly enhance your ability to bounce back from life's challenges. This detailed guide presents evidence-based mindfulness techniques that build resilience and promote psychological flexibility...",
    summary: "Mindfulness techniques to build resilience and overcome challenges."
  },
  {
    id: 6,
    title: "Navigating Relationship Transitions",
    slug: "relationship-transitions",
    imageUrl: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=2070&auto=format&fit=crop",
    category: "Relationships",
    date: "November 12, 2023",
    content: "Relationships naturally evolve over time, passing through various transitions. Whether it's moving in together, getting married, or navigating a period of distance, this article offers guidance on maintaining connection during times of change...",
    summary: "How to maintain healthy relationships during periods of transition and change."
  }
];

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get unique categories from blog posts
  const categories = Array.from(new Set(sampleBlogPosts.map(post => post.category)));
  
  // Filter blog posts based on search term and active category
  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === null || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-ifind-purple/10 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-ifind-charcoal mb-4">
                The iFindLife Blog
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Insights, guidance, and resources to support your mental wellness journey
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pr-10 pl-4 py-3 rounded-lg shadow-sm border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-8 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center flex-wrap gap-2">
              <Button 
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => setActiveCategory(null)}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <div 
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block bg-ifind-purple/10 text-ifind-purple px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.summary}</p>
                    <Button
                      variant="link"
                      className="text-ifind-aqua hover:text-ifind-teal px-0"
                    >
                      Read more →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700">No articles found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
