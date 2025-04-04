
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { Program } from '@/types/programs';
import { ProgramCardProps } from './types';

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  onEdit, 
  onDelete,
  getCategoryColor
}) => {
  // Use provided getCategoryColor function or fall back to default
  const categoryColor = getCategoryColor ? 
    getCategoryColor(program.category) : 
    getDefaultCategoryColor(program.category);

  return (
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
        <Badge className={categoryColor}>
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
  );
};

// Helper function to determine category color
const getDefaultCategoryColor = (category: string) => {
  switch (category) {
    case 'quick-ease':
      return 'bg-green-100 text-green-800';
    case 'resilience-building':
      return 'bg-blue-100 text-blue-800';
    case 'super-human':
      return 'bg-purple-100 text-purple-800';
    case 'issue-based':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default ProgramCard;
