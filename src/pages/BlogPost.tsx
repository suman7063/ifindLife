
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { sampleBlogPosts } from '@/data/blogData';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const post = sampleBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related posts (excluding current post)
  const relatedPosts = sampleBlogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-20">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          ></div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-ifind-aqua text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center space-x-6 text-white/80">
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>By {post.author}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.summary}
                </p>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="bg-ifind-aqua/10 text-ifind-aqua px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Mental Health
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Wellness
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                      <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="p-6">
                          <span className="bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded-full text-xs font-medium mb-3 inline-block">
                            {relatedPost.category}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-ifind-aqua transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {relatedPost.summary}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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

export default BlogPost;
