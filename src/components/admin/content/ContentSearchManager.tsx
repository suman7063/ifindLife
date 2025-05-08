
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, RefreshCw, Calendar, User, FileText, MessageSquare } from 'lucide-react';

type ContentType = 'blog' | 'program' | 'service' | 'expert' | 'testimonial';

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author?: string;
  date: string;
  status: 'published' | 'draft' | 'archived';
}

const ContentSearchManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const mockContent: ContentItem[] = [
    { id: '1', title: 'Understanding Anxiety', type: 'blog', author: 'Dr. Smith', date: '2025-03-15', status: 'published' },
    { id: '2', title: 'Mindfulness Program', type: 'program', date: '2025-04-01', status: 'published' },
    { id: '3', title: 'Therapy Sessions', type: 'service', date: '2025-02-20', status: 'published' },
    { id: '4', title: 'Dr. Johnson Profile', type: 'expert', date: '2025-01-10', status: 'published' },
    { id: '5', title: 'Client Success Story', type: 'testimonial', author: 'Jane Doe', date: '2025-05-01', status: 'published' },
    { id: '6', title: 'Stress Management', type: 'blog', author: 'Dr. Wilson', date: '2025-04-22', status: 'draft' },
    { id: '7', title: 'Group Therapy', type: 'service', date: '2025-03-30', status: 'archived' },
  ];

  // Filter content based on search query and active tab
  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const refreshContent = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'blog': return <FileText size={16} />;
      case 'program': return <Calendar size={16} />;
      case 'service': return <MessageSquare size={16} />;
      case 'expert': return <User size={16} />;
      case 'testimonial': return <MessageSquare size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Search</h2>
        <Button onClick={refreshContent} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="button" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button type="submit" disabled={isLoading}>
          Search
        </Button>
      </form>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType | 'all')}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="blog">Blogs</TabsTrigger>
          <TabsTrigger value="program">Programs</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
          <TabsTrigger value="expert">Experts</TabsTrigger>
          <TabsTrigger value="testimonial">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Content' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredContent.length > 0 ? (
                <div className="space-y-4">
                  {filteredContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {getContentIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>{item.type}</span>
                            {item.author && <span>• By {item.author}</span>}
                            <span>• {item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No content found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentSearchManager;
