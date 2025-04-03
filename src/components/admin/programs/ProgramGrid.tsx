
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { Program } from '@/types/programs';

type ProgramGridProps = {
  programs: Program[];
  isLoading: boolean;
  onEdit: (program: Program) => void;
  onDelete: (programId: number) => void;
  getCategoryColor: (category: string) => string;
};

const ProgramGrid: React.FC<ProgramGridProps> = ({ 
  programs, 
  isLoading, 
  onEdit, 
  onDelete,
  getCategoryColor 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded mb-2" />
              <div className="flex gap-2 mt-3">
                <div className="h-5 bg-gray-200 rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md">
        <p className="text-muted-foreground mb-4">No programs found for this category</p>
        <Button onClick={() => onEdit()} variant="outline">Add Your First Program</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <Card key={program.id} className="overflow-hidden">
          <div 
            className="h-40 bg-cover bg-center" 
            style={{backgroundImage: `url(${program.image || 'https://source.unsplash.com/random/800x600/?wellness'})`}}
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{program.title}</CardTitle>
            </div>
            <CardDescription>₹{program.price} • {program.duration}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm line-clamp-3 mb-3">{program.description}</p>
            <Badge className={getCategoryColor(program.category)}>
              {program.category}
            </Badge>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(program)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(program.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProgramGrid;
