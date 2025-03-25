
import React from 'react';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const blogPosts = [
    {
      title: "Unlocking the Secrets of Emotional Intelligence",
      imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop",
      category: "Mental Health",
      date: "June 15, 2023",
      href: "/blog/emotional-intelligence"
    },
    {
      title: "Managing Conflicting Random Thoughts",
      imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop",
      category: "Self-Improvement",
      date: "July 22, 2023",
      href: "/blog/managing-thoughts"
    },
    {
      title: "Steps to Overcoming Teenage Anger",
      // Updating to a more reliable image URL
      imageUrl: "https://images.unsplash.com/photo-1581271940096-99d6d544eb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      category: "Parenting",
      date: "August 10, 2023",
      href: "/blog/teenage-anger"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-8">From The Blog</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Link key={index} to={post.href} className="block group">
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
