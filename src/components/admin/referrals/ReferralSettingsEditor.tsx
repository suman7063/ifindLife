
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReferralSettings } from "@/hooks/useReferralSettings";
import { Label } from "@/components/ui/label";
import ReferralRewardsForm from './ReferralRewardsForm';
import ReferralDescriptionField from './ReferralDescriptionField';
import LoadingState from './LoadingState';
import { safeSingleRecord } from '@/utils/supabaseUtils';

const ReferralSettingsEditor: React.FC = () => {
  const { 
    settings, 
    isLoading, 
    isSaving, 
    errors, 
    updateSetting, 
    saveSettings 
  } = useReferralSettings();
  
  // Handle text area change specifically
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSetting('description', e.target.value);
  };

  if (isLoading) {
    return (
      <Card>
        <LoadingState />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program Settings</CardTitle>
        <CardDescription>
          Configure rewards for your referral program. These settings determine how many credits
          users receive when participating in the referral program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReferralRewardsForm 
          settings={settings}
          errors={errors}
          onSettingChange={updateSetting}
        />
        
        <div className="mt-6">
          <ReferralDescriptionField 
            description={settings.description || ''}
            error={errors.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralSettingsEditor;
