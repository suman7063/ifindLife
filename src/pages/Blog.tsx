
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, User } from 'lucide-react';

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Mental Health: A Comprehensive Guide",
      excerpt: "Learn about the fundamentals of mental health and how to maintain emotional well-being in today's fast-paced world.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Mental Health"
    },
    {
      id: 2,
      title: "The Benefits of Mindfulness Meditation",
      excerpt: "Discover how mindfulness meditation can help reduce stress, improve focus, and enhance overall quality of life.",
      author: "Dr. Michael Chen",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Mindfulness"
    },
    {
      id: 3,
      title: "Building Resilience in Difficult Times",
      excerpt: "Practical strategies for developing emotional resilience and coping with life's challenges more effectively.",
      author: "Dr. Emily Davis",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Resilience"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Mental Health Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and expert advice on mental health, wellness, and personal growth.
              </p>
            </div>

            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="bg-ifind-aqua text-white px-2 py-1 rounded text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-2xl hover:text-ifind-aqua transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>By {post.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
