
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from './types';

const OnlineStatusSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="text-xs font-medium">Online Status</label>
      <Select 
        value={expert.online ? "true" : "false"}
        onValueChange={(value) => updateExpert('online', value === "true")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Online
            </div>
          </SelectItem>
          <SelectItem value="false">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
              Offline
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <label className="text-xs font-medium">Availability</label>
      <Input
        value={expert.availability || ""}
        onChange={(e) => updateExpert('availability', e.target.value)}
        placeholder="e.g. Available, 5 min wait, etc."
      />
    </div>
  </div>
);

export default OnlineStatusSection;
