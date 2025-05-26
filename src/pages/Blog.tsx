import React, { useState } from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { sampleBlogPosts } from '@/data/blogData';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories from blog posts
  const categories = ['All', ...Array.from(new Set(sampleBlogPosts.map(post => post.category)))];

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === 'All' 
    ? sampleBlogPosts 
    : sampleBlogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Mental Health Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and expert advice on mental health, wellness, and personal growth.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
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

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm mb-1">{post.date}</p>
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.summary}
                    </p>
                    {post.author && (
                      <p className="text-xs text-gray-500">
                        By {post.author}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No blog posts found for the selected category.
                </p>
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-gray-600">
                More blog posts coming soon. Stay tuned for expert insights and mental health tips.
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
