
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, MoveVertical } from 'lucide-react';

// FAQ Types
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: number;
  title: string;
  faqs: FAQ[];
}

const FAQEditor = () => {
  // Initial sample data - in a real app, this would be fetched from a database
  const initialFAQs: FAQCategory[] = [
    {
      id: 1,
      title: 'General Questions',
      faqs: [
        {
          id: 'faq-1',
          question: 'What is iFindLife?',
          answer: 'iFindLife is a mental wellness platform that connects individuals with verified mental health experts for personalized guidance about emotional well-being, relationships, and personal growth.'
        },
        {
          id: 'faq-2',
          question: 'How does iFindLife work?',
          answer: 'iFindLife works by connecting you with qualified mental health professionals through our secure platform. After creating an account, you can browse through our expert profiles, book appointments, access mental wellness resources, or take assessments.'
        }
      ]
    },
    {
      id: 2,
      title: 'Programs & Services',
      faqs: [
        {
          id: 'faq-3',
          question: 'What types of mental health services do you offer?',
          answer: 'We offer a wide range of mental health services, including one-on-one therapy sessions, group therapy, wellness workshops, self-help resources, mental health assessments, and specialized programs for academic institutions and businesses.'
        }
      ]
    }
  ];

  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>(initialFAQs);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newFAQ, setNewFAQ] = useState<Omit<FAQ, 'id'>>({ question: '', answer: '' });
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);

  // Load FAQs from localStorage if available
  useEffect(() => {
    const savedFAQs = localStorage.getItem('ifindlife-faqs');
    if (savedFAQs) {
      try {
        setFaqCategories(JSON.parse(savedFAQs));
      } catch (error) {
        console.error('Error parsing saved FAQs:', error);
      }
    }
  }, []);

  // Save FAQs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ifindlife-faqs', JSON.stringify(faqCategories));
  }, [faqCategories]);

  // Handle category operations
  const handleAddCategory = () => {
    if (!newCategoryTitle.trim()) {
      toast.error('Category title cannot be empty');
      return;
    }

    const newCategory: FAQCategory = {
      id: Math.max(0, ...faqCategories.map(cat => cat.id)) + 1,
      title: newCategoryTitle,
      faqs: []
    };

    setFaqCategories([...faqCategories, newCategory]);
    setNewCategoryTitle('');
    setIsAddingCategory(false);
    toast.success('Category added successfully');
  };

  const handleEditCategory = (categoryId: number, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error('Category title cannot be empty');
      return;
    }

    setFaqCategories(faqCategories.map(category => 
      category.id === categoryId ? { ...category, title: newTitle } : category
    ));
    setEditingCategoryId(null);
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category? All FAQs in this category will be deleted.')) {
      setFaqCategories(faqCategories.filter(category => category.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  // Handle FAQ operations
  const handleAddFAQ = () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      toast.error('Question and answer cannot be empty');
      return;
    }

    const categoryId = parseInt(selectedCategory);
    const newFaqItem: FAQ = {
      id: `faq-${Date.now()}`,
      question: newFAQ.question,
      answer: newFAQ.answer
    };

    setFaqCategories(faqCategories.map(category => 
      category.id === categoryId 
        ? { ...category, faqs: [...category.faqs, newFaqItem] } 
        : category
    ));

    setNewFAQ({ question: '', answer: '' });
    setIsAddingFAQ(false);
    toast.success('FAQ added successfully');
  };

  const handleEditFAQ = () => {
    if (!editingFAQ) return;
    
    if (!editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      toast.error('Question and answer cannot be empty');
      return;
    }

    setFaqCategories(faqCategories.map(category => ({
      ...category,
      faqs: category.faqs.map(faq => 
        faq.id === editingFAQ.id ? editingFAQ : faq
      )
    })));

    setEditingFAQ(null);
    toast.success('FAQ updated successfully');
  };

  const handleDeleteFAQ = (faqId: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqCategories(faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => faq.id !== faqId)
      })));
      toast.success('FAQ deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage FAQs</h2>
        <div className="flex gap-2">
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New FAQ Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your FAQs.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="category-title" className="text-sm font-medium">
                    Category Title
                  </label>
                  <Input
                    id="category-title"
                    placeholder="e.g., Account & Billing"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingFAQ} onOpenChange={setIsAddingFAQ}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>
                  Add a new question and answer to help your users.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {faqCategories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input
                    placeholder="e.g., How do I reset my password?"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea
                    placeholder="Provide a clear and helpful answer..."
                    className="min-h-[100px]"
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingFAQ(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFAQ}>
                  Add FAQ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {faqCategories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <p className="text-gray-500 mb-4">No FAQ categories yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingCategory(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          faqCategories.map(category => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  {editingCategoryId === category.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={category.title}
                        onChange={(e) => {
                          setFaqCategories(faqCategories.map(c => 
                            c.id === category.id ? { ...c, title: e.target.value } : c
                          ));
                        }}
                        autoFocus
                      />
                      <Button 
                        onClick={() => handleEditCategory(category.id, category.title)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingCategoryId(null)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <CardTitle>{category.title}</CardTitle>
                  )}
                  {editingCategoryId !== category.id && (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingCategoryId(category.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {category.faqs.length} {category.faqs.length === 1 ? 'question' : 'questions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {category.faqs.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No FAQs in this category yet
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map(faq => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span>{faq.question}</span>
                            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingFAQ(faq)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFAQ(faq.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory(category.id.toString());
                    setIsAddingFAQ(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add FAQ to this category
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Edit FAQ Dialog */}
      <Dialog
        open={!!editingFAQ}
        onOpenChange={(open) => !open && setEditingFAQ(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the question and answer.
            </DialogDescription>
          </DialogHeader>
          {editingFAQ && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={editingFAQ.question}
                  onChange={(e) => setEditingFAQ({...editingFAQ, question: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  className="min-h-[100px]"
                  value={editingFAQ.answer}
                  onChange={(e) => setEditingFAQ({...editingFAQ, answer: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFAQ(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditFAQ}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQEditor;
