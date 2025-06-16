
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Emotional Intelligence: A Complete Guide",
      slug: "understanding-emotional-intelligence",
      excerpt: "Discover how developing emotional intelligence can transform your relationships, career, and overall well-being through practical strategies and insights.",
      author: "Dr. Sarah Johnson",
      date: "December 1, 2024",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Managing Anxiety and Overthinking: Practical Strategies",
      slug: "managing-anxiety-overthinking",
      excerpt: "Learn evidence-based techniques to break the cycle of anxiety and overthinking for a calmer, more focused mind.",
      author: "Michael Chen",
      date: "November 28, 2024",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Building Resilience: How to Bounce Back from Life's Challenges",
      slug: "building-resilience-challenges",
      excerpt: "Discover the key components of resilience and how to develop this crucial life skill for long-term well-being.",
      author: "Lisa Thompson",
      date: "November 25, 2024",
      category: "Personal Growth",
      image: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=2068&auto=format&fit=crop",
      readTime: "6 min read"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and expert advice to support your mental wellness journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-ifind-aqua transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">
            <Link to="/blog">
              Read More Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
