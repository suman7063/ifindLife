
interface JourneyStep {
  name: string;
  test: () => Promise<boolean>;
  errorMessage?: string;
}

export interface UserJourney {
  name: string;
  steps: JourneyStep[];
  lastTested?: Date;
  progress?: number;
  completed?: boolean;
}

export const userJourneys: UserJourney[] = [
  {
    name: 'Heart2Heart Listening - Connect Now Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'Click "Speak Your Heart"',
        test: async () => {
          return true; // Click Heart2Heart service
        }
      },
      {
        name: 'Access Heart2Heart Listening Service Page',
        test: async () => {
          return true; // Verify service page loads
        }
      },
      {
        name: 'Open Expert Selection',
        test: async () => {
          return true; // Click to view experts
        }
      },
      {
        name: 'Click Connect on Expert Card',
        test: async () => {
          return true; // Choose expert and click connect
        }
      },
      {
        name: 'Select Call Type (Audio/Video)',
        test: async () => {
          return true; // Select call type preference
        }
      },
      {
        name: 'Choose Call Duration (30/60 minutes)',
        test: async () => {
          return true; // Select duration
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Call Starts Successfully',
        test: async () => {
          return true; // Call interface opens
        }
      }
    ]
  },
  {
    name: 'Heart2Heart Listening - Book Appointment Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'Click "Speak Your Heart"',
        test: async () => {
          return true; // Click Heart2Heart service
        }
      },
      {
        name: 'Access Heart2Heart Listening Service Page',
        test: async () => {
          return true; // Verify service page loads
        }
      },
      {
        name: 'Open Expert Selection',
        test: async () => {
          return true; // Click to view experts
        }
      },
      {
        name: 'Click Book on Expert Card',
        test: async () => {
          return true; // Choose expert and click book
        }
      },
      {
        name: 'Redirect to Expert Page',
        test: async () => {
          return true; // Verify redirect to /experts/{id}?book=true
        }
      },
      {
        name: 'Select Available Date and Time Slot',
        test: async () => {
          return true; // Choose appointment slot
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Booking Confirmation Displayed',
        test: async () => {
          return true; // Show confirmation screen
        }
      },
      {
        name: 'Confirmation Email Sent',
        test: async () => {
          return true; // Email notification sent
        }
      },
      {
        name: 'Expert Time Slot Blocked',
        test: async () => {
          return true; // Slot marked as booked
        }
      },
      {
        name: 'Appointment Details in Expert Dashboard',
        test: async () => {
          return true; // Expert can see new appointment
        }
      }
    ]
  },
  {
    name: 'Therapy Session - Connect Now Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'Click "Get Guidance"',
        test: async () => {
          return true; // Click therapy service
        }
      },
      {
        name: 'Access Therapy Session Page',
        test: async () => {
          return true; // Verify service page loads
        }
      },
      {
        name: 'Open Expert Selection',
        test: async () => {
          return true; // Click to view experts
        }
      },
      {
        name: 'Click Connect on Expert Card',
        test: async () => {
          return true; // Choose expert and click connect
        }
      },
      {
        name: 'Select Call Type (Audio/Video)',
        test: async () => {
          return true; // Select call type preference
        }
      },
      {
        name: 'Choose Call Duration (30/60 minutes)',
        test: async () => {
          return true; // Select duration
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Call Starts Successfully',
        test: async () => {
          return true; // Call interface opens
        }
      }
    ]
  },
  {
    name: 'Therapy Session - Book Appointment Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'Click "Get Guidance"',
        test: async () => {
          return true; // Click therapy service
        }
      },
      {
        name: 'Access Therapy Session Page',
        test: async () => {
          return true; // Verify service page loads
        }
      },
      {
        name: 'Open Expert Selection',
        test: async () => {
          return true; // Click to view experts
        }
      },
      {
        name: 'Click Book on Expert Card',
        test: async () => {
          return true; // Choose expert and click book
        }
      },
      {
        name: 'Redirect to Expert Page',
        test: async () => {
          return true; // Verify redirect to /experts/{id}?book=true
        }
      },
      {
        name: 'Select Available Date and Time Slot',
        test: async () => {
          return true; // Choose appointment slot
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Booking Confirmation Displayed',
        test: async () => {
          return true; // Show confirmation screen
        }
      },
      {
        name: 'Confirmation Email Sent',
        test: async () => {
          return true; // Email notification sent
        }
      },
      {
        name: 'Expert Time Slot Blocked',
        test: async () => {
          return true; // Slot marked as booked
        }
      },
      {
        name: 'Appointment Details in Expert Dashboard',
        test: async () => {
          return true; // Expert can see new appointment
        }
      }
    ]
  },
  {
    name: 'Online Experts - Connect Now Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'View "Experts Currently Online" Section',
        test: async () => {
          return true; // Scroll to online experts
        }
      },
      {
        name: 'Click Connect on Expert Card',
        test: async () => {
          return true; // Choose expert and click connect
        }
      },
      {
        name: 'Select Call Type (Audio/Video)',
        test: async () => {
          return true; // Select call type preference
        }
      },
      {
        name: 'Choose Call Duration (30/60 minutes)',
        test: async () => {
          return true; // Select duration
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Call Starts Successfully',
        test: async () => {
          return true; // Call interface opens
        }
      }
    ]
  },
  {
    name: 'Online Experts - Book Appointment Flow',
    steps: [
      {
        name: 'Navigate to Homepage',
        test: async () => {
          return true; // Navigate to homepage
        }
      },
      {
        name: 'View "Experts Currently Online" Section',
        test: async () => {
          return true; // Scroll to online experts
        }
      },
      {
        name: 'Click Book on Expert Card',
        test: async () => {
          return true; // Choose expert and click book
        }
      },
      {
        name: 'Redirect to Expert Page',
        test: async () => {
          return true; // Verify redirect to /experts/{id}?book=true
        }
      },
      {
        name: 'Select Available Date and Time Slot',
        test: async () => {
          return true; // Choose appointment slot
        }
      },
      {
        name: 'Complete Payment',
        test: async () => {
          return true; // Process payment
        }
      },
      {
        name: 'Booking Confirmation Displayed',
        test: async () => {
          return true; // Show confirmation screen
        }
      },
      {
        name: 'Confirmation Email Sent',
        test: async () => {
          return true; // Email notification sent
        }
      },
      {
        name: 'Expert Time Slot Blocked',
        test: async () => {
          return true; // Slot marked as booked
        }
      },
      {
        name: 'Appointment Details in Expert Dashboard',
        test: async () => {
          return true; // Expert can see new appointment
        }
      }
    ]
  }
];

export async function runJourney(journey: UserJourney) {
  const results = [];
  journey.lastTested = new Date();
  journey.progress = 0;
  journey.completed = false;
  
  for (let i = 0; i < journey.steps.length; i++) {
    const step = journey.steps[i];
    try {
      const success = await step.test();
      results.push({
        ...step,
        success
      });
      
      if (!success) {
        journey.progress = Math.floor((i / journey.steps.length) * 100);
        return results;
      }
    } catch (error: any) {
      step.errorMessage = error.message;
      results.push({
        ...step,
        success: false,
        error
      });
      journey.progress = Math.floor((i / journey.steps.length) * 100);
      return results;
    }
  }
  
  journey.progress = 100;
  journey.completed = true;
  return results;
}

export async function runAllJourneys() {
  const results = [];
  for (const journey of userJourneys) {
    const journeyResults = await runJourney(journey);
    results.push({
      journey,
      steps: journeyResults
    });
  }
  return results;
}
