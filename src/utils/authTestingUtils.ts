
import { supabase } from '@/lib/supabase';

interface TestCredentials {
  email: string;
  password: string;
  type: 'admin' | 'expert' | 'user';
}

interface TestResult {
  success: boolean;
  message: string;
  duration: number;
  details?: any;
}

class AuthTestingUtils {
  private testCredentials: TestCredentials[] = [
    {
      email: 'admin@ifindlife.com',
      password: 'admin123',
      type: 'admin'
    },
    {
      email: 'test@expert.com',
      password: 'expert123',
      type: 'expert'
    },
    {
      email: 'user@test.com',
      password: 'user123',
      type: 'user'
    }
  ];

  async testLogin(credentials: TestCredentials): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      console.log(`🔒 Testing ${credentials.type} login:`, credentials.email);
      
      // Store session type
      localStorage.setItem('sessionType', credentials.type);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      const duration = performance.now() - startTime;

      if (error) {
        return {
          success: false,
          message: `${credentials.type} login failed: ${error.message}`,
          duration,
          details: { error: error.message, code: error.status }
        };
      }

      if (!data.session) {
        return {
          success: false,
          message: `${credentials.type} login failed: No session created`,
          duration,
          details: { reason: 'No session' }
        };
      }

      // Verify profile based on type
      let profileCheck = false;
      if (credentials.type === 'user') {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        profileCheck = !!profile;
      } else if (credentials.type === 'expert') {
        const { data: profile } = await supabase
          .from('experts')
          .select('*')
          .eq('id', data.user.id)
          .single();
        profileCheck = !!profile;
      } else if (credentials.type === 'admin') {
        const { data: profile } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        profileCheck = !!profile;
      }

      return {
        success: true,
        message: `${credentials.type} login successful`,
        duration,
        details: {
          userId: data.user.id,
          email: data.user.email,
          hasProfile: profileCheck,
          sessionType: credentials.type
        }
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        success: false,
        message: `${credentials.type} login error: ${error}`,
        duration,
        details: { error: String(error) }
      };
    }
  }

  async testLogout(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      console.log('🔒 Testing logout');
      
      const { error } = await supabase.auth.signOut();
      const duration = performance.now() - startTime;

      if (error) {
        return {
          success: false,
          message: `Logout failed: ${error.message}`,
          duration,
          details: { error: error.message }
        };
      }

      // Clear localStorage
      localStorage.removeItem('sessionType');

      return {
        success: true,
        message: 'Logout successful',
        duration,
        details: { cleared: 'sessionType' }
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        success: false,
        message: `Logout error: ${error}`,
        duration,
        details: { error: String(error) }
      };
    }
  }

  async testSessionPersistence(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      console.log('🔒 Testing session persistence');
      
      const { data, error } = await supabase.auth.getSession();
      const duration = performance.now() - startTime;

      if (error) {
        return {
          success: false,
          message: `Session check failed: ${error.message}`,
          duration,
          details: { error: error.message }
        };
      }

      const hasSession = !!data.session;
      const storedSessionType = localStorage.getItem('sessionType');

      return {
        success: true,
        message: `Session persistence check complete`,
        duration,
        details: {
          hasSession,
          storedSessionType,
          userId: data.session?.user?.id || null,
          email: data.session?.user?.email || null
        }
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        success: false,
        message: `Session persistence error: ${error}`,
        duration,
        details: { error: String(error) }
      };
    }
  }

  async runFullAuthTest(): Promise<{ results: TestResult[], summary: string }> {
    console.log('🔒 Starting comprehensive auth test suite...');
    
    const results: TestResult[] = [];

    // Test session persistence first
    results.push(await this.testSessionPersistence());

    // Test logout (in case there's an existing session)
    results.push(await this.testLogout());

    // Test each login type
    for (const credentials of this.testCredentials) {
      const loginResult = await this.testLogin(credentials);
      results.push(loginResult);
      
      if (loginResult.success) {
        // Test logout after successful login
        const logoutResult = await this.testLogout();
        results.push(logoutResult);
      }
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Final session persistence test
    results.push(await this.testSessionPersistence());

    // Generate summary
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / total;

    const summary = `
🔒 Auth Test Suite Results:
- Total Tests: ${total}
- Successful: ${successful}
- Failed: ${total - successful}
- Success Rate: ${((successful / total) * 100).toFixed(1)}%
- Average Duration: ${averageDuration.toFixed(2)}ms
    `;

    console.log(summary);
    results.forEach(result => {
      console.log(`${result.success ? '✅' : '❌'} ${result.message} (${result.duration.toFixed(2)}ms)`);
    });

    return { results, summary };
  }
}

export const authTestingUtils = new AuthTestingUtils();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).authTestingUtils = authTestingUtils;
}
