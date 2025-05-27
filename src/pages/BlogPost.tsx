
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleBlogPosts } from '@/data/blogData';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    // Simulate fetching post data
    setLoading(true);
    
    // Find the post with matching slug
    const foundPost = sampleBlogPosts.find(post => post.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Get related posts from the same category (excluding current post)
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-ifind-purple">
              <Link to="/blog">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>
          
          {/* Article header */}
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
                    <span className="inline-block bg-ifind-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{post.title}</h1>
                  <div className="flex items-center text-white/90 text-sm">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    {post.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Article content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                {/* This would be your rich text content */}
                <p className="lead text-lg text-gray-700">{post.summary}</p>
                <div className="my-8">
                  <p className="mb-4">{post.content}</p>
                  <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <h2 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h2>
                  <ul className="list-disc list-inside mb-4">
                    <li className="mb-2">Understand your emotions and their triggers</li>
                    <li className="mb-2">Practice self-regulation techniques</li>
                    <li className="mb-2">Develop empathy for others' feelings</li>
                    <li className="mb-2">Build stronger relationships through emotional awareness</li>
                  </ul>
                  <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Mental Health
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Wellness
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Self-Improvement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
          
          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
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
                        <h3 className="font-semibold text-gray-900 group-hover:text-ifind-aqua transition-colors">
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
