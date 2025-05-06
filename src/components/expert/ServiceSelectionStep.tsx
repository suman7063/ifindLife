
import React from 'react';
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Service {
  id: number;
  name: string;
  description: string;
}

interface ServiceSelectionStepProps {
  services: Service[];
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ services }) => {
  const form = useFormContext();
  
  if (!form) {
    console.error("ServiceSelectionStep must be used within a FormProvider");
    return null;
  }
  
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading available services...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="selectedServices"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Services You Provide</FormLabel>
              <FormDescription>Select all services that you can provide to clients.</FormDescription>
            </div>
            <div className="space-y-2">
              {services.map((service) => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name="selectedServices"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={service.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, service.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== service.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium">
                            {service.name}
                          </FormLabel>
                          <FormDescription>
                            {service.description}
                          </FormDescription>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServiceSelectionStep;
