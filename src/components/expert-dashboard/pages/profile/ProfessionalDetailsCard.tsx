
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Save, X, Loader2 } from 'lucide-react';

interface ProfessionalDetailsCardProps {
  formData: {
    specialization: string;
    experience_years: number;
    hourly_rate: number;
  };
  isEditing: boolean;
  onFormDataChange: (updater: (prev: any) => any) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProfessionalDetailsCard: React.FC<ProfessionalDetailsCardProps> = ({
  formData,
  isEditing,
  onFormDataChange,
  onSave,
  onCancel,
  isSaving = false
}) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Professional Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, specialization: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
              placeholder="e.g., Anxiety, Depression, Couples Therapy"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience_years">Years of Experience</Label>
            <Input
              id="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={onSave} 
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalDetailsCard;
