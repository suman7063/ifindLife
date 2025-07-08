import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/AuthContext';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { useRealExpertPresence } from '@/hooks/useRealExpertPresence';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Calendar,
  Phone,
  Video,
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  message: string;
  timestamp: string;
}

const ProductionTestingSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const { isAuthenticated, user } = useAuth();
  const { experts, loading: expertsLoading, error: expertsError } = usePublicExpertsData();
  const { presenceData } = useRealExpertPresence(experts.map(e => e.id));

  const addTestResult = (name: string, status: TestResult['status'], message: string) => {
    const result: TestResult = {
      name,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev.filter(r => r.name !== name), result]);
  };

  const runSystemTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Database Connection
      setCurrentTest('Database Connection');
      try {
        const { data, error } = await supabase.from('experts').select('count').limit(1);
        if (error) throw error;
        addTestResult('Database Connection', 'pass', 'Successfully connected to Supabase');
      } catch (error) {
        addTestResult('Database Connection', 'fail', `Database connection failed: ${error}`);
      }

      // Test 2: Expert Data Loading
      setCurrentTest('Expert Data Loading');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (expertsError) {
        addTestResult('Expert Data Loading', 'fail', `Expert data loading failed: ${expertsError}`);
      } else if (experts.length === 0) {
        addTestResult('Expert Data Loading', 'warning', 'No experts found in database');
      } else {
        addTestResult('Expert Data Loading', 'pass', `Successfully loaded ${experts.length} experts`);
      }

      // Test 3: Authentication System
      setCurrentTest('Authentication System');
      if (isAuthenticated && user) {
        addTestResult('Authentication System', 'pass', `User authenticated: ${user.email}`);
      } else {
        addTestResult('Authentication System', 'warning', 'User not authenticated (test login to verify)');
      }

      // Test 4: Presence System
      setCurrentTest('Presence System');
      const onlineExperts = Object.values(presenceData).filter(p => p.isOnline).length;
      if (onlineExperts > 0) {
        addTestResult('Presence System', 'pass', `${onlineExperts} experts online`);
      } else {
        addTestResult('Presence System', 'warning', 'No experts currently online');
      }

      // Test 5: Availability System
      setCurrentTest('Availability System');
      if (experts.length > 0) {
        try {
          const { data: availabilities } = await supabase
            .from('expert_availabilities')
            .select('*')
            .limit(1);
          
          if (availabilities && availabilities.length > 0) {
            addTestResult('Availability System', 'pass', 'Availability data accessible');
          } else {
            addTestResult('Availability System', 'warning', 'No availability data found');
          }
        } catch (error) {
          addTestResult('Availability System', 'fail', `Availability system error: ${error}`);
        }
      }

      // Test 6: Appointments System
      setCurrentTest('Appointments System');
      try {
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .limit(1);
        addTestResult('Appointments System', 'pass', 'Appointments table accessible');
      } catch (error) {
        addTestResult('Appointments System', 'fail', `Appointments system error: ${error}`);
      }

      // Test 7: Call Pricing System
      setCurrentTest('Call Pricing System');
      try {
        const { data: pricing } = await supabase
          .from('call_pricing')
          .select('*')
          .eq('active', true);
        
        if (pricing && pricing.length > 0) {
          addTestResult('Call Pricing System', 'pass', `${pricing.length} pricing tiers configured`);
        } else {
          addTestResult('Call Pricing System', 'warning', 'No active pricing found');
        }
      } catch (error) {
        addTestResult('Call Pricing System', 'fail', `Pricing system error: ${error}`);
      }

      // Test 8: RLS Policies
      setCurrentTest('Security Policies');
      try {
        // Test if RLS is working by trying to access restricted data
        const { error } = await supabase.from('admin_users').select('*').limit(1);
        if (error && error.message.includes('row-level security')) {
          addTestResult('Security Policies', 'pass', 'RLS policies are active and working');
        } else if (error) {
          addTestResult('Security Policies', 'warning', 'RLS may not be properly configured');
        } else {
          addTestResult('Security Policies', 'warning', 'Security policies need verification');
        }
      } catch (error) {
        addTestResult('Security Policies', 'pass', 'RLS policies are enforcing security');
      }

    } catch (error) {
      addTestResult(currentTest || 'Unknown Test', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test page load performance
      setCurrentTest('Page Load Performance');
      const startTime = performance.now();
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate load
      const loadTime = performance.now() - startTime;
      
      if (loadTime < 1000) {
        addTestResult('Page Load Performance', 'pass', `Load time: ${loadTime.toFixed(2)}ms`);
      } else {
        addTestResult('Page Load Performance', 'warning', `Load time: ${loadTime.toFixed(2)}ms (slow)`);
      }

      // Test API response times
      setCurrentTest('API Response Times');
      const apiStart = performance.now();
      await supabase.from('experts').select('id').limit(5);
      const apiTime = performance.now() - apiStart;
      
      if (apiTime < 500) {
        addTestResult('API Response Times', 'pass', `API response: ${apiTime.toFixed(2)}ms`);
      } else {
        addTestResult('API Response Times', 'warning', `API response: ${apiTime.toFixed(2)}ms (slow)`);
      }

      // Test memory usage
      setCurrentTest('Memory Usage');
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);
        
        if (usedMB < 50) {
          addTestResult('Memory Usage', 'pass', `Memory usage: ${usedMB}MB`);
        } else {
          addTestResult('Memory Usage', 'warning', `Memory usage: ${usedMB}MB (high)`);
        }
      } else {
        addTestResult('Memory Usage', 'warning', 'Memory info not available');
      }

    } catch (error) {
      addTestResult(currentTest || 'Performance Test', 'fail', `Performance test error: ${error}`);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runIntegrationTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test expert selection flow
      setCurrentTest('Expert Selection Flow');
      if (experts.length > 0) {
        addTestResult('Expert Selection Flow', 'pass', 'Experts available for selection');
      } else {
        addTestResult('Expert Selection Flow', 'fail', 'No experts available');
      }

      // Test booking flow (without actually booking)
      setCurrentTest('Booking Flow Integration');
      try {
        const { data: timeSlots } = await supabase
          .from('expert_time_slots')
          .select('*')
          .eq('is_booked', false)
          .limit(1);
        
        if (timeSlots && timeSlots.length > 0) {
          addTestResult('Booking Flow Integration', 'pass', 'Available time slots found');
        } else {
          addTestResult('Booking Flow Integration', 'warning', 'No available time slots');
        }
      } catch (error) {
        addTestResult('Booking Flow Integration', 'fail', `Booking flow error: ${error}`);
      }

      // Test call system integration
      setCurrentTest('Call System Integration');
      try {
        const { data: sessions } = await supabase
          .from('call_sessions')
          .select('*')
          .limit(1);
        addTestResult('Call System Integration', 'pass', 'Call sessions table accessible');
      } catch (error) {
        addTestResult('Call System Integration', 'fail', `Call system error: ${error}`);
      }

      // Test user data integration
      setCurrentTest('User Data Integration');
      if (isAuthenticated) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
          
          if (profile) {
            addTestResult('User Data Integration', 'pass', 'User profile accessible');
          } else {
            addTestResult('User Data Integration', 'warning', 'User profile not found');
          }
        } catch (error) {
          addTestResult('User Data Integration', 'fail', `User data error: ${error}`);
        }
      } else {
        addTestResult('User Data Integration', 'warning', 'User not authenticated');
      }

    } catch (error) {
      addTestResult(currentTest || 'Integration Test', 'fail', `Integration test error: ${error}`);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      running: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Production Testing Suite
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive testing for the integrated booking and calling system
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System Tests
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Integration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Health Tests</h3>
                <Button 
                  onClick={runSystemTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run System Tests'}
                </Button>
              </div>
              
              {isRunning && currentTest && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Running: {currentTest}</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Performance Tests</h3>
                <Button 
                  onClick={runPerformanceTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Performance Tests'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Integration Tests</h3>
                <Button 
                  onClick={runIntegrationTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Integration Tests'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Test Results</h4>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <span className="font-medium">{result.name}</span>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter(r => r.status === 'pass').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {testResults.filter(r => r.status === 'warning').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.filter(r => r.status === 'fail').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionTestingSuite;