
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { sampleBlogPosts } from '@/data/blogData';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...Array.from(new Set(sampleBlogPosts.map(post => post.category)))];

  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header Band */}
      <div className="bg-gradient-to-r from-ifind-teal/20 to-ifind-purple/20 text-ifind-charcoal py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mental Health Blog</h1>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Expert insights, practical tips, and evidence-based guidance for your mental health journey.
          </p>
        </div>
      </div>
      
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-6xl mx-auto">

            <div className="mb-8 space-y-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-ifind-aqua text-white'
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-ifind-aqua hover:text-ifind-aqua'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-ifind-aqua text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>{post.date}</span>
                        {post.author && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.author}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-lg leading-tight mb-3 group-hover:text-ifind-aqua transition-colors flex-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No articles found matching your search criteria.
                </p>
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Looking for more personalized guidance? <Link to="/experts" className="text-ifind-aqua hover:underline">Connect with our mental health experts</Link>.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
