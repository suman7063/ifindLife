import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Program } from '@/types/programs';

// Fix the ProgramsByCategory type to properly extend Record<string, Program[]>
interface ProgramsByCategory extends Record<string, Program[]> {
  wellness: Program[];
  academic: Program[];
  business: Program[];
  [key: string]: Program[]; // Add index signature to satisfy Record type
}

const Programs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  const programsData: ProgramsByCategory = {
    wellness: [
      {
        id: 1,
        title: 'Mindfulness Meditation',
        description: 'A program to help you practice mindfulness and reduce stress.',
        programType: 'wellness',
        category: 'Meditation',
        duration: '4 weeks',
        sessions: 12,
        price: 49.99,
        image: 'https://source.unsplash.com/400x300/?meditation',
        enrollments: 50
      },
      {
        id: 2,
        title: 'Stress Management Workshop',
        description: 'Learn effective strategies for managing stress in your daily life.',
        programType: 'wellness',
        category: 'Stress Reduction',
        duration: '2 days',
        sessions: 6,
        price: 99.00,
        image: 'https://source.unsplash.com/400x300/?stress',
        enrollments: 30
      },
    ],
    academic: [
      {
        id: 3,
        title: 'Study Skills Seminar',
        description: 'Improve your study habits and academic performance.',
        programType: 'academic',
        category: 'Study Skills',
        duration: '3 weeks',
        sessions: 9,
        price: 79.50,
        image: 'https://source.unsplash.com/400x300/?study',
        enrollments: 40
      },
      {
        id: 4,
        title: 'Time Management for Students',
        description: 'Learn how to effectively manage your time as a student.',
        programType: 'academic',
        category: 'Time Management',
        duration: '1 week',
        sessions: 3,
        price: 29.99,
        image: 'https://source.unsplash.com/400x300/?time',
        enrollments: 25
      },
    ],
    business: [
      {
        id: 5,
        title: 'Leadership Development Program',
        description: 'Develop your leadership skills and advance your career.',
        programType: 'business',
        category: 'Leadership',
        duration: '6 weeks',
        sessions: 18,
        price: 149.00,
        image: 'https://source.unsplash.com/400x300/?leadership',
        enrollments: 60
      },
      {
        id: 6,
        title: 'Team Building Workshop',
        description: 'Enhance teamwork and collaboration in your organization.',
        programType: 'business',
        category: 'Team Building',
        duration: '2 days',
        sessions: 6,
        price: 129.50,
        image: 'https://source.unsplash.com/400x300/?team',
        enrollments: 35
      },
    ],
  };

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    let filteredPrograms = Object.values(programsData).flat();

    if (activeTab !== 'all') {
      filteredPrograms = filteredPrograms.filter(program => program.programType === activeTab);
    }

    if (searchQuery) {
      filteredPrograms = filteredPrograms.filter(program =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredPrograms = filteredPrograms.filter(program => program.category === selectedCategory);
    }

    setPrograms(filteredPrograms);
  }, [activeTab, searchQuery, selectedCategory]);

  const handleOpenDialog = (program: Program | null = null) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
  };

  const handleSaveProgram = (programData: Program) => {
    // Implement save logic here (e.g., update state, API call)
    console.log('Saving program:', programData);
    handleCloseDialog();
  };

  const handleDeleteProgram = (programId: number) => {
    // Implement delete logic here (e.g., update state, API call)
    console.log('Deleting program with ID:', programId);
  };

  const categories = [...new Set(Object.values(programsData).flat().map(program => program.category))];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Mental Wellness Programs</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <Label htmlFor="search" className="mr-2">Search:</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="category" className="mr-2">Category:</Label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <Button active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All</Button>
        <Button active={activeTab === 'wellness'} onClick={() => setActiveTab('wellness')}>Wellness</Button>
        <Button active={activeTab === 'academic'} onClick={() => setActiveTab('academic')}>Academic</Button>
        <Button active={activeTab === 'business'} onClick={() => setActiveTab('business')}>Business</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map(program => (
          <div key={program.id} className="border rounded p-4">
            <img src={program.image} alt={program.title} className="w-full h-48 object-cover mb-2 rounded" />
            <h2 className="text-lg font-semibold">{program.title}</h2>
            <p className="text-gray-600">{program.description}</p>
            <div className="mt-2">
              <span className="text-sm">Category: {program.category}</span>
              <span className="text-sm ml-2">Duration: {program.duration}</span>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => handleOpenDialog(program)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteProgram(program.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Program</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedProgram ? 'Edit Program' : 'Add Program'}</DialogTitle>
            <DialogDescription>
              {selectedProgram ? 'Update program details.' : 'Create a new program.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={selectedProgram?.title || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" value={selectedProgram?.description || ''} className="col-span-3" />
            </div>
          </div>
          <Button onClick={() => handleSaveProgram({
            id: 7,
            title: 'test',
            description: 'test',
            programType: 'wellness',
            category: 'test',
            duration: 'test',
            sessions: 1,
            price: 1,
            image: 'test',
            enrollments: 1
          })}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Programs;
