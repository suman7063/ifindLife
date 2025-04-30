
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReferralSettings } from "@/types/supabase";

interface ReferralDescriptionFieldProps {
  description: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReferralDescriptionField: React.FC<ReferralDescriptionFieldProps> = ({
  description,
  error,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Program Description</Label>
      <Textarea
        id="description"
        name="description"
        value={description || ''}
        onChange={onChange}
        placeholder="Describe your referral program"
        rows={3}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
      <p className="text-sm text-muted-foreground">
        This description will be shown to users on the referral page
      </p>
    </div>
  );
};

export default ReferralDescriptionField;
