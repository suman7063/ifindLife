
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from '../types';

const StatusSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Online Status</label>
    <Select 
      value={expert.online ? "true" : "false"}
      onValueChange={(value) => onChange('online', value === "true")}
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
);

export default StatusSection;
