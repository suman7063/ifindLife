
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { sampleBlogPosts } from '@/data/blogData';
import BlogPostDialog from './BlogPostDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const BlogEditor = () => {
  const [posts, setPosts] = useState<BlogPost[]>(sampleBlogPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleAddNewPost = () => {
    setCurrentPost(null);
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDialogOpen(true);
  };

  const handleViewPost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      window.open(`/blog/${post.slug}`, '_blank');
    }
  };

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      toast.success("Blog post deleted successfully");
      setDeleteConfirmOpen(false);
    }
  };

  const handleSavePost = (post: BlogPost) => {
    if (currentPost) {
      // Edit existing post
      setPosts(posts.map(p => p.id === post.id ? post : p));
      toast.success("Blog post updated successfully");
    } else {
      // Add new post with the next available ID
      const nextId = Math.max(...posts.map(p => p.id)) + 1;
      setPosts([...posts, { ...post, id: nextId }]);
      toast.success("New blog post created successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={handleAddNewPost}>
          <Plus className="h-4 w-4 mr-2" /> Add New Post
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.id}</TableCell>
                <TableCell className="max-w-xs truncate">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleViewPost(post.id)}
                      title="View post"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditPost(post)}
                      title="Edit post"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteClick(post.id)}
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No blog posts found. Click "Add New Post" to create your first blog post.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Post Dialog */}
      <BlogPostDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        post={currentPost} 
        onSave={handleSavePost}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Are you sure you want to delete this blog post? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogEditor;
