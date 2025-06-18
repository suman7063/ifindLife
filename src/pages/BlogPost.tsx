
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleBlogPosts } from '@/data/blogData';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const post = sampleBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center text-ifind-aqua hover:text-ifind-teal mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            {/* Hero Image */}
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-ifind-aqua text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="mr-4">{post.date}</span>
                {post.author && (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              <p className="text-xl text-gray-600 leading-relaxed">
                {post.summary}
              </p>
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Call to Action */}
            <div className="mt-12 p-8 bg-gradient-to-r from-ifind-aqua/10 to-ifind-teal/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Need Professional Support?</h3>
              <p className="text-gray-600 mb-6">
                If you're struggling with the topics discussed in this article, our mental health professionals are here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/services">
                  <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white">
                    Explore Our Services
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {sampleBlogPosts
                  .filter(p => p.category === post.category && p.id !== post.id)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-2 hover:text-ifind-aqua transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {relatedPost.summary.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
