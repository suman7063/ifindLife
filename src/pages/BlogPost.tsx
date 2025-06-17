
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleBlogPosts } from '@/data/blogData';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    const foundPost = sampleBlogPosts.find(post => post.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      const related = sampleBlogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-12 w-full max-w-3xl mb-6" />
            <Skeleton className="h-6 w-40 mb-12" />
            <Skeleton className="h-80 w-full max-w-3xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full max-w-3xl" />
              <Skeleton className="h-4 w-full max-w-3xl" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fullContent = `
    ${post.content}

    ## Understanding the Core Concepts

    Mental health is a complex topic that requires careful consideration and professional guidance. This article explores the fundamental aspects that can help you on your journey to better well-being.

    ### Key Points to Remember

    1. **Self-awareness is crucial** - Understanding your emotions and triggers is the first step toward positive change.
    2. **Professional support matters** - Don't hesitate to seek help from qualified mental health professionals.
    3. **Consistency in practice** - Small, regular steps often lead to more sustainable improvements than dramatic changes.
    4. **Community support** - Connecting with others who understand your journey can provide invaluable encouragement.

    ## Practical Applications

    The strategies discussed in this article can be applied in various aspects of daily life. Whether you're dealing with work stress, relationship challenges, or personal growth goals, these principles remain relevant.

    ### Building Your Support System

    Creating a strong support network is essential for long-term mental wellness. This includes:

    - Professional therapists or counselors
    - Trusted friends and family members
    - Support groups or communities
    - Mental health resources and tools

    ## Moving Forward

    Remember that mental health is an ongoing journey, not a destination. Be patient with yourself as you implement these strategies and celebrate small victories along the way.

    If you're struggling with mental health challenges, don't hesitate to reach out to our expert team at iFindLife. We're here to support you every step of the way.
  `;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-ifind-teal hover:text-ifind-teal/80">
              <Link to="/blog">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>
          
          <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-96 relative overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-ifind-teal text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{post.title}</h1>
                  <div className="flex items-center text-white/90 text-sm space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    {post.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      5 min read
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">{post.summary}</p>
                
                <div className="whitespace-pre-line text-gray-800 leading-relaxed space-y-6">
                  {fullContent.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('##')) {
                      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('###')) {
                      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.includes('1. **') || paragraph.includes('2. **')) {
                      return (
                        <div key={index} className="space-y-3">
                          {paragraph.split('\n').map((line, lineIndex) => {
                            if (line.trim().match(/^\d+\./)) {
                              return <div key={lineIndex} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-ifind-teal text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                  {line.trim().charAt(0)}
                                </span>
                                <p className="text-gray-700">{line.replace(/^\d+\.\s\*\*(.*?)\*\*\s-\s/, '$1 - ')}</p>
                              </div>;
                            }
                            return null;
                          })}
                        </div>
                      );
                    } else if (paragraph.includes('- ')) {
                      return (
                        <ul key={index} className="space-y-2 ml-6">
                          {paragraph.split('\n').filter(line => line.includes('- ')).map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-ifind-aqua rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-gray-700">{item.replace('- ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{paragraph}</p>;
                    }
                  })}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Mental Health
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Wellness
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
          
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-sm text-gray-500">{relatedPost.date}</span>
                        <h3 className="font-semibold text-gray-900 group-hover:text-ifind-aqua transition-colors mt-1">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
