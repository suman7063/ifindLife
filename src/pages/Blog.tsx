
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, Search } from 'lucide-react';
import { sampleBlogPosts } from '@/data/blogData';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mental Health', 'Personal Growth', 'Wellness', 'Mindfulness', 'Relationships', 'Lifestyle'];

  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = sampleBlogPosts[0];
  const recentPosts = sampleBlogPosts.slice(1, 4);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mental Health & Wellness Blog</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Expert insights, practical tips, and inspiring stories to support your journey to better mental health
              </p>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
              <Link to={`/blog/${featuredPost.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.imageUrl} 
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center mb-4">
                        <span className="bg-ifind-aqua text-white px-3 py-1 rounded-full text-sm font-medium">
                          {featuredPost.category}
                        </span>
                        <span className="ml-4 text-gray-500 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {featuredPost.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-ifind-aqua transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {featuredPost.summary}
                      </p>
                      {featuredPost.author && (
                        <div className="flex items-center text-gray-500">
                          <User className="h-4 w-4 mr-2" />
                          <span>By {featuredPost.author}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-ifind-aqua hover:bg-ifind-aqua/90" : ""}
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No articles found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">5 min read</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-ifind-aqua transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.summary}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          {post.author && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{post.author}</span>
                            </div>
                          )}
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
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-ifind-aqua/10">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest articles and mental health tips delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSubscription 
                placeholder="Enter your email"
                buttonLabel="Subscribe"
                className="flex gap-2"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
