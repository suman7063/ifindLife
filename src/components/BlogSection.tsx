
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sampleBlogPosts } from '@/data/blogData';

const BlogSection = () => {
  // Get the first 3 blog posts for the homepage
  const featuredPosts = sampleBlogPosts.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">From The Blog</h2>
          <Button variant="ghost" asChild className="text-ifind-aqua">
            <Link to="/blog" className="flex items-center">
              View all posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
              <div className="overflow-hidden rounded-lg shadow-sm">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-ifind-aqua transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
