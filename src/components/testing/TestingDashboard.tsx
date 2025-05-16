
import React, { useEffect, useState } from 'react';
import { functionTests, runAllTests } from '@/utils/testing/functionRegistry';
import { userJourneys, runAllJourneys } from '@/utils/testing/userJourneys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const TestingDashboard: React.FC = () => {
  const [funcResults, setFuncResults] = useState<any[]>([]);
  const [journeyResults, setJourneyResults] = useState<any[]>([]);
  const [isRunningFuncs, setIsRunningFuncs] = useState(false);
  const [isRunningJourneys, setIsRunningJourneys] = useState(false);
  const [activeTab, setActiveTab] = useState('functions');
  
  const runFunctionTests = async () => {
    setIsRunningFuncs(true);
    try {
      const testResults = await runAllTests();
      setFuncResults(testResults);
    } catch (error) {
      console.error('Error running function tests:', error);
    } finally {
      setIsRunningFuncs(false);
    }
  };
  
  const runUserJourneys = async () => {
    setIsRunningJourneys(true);
    try {
      const results = await runAllJourneys();
      setJourneyResults(results);
    } catch (error) {
      console.error('Error running user journeys:', error);
    } finally {
      setIsRunningJourneys(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Application Testing Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="functions">Function Tests</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="functions">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Function Tests</CardTitle>
              <CardDescription>
                Run tests for individual functions to verify they're working correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runFunctionTests}
                disabled={isRunningFuncs}
                className="mb-4"
              >
                {isRunningFuncs ? 'Running Tests...' : 'Run All Function Tests'}
              </Button>
              
              <div className="space-y-4">
                {funcResults.map((result, i) => (
                  <div 
                    key={i} 
                    className={`p-4 border rounded ${
                      result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <h3 className="font-medium">{result.name}</h3>
                    <p className="text-sm text-gray-600">{result.path}</p>
                    <div className="mt-2 flex items-center">
                      <Badge className={result.success ? 'bg-green-500' : 'bg-red-500'}>
                        {result.success ? 'Working' : 'Failed'}
                      </Badge>
                      {result.lastTested && (
                        <span className="text-xs text-gray-500 ml-2">
                          Tested: {result.lastTested.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {result.errorMessage && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{result.errorMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
                
                {funcResults.length === 0 && !isRunningFuncs && (
                  <p className="text-gray-500 text-center py-4">
                    No tests have been run yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journeys">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Tests</CardTitle>
              <CardDescription>
                Test complete user flows from start to finish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runUserJourneys}
                disabled={isRunningJourneys}
                className="mb-4"
              >
                {isRunningJourneys ? 'Running Journeys...' : 'Run All User Journeys'}
              </Button>
              
              <div className="space-y-6">
                {journeyResults.map((result, i) => (
                  <div 
                    key={i} 
                    className="border rounded p-4"
                  >
                    <h3 className="font-medium text-lg mb-2">{result.journey.name}</h3>
                    
                    {result.journey.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className={`h-2.5 rounded-full ${result.journey.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${result.journey.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {result.steps.map((step: any, j: number) => (
                        <div 
                          key={j}
                          className={`p-3 border rounded ${
                            step.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <p>Step {j+1}: {step.name}</p>
                            <Badge className={step.success ? 'bg-green-500' : 'bg-red-500'}>
                              {step.success ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                          {step.errorMessage && (
                            <p className="text-sm text-red-600 mt-1">{step.errorMessage}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {journeyResults.length === 0 && !isRunningJourneys && (
                  <p className="text-gray-500 text-center py-4">
                    No journeys have been run yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingDashboard;
